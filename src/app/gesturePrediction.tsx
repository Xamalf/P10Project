"use client";
import styles from "./gesturePrediction.module.css";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";

const GesturePrediction = forwardRef((props: any, ref) => {
  const text = useRef<HTMLParagraphElement>(null);
  const [gestureHistory, setGestureHistory] = useState<string[]>(["none", "none", "none", "none", "none"]);
  const pointerVals = useRef<number[]>([0, 0, 0, 0]);
  const [pointerHistoryX, setPointerHistoryX] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [pointerHistoryY, setPointerHistoryY] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [slideHistoryX, setSlideHistoryX] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const precision = 10000000;

  useImperativeHandle(ref, () => ({
    predictGesture: predictGesture,
  }));

  async function predictGesture(results: any) {
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

            props.pointerStyles.current = {display: 'block', left: (x*100).toString() + '%', top: (y*100).toString() + '%'};
            props.viewPointer();
            setPointerHistoryX(xHistory);
            setPointerHistoryY(yHistory);
          }

          if (props.captureSlideVals.current) {
            let slideHistory = slideHistoryX;
            slideHistory.shift();
            slideHistory.push(Wrist.x);

            var avgx = slideHistory.reduce((sum, x) => sum + x) / slideHistory.length;

            var x = (avgx * precision - pointerVals.current[0]) / pointerVals.current[1];

            props.updateView(x);
            setSlideHistoryX(slideHistory);
          }

          setGestureHistory(gestureHistory);
          text.current!.innerText = gestureName !== "" ? gestureName : "none";

          let newGesture = gestureHistory.filter((gesture) => gesture === gestureHistory[4]).length > 2 ? gestureHistory[4] : "none";

          if(newGesture !== null && newGesture !== "" && newGesture !== "none" && newGesture !== props.previousGesture.current) {
            props.previousGesture.current = newGesture;
            props.newGestureRef.current.newGesture(newGesture);
          }
        }
  }

  return (
    <p className={styles.handsign} ref={text}>None</p>
  );
});

GesturePrediction.displayName = 'gesturePrediction';

export default GesturePrediction;