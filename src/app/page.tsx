"use client";

import styles from "./page.module.css";
import * as MPHands from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks } from "@mediapipe/drawing_utils";
import { handPoseMachineConfig } from './handPoseMachine';
import {createMachine } from 'xstate';
import { useMachine } from '@xstate/react';


type pointerStyle = {
  display: string,
  left: string,
  top: string,
}

export default function Home() {
  const frame = useRef<any>(null);
  const camera = useRef<Camera|null>(null);
  const vision = useRef<any>(null);
  const grec = useRef<MPHands.GestureRecognizer|null>(null);
  const frameCanvas = useRef<HTMLCanvasElement>(null);
  const text1 = useRef<HTMLParagraphElement>(null);
  const text2 = useRef<HTMLParagraphElement>(null);
  const [num, setNum] = useState<number>(1);
  const [showVid, setShowVid] = useState<boolean>(false);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [pointerStyles, setPointerStyles] = useState<pointerStyle>({display: 'none', left: '0%', top: '0%'});
  const [gestureHistory1stHand, setGestureHistory1stHand] = useState<string[]>(["none", "none", "none", "none", "none"]);
  const [gestureHistory2ndHand, setGestureHistory2ndHand] = useState<string[]>(["none", "none", "none", "none", "none"]);
  const previousGesture = useRef<string>("none");

  const act = {
    actions: {
        goToTimestamp: () => {
            console.log('Go to timestamp')
        },

        playVideo: () => {
            console.log('Play video')
        },

        stopVideo: () => {
            console.log('Stop video')
        },

        forward_video: () => {
           console.log('Forward video')
        },

        rewind_video: () => {
            console.log('Rewind video')
        },

        goToSlideNumber: () => {
           console.log('Go to slide number')
        },

        goToNextSlide: () => {
           console.log('Go to next slide')
        },

        goToPrevSlide: () => {
            //console.log(context);

            //var newNum: number = context.num - 1;
            //context.setNum(newNum);
            //localStorage.setItem('slide', newNum.toString());
        },

        enablePointer: () => {
            console.log('Enable pointer')
        },

        presentationMode: () => {
            console.log('Machine enabled');
            toggleMode(true);
            toggleVid(false);
        },

        videoMode: () => {
          toggleVid(true);
        },

        machine_disabled: () => {
            console.log('Machine disabled');
            toggleMode(false);
        }
    }
}

  const [state, send] = useMachine(createMachine(handPoseMachineConfig, act));

  const cameraSettings = {
    width: 1280,
    height: 720,
  }

  async function setupCamera() {
    camera.current = new Camera(frame.current!, {onFrame: predictGesture, width: cameraSettings.width, height: cameraSettings.height})
    camera.current.start();
  }

  async function predictGesture() {
    const canvas: CanvasRenderingContext2D = frameCanvas.current!.getContext('2d')!;
    canvas.save();
    canvas.clearRect(0, 0, 1280, 720);
    canvas.drawImage(frame.current, 0, 0, 1280, 720);

    let results: MPHands.GestureRecognizerResult|undefined = grec.current?.recognizeForVideo(frame.current, Date.now());

    if (results) {
      //console.log(results)

      let isFirst = true;

      if (frameCanvas.current) { 
        if (results.landmarks) {
          results.landmarks.forEach((landmarks) => {
            drawLandmarks(canvas, landmarks, {color: "#ffffff", lineWidth: 1,});
          })
  
        }

        results.gestures.forEach((gesture) => {
          if(isFirst) {
            let gestureHistory = gestureHistory1stHand;
            gestureHistory.shift();

            gestureHistory.push(gesture[0].categoryName);

            //console.log(gestureHistory);

            //console.log(gestureHistory1stHand);
            //console.log("-------");

            setGestureHistory1stHand(gestureHistory);
            text1.current!.innerText = gesture[0].categoryName !== "" ? gesture[0].categoryName : "none";
            isFirst = false;
          } else {
            const [firstGesture, ...restOfGestureHistory ] = gestureHistory2ndHand;
            setGestureHistory2ndHand([...restOfGestureHistory, gesture[0].categoryName]);
            text2.current!.innerText = gesture[0].categoryName !== "" ? gesture[0].categoryName : "none";

          }

          //console.log(gesture)
          
          //console.log(gesture[0].categoryName);


        })
        let newGesture = gestureHistory1stHand.filter((gesture) => gesture === gestureHistory1stHand[4]).length > 2 ? gestureHistory1stHand[4] : "none";

        if(newGesture !== null && newGesture !== "" && newGesture !== "none" && newGesture !== previousGesture.current) {
          console.log(`new gesture is: ${newGesture}`);
          console.log(`prev gesture is: ${previousGesture.current}`);
          previousGesture.current = newGesture;

          switch(newGesture) {
            case 'PalmTilded':
              send({type: 'PalmTilded', context: {num: num, setNum: setNum}});
              break;
            case 'PalmUp':
              send({type: 'PalmUp'});
              break;
            case 'FistThumbExt':
              send({type: 'enablePointer'});
              break;
            case '2FingersExt':
              send({type: '2FingersExt'});
              break;
            case '3FingersExt':
              send({type: '3FingersExt'});
              break;
            case '4FingersExt':
              send({type: '4FingersExt'});
              break;
            case '5FingersExt':
              send({type: '5FingersExt'});
              break;
            case 'Pointing':
              send({type: 'Pointing'});
              break;
            case 'TwoFingersSide':
              send({type: 'TwoFingersSide'});
              break;
            case 'TwoFingersUp':
              send({type: 'TwoFingersUp'});
              break;
            case 'ThumbsUp':
              send({type: 'ThumbsUp', context: {num: num, setNum: setNum}});
              break;
            case 'ThumbsDown':
              send({type: 'ThumbsDown'});
              break;
            case 'Fist':
              send({type: 'Fist'});
              break;
            case 'none':
            send({type: 'NONE'});
            break;
            default:
              send({type: 'NONE'});
              break;
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
      numHands: 2,
      baseOptions: {
        modelAssetPath: "./gesture_recognizer.task",
        delegate: "GPU",
      },
    });

    grec.current.setOptions({ runningMode: "VIDEO", numHands: 2, customGesturesClassifierOptions: {scoreThreshold: 0.8} })
  }

  async function prevSlide() {
    var newNum: number = num - 1;
    setNum(newNum);
    localStorage.setItem('slide', newNum.toString());
  }

  async function nextSlide() {
    var newNum: number = num + 1;
    setNum(newNum);
    localStorage.setItem('slide', newNum.toString());
  }

  async function toggleVid(newShowVid: boolean) {
    setShowVid(newShowVid);
    localStorage.setItem('showVideo', newShowVid.toString());
    console.log(newShowVid.toString())
  }

  async function toggleMode(newPresentationMode: boolean) {
    setPresentationMode(newPresentationMode);
    localStorage.setItem('presentationMode', newPresentationMode.toString());
    console.log(newPresentationMode.toString())
  }

  async function getStoredItems() {
    setNum(parseInt(localStorage.getItem('slide') ?? "1") ?? 1);
    setShowVid(localStorage.getItem('showVideo') === "true");
  }

  useEffect( () => {
    getStoredItems();
    setupCamera();
    setupHands();
  }, []);

  const videoConstraints = {
    width: 1280,
    height: 720,
  }

  return (
    <main className={styles.main}>
        <div className={styles.pointer} style={pointerStyles} />
        <div className={styles.titleDiv}>
          <header className={styles.title}>Hand Recognition</header>
          <a href="/presentation" target="_blank">Open</a>
        </div>
        <div className={styles.hidden}>
          <video style={{ display: 'none' }} playsInline ref={frame}/>
        </div>
      <div className={styles.canvas}>
        <canvas ref={frameCanvas} width={cameraSettings.width} height={cameraSettings.height}/>
        <p className={styles.handsign1} ref={text1}>None</p>
        <p className={styles.handsign2} ref={text2}>None</p>
        <div className={styles.state}>
          <p>{state.value.toString()}</p>
        </div>
        <button onClick={prevSlide}>prev</button>
        <button onClick={nextSlide}>next</button>
      </div>
    </main>
  );
}
