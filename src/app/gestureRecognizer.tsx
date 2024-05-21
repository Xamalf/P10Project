"use client";
import styles from "./gestureRecognizer.module.css";
import { useRef, useEffect, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks } from "@mediapipe/drawing_utils";
import * as MPHands from "@mediapipe/tasks-vision";
import Grid from '@mui/material/Unstable_Grid2'

export default function Gesture(props: any) {
  const frame = useRef<any>(null);
  const camera = useRef<Camera|null>(null);
  const vision = useRef<any>(null);
  const grec = useRef<MPHands.GestureRecognizer|null>(null);
  const frameCanvas = useRef<HTMLCanvasElement>(null);
  const text1 = useRef<HTMLParagraphElement>(null);
  const [gestureHistory1stHand, setGestureHistory1stHand] = useState<string[]>(["none", "none", "none", "none", "none"]);
  const previousGesture = useRef<string>("none");
  const pointerVals = useRef<number[]>([0, 0, 0, 0]);
  const [pointerHistoryX, setPointerHistoryX] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [pointerHistoryY, setPointerHistoryY] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const precision = 10000000;

  async function setupCamera() {
    camera.current = new Camera(frame.current!, {onFrame: predictGesture, width: 1280, height: 720})
    camera.current.start();
  }

  async function predictGesture() {
    const canvas: CanvasRenderingContext2D = frameCanvas.current!.getContext('2d')!;
    canvas.save();
    canvas.clearRect(0, 0, 1280, 720);
    canvas.drawImage(frame.current, 0, 0, 1280, 720);

    let results: MPHands.GestureRecognizerResult|undefined = grec.current?.recognizeForVideo(frame.current, Date.now());

    if (results) {
      if (frameCanvas.current) { 
        if (results.landmarks) {
          results.landmarks.forEach((landmarks) => {
            drawLandmarks(canvas, landmarks, {color: "#ffffff", lineWidth: 1,});
          })
  
        }

        results.gestures.forEach((gesture) => {
            let gestureHistory = gestureHistory1stHand;
            gestureHistory.shift();

            gestureHistory.push(gesture[0].categoryName);

            if (props.showPointer.current) {
              var point = results.landmarks[0][4]; 
              let xHistory = pointerHistoryX;
              let yHistory = pointerHistoryY;
              xHistory.shift(); 
              yHistory.shift(); 
              xHistory.push(point.x);
              yHistory.push(point.y);

              var avgx = xHistory.reduce((sum, x) => sum + x) / xHistory.length;
              var avgy = yHistory.reduce((sum, y) => sum + y) / yHistory.length;

              var x = (avgx * precision - pointerVals.current[0]) / pointerVals.current[1];
              var y = (avgy * precision - pointerVals.current[2]) / pointerVals.current[3];

              props.pointerStyles.current = {display: 'block', left: (100-x*100).toString() + '%', top: (y*100).toString() + '%'};
              props.viewPointer();
              setPointerHistoryX(xHistory);
              setPointerHistoryY(yHistory);
            }

            setGestureHistory1stHand(gestureHistory);
            text1.current!.innerText = gesture[0].categoryName !== "" ? gesture[0].categoryName : "none";
        })
        let newGesture = gestureHistory1stHand.filter((gesture) => gesture === gestureHistory1stHand[4]).length > 2 ? gestureHistory1stHand[4] : "none";

        if (props.getPointerVals.current) {
          var IndexFingerTip = results.landmarks[0][4];
          var Wrist = results.landmarks[0][0];

          var length = Math.sqrt(Math.pow(IndexFingerTip.x * precision - Wrist.x * precision, 2) + Math.pow(IndexFingerTip.y * precision - Wrist.y * precision, 2));
          var width = length;
          var height = length;

          pointerVals.current[0] = IndexFingerTip.x * precision - width;
          pointerVals.current[1] = width * 2;
          pointerVals.current[2] = IndexFingerTip.y * precision - height;
          pointerVals.current[3] = height * 2;
          props.getPointerVals.current = false;
        }

        if(newGesture !== null && newGesture !== "" && newGesture !== "none" && newGesture !== previousGesture.current) {
          previousGesture.current = newGesture;
          props.newGestureRef.current.newGesture(newGesture);
        }
        canvas.restore();
    }
    }
  }

  async function setupHands() {
    vision.current = await MPHands.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");

    grec.current = await MPHands.GestureRecognizer.createFromOptions(vision.current, {
      numHands: 1,
      baseOptions: {
        modelAssetPath: "./gesture_recognizer.task",
        delegate: "GPU",
      },
    });

    grec.current.setOptions({ runningMode: "VIDEO", numHands: 1, customGesturesClassifierOptions: {scoreThreshold: 0.8} })
  }

  useEffect( () => {
    setupCamera();
    setupHands();
  }, []);

  return (
    <Grid justifyContent='center' xs={3}>
        <Grid alignItems='center' container spacing={2} columns={2}>
            <Grid xs={2}>
            <div className={styles.canvasDiv}>
                <canvas className={styles.canvas} ref={frameCanvas} width={1280} height={720}/>
            </div>
            </Grid>
            <Grid xs={2}>
            <p className={styles.handsign} ref={text1}>None</p>
            </Grid>
        </Grid>
        <div className={styles.hidden}>
            <video style={{ display: 'none' }} playsInline ref={frame}/>
        </div>
    </Grid>
  );
}
