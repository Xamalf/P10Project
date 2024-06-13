"use client";
import styles from "./gestureRecognizer.module.css";
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import Camera from "./camera";
import GesturePrediction from "./gesturePrediction";
import { drawLandmarks } from "@mediapipe/drawing_utils";
import * as MPHands from "@mediapipe/tasks-vision";
import Grid from '@mui/material/Unstable_Grid2'

const Gesture = forwardRef((props: any, ref) => {
  const vision = useRef<any>(null);
  const grec = useRef<MPHands.GestureRecognizer|null>(null);
  const frameCanvas = useRef<HTMLCanvasElement>(null);
  const previousGesture = useRef<string>("none");
  const gesturePrediction = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    resetPreviousGesture: () => { previousGesture.current = "none"; },
  }));

  async function recognizeFrame(frame: any) {
    const canvas: CanvasRenderingContext2D = frameCanvas.current!.getContext('2d')!;
    canvas.save();
    canvas.clearRect(0, 0, 1280, 720);
    canvas.drawImage(frame, 0, 0, 1280, 720);

    let results: MPHands.GestureRecognizerResult|undefined = grec.current?.recognizeForVideo(frame, Date.now());

    if (results) {
      if (frameCanvas.current && results.landmarks && results.landmarks[0]) { 
        results.landmarks.forEach((landmarks) => {
          drawLandmarks(canvas, landmarks, {color: "#ffffff", lineWidth: 1,});
        })
        
        gesturePrediction.current.predictGesture(results)
        
        canvas.restore();
      }
    }
  }

  async function setupHands() {
    vision.current = await MPHands.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");

    grec.current = await MPHands.GestureRecognizer.createFromOptions(vision.current, {
      numHands: 1,
      runningMode: "VIDEO",
      customGesturesClassifierOptions: {scoreThreshold: 0.5},
      baseOptions: {
        modelAssetPath: "./gesture_recognizer.task",
        delegate: "GPU",
      },
    });
  }

  useEffect( () => {
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
              <GesturePrediction ref={gesturePrediction} previousGesture={previousGesture} showPointer={props.showPointer} 
              pointerStyles={props.pointerStyles} viewPointer={props.viewPointer} getPointerVals={props.getPointerVals} 
              newGestureRef={props.newGestureRef} captureSlideVals={props.captureSlideVals} updateView={props.updateView} />
            </Grid>
        </Grid>
        <Camera recognizeFrame={recognizeFrame} />
    </Grid>
  );
});

Gesture.displayName = 'Gesture';

export default Gesture;