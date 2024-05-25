"use client";
import styles from "./gestureRecognizer.module.css";
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks } from "@mediapipe/drawing_utils";
import * as MPHands from "@mediapipe/tasks-vision";
import Grid from '@mui/material/Unstable_Grid2'

const Gesture = forwardRef((props: any, ref) => {
  const frame = useRef<any>(null);
  const camera = useRef<Camera|null>(null);
  const vision = useRef<any>(null);
  const grec = useRef<MPHands.GestureRecognizer|null>(null);
  const frameCanvas = useRef<HTMLCanvasElement>(null);
  const text1 = useRef<HTMLParagraphElement>(null);
  const [gestureHistory, setGestureHistory] = useState<string[]>(["none", "none", "none", "none", "none"]);
  const previousGesture = useRef<string>("none");
  const pointerVals = useRef<number[]>([0, 0, 0, 0]);
  const [pointerHistoryX, setPointerHistoryX] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [pointerHistoryY, setPointerHistoryY] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const precision = 10000000;

  useImperativeHandle(ref, () => ({
    resetPreviousGesture: () => { previousGesture.current = "none"; },
  }));

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
      if (frameCanvas.current && results.landmarks && results.landmarks[0]) { 
        results.landmarks.forEach((landmarks) => {
          drawLandmarks(canvas, landmarks, {color: "#ffffff", lineWidth: 1,});
        })

        var IndexFingerTip = results.landmarks[0][8];
        var Wrist = results.landmarks[0][0];

        if (props.getPointerVals.current) {
          var length = Math.sqrt(Math.pow(IndexFingerTip.x * precision - Wrist.x * precision, 2) + Math.pow(IndexFingerTip.y * precision - Wrist.y * precision, 2));

          pointerVals.current[0] = IndexFingerTip.x * precision - length;
          pointerVals.current[1] = length * 2;
          pointerVals.current[2] = IndexFingerTip.y * precision - length;
          pointerVals.current[3] = length * 2;
          props.getPointerVals.current = false;
        }

        if (results.gestures && results.gestures[0] && results.gestures[0][0]) {
          let gestureName = results.gestures[0][0].categoryName;

          let gestureHistoryLocal = gestureHistory;
          gestureHistoryLocal.shift();
          gestureHistoryLocal.push(gestureName);

          if (props.showPointer.current) {
            let xHistory = pointerHistoryX;
            let yHistory = pointerHistoryY;
            xHistory.shift(); 
            yHistory.shift(); 
            xHistory.push(IndexFingerTip.x);
            yHistory.push(IndexFingerTip.y);

            var avgx = xHistory.reduce((sum, x) => sum + x) / xHistory.length;
            var avgy = yHistory.reduce((sum, y) => sum + y) / yHistory.length;

            var x = (avgx * precision - pointerVals.current[0]) / pointerVals.current[1];
            var y = (avgy * precision - pointerVals.current[2]) / pointerVals.current[3];

            props.pointerStyles.current = {display: 'block', left: (100-x*100).toString() + '%', top: (y*100).toString() + '%'};
            props.viewPointer();
            setPointerHistoryX(xHistory);
            setPointerHistoryY(yHistory);
          }

          if (props.captureSlideVals.current) {
            let xHistory = pointerHistoryX;
            xHistory.shift();
            xHistory.push(IndexFingerTip.x);

            var avgx = xHistory.reduce((sum, x) => sum + x) / xHistory.length;

            var x = (avgx * precision - pointerVals.current[0]) / pointerVals.current[1];

            props.updateView(x);
            setPointerHistoryX(xHistory);
          }

          setGestureHistory(gestureHistory);
          text1.current!.innerText = gestureName !== "" ? gestureName : "none";

          let newGesture = gestureHistory.filter((gesture) => gesture === gestureHistory[4]).length > 2 ? gestureHistory[4] : "none";

          if(newGesture !== null && newGesture !== "" && newGesture !== "none" && newGesture !== previousGesture.current) {
            previousGesture.current = newGesture;
            props.newGestureRef.current.newGesture(newGesture);
          }
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
});

export default Gesture;