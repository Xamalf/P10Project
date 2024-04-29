"use client";

import styles from "./page.module.css";
import * as MPHands from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks } from "@mediapipe/drawing_utils";


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
  const text = useRef<HTMLParagraphElement>(null);
  const [num, setNum] = useState<number>(1);
  const [showVid, setShowVid] = useState<boolean>(false);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [pointerStyles, setPointerStyles] = useState<pointerStyle>({display: 'none', left: '0%', top: '0%'});

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

    let results: MPHands.GestureRecognizerResult|undefined = grec.current?.recognize(frame.current)

    if (results) {
      console.log(results)

      if (frameCanvas.current) { 
        if (results.landmarks) {
          results.landmarks.forEach((landmarks) => {
            drawLandmarks(canvas, landmarks, {color: "#ffffff", lineWidth: 1,});
          })
  
        }
  
        results.gestures.forEach((test) => {
          console.log(test)
          text.current!.innerText = test[0].categoryName;
          console.log(test[0].categoryName);
        })

        if (results.gestures[0] && results.gestures[0][0].categoryName === 'FistThumbExt') {
          var point = results.landmarks[0][4];  
          setPointerStyles({display: 'block', left: (100-Math.round(point.x*100)).toString() + '%', top: (Math.round(point.y*100)).toString() + '%'});
          localStorage.setItem('pointer', JSON.stringify({display: 'block', left: (100-Math.round(point.x*100)).toString() + '%', top: (Math.round(point.y*100)).toString() + '%'}));
          console.log(pointerStyles)
        }
        else {
          setPointerStyles({display: 'none', left: '0%', top: '0%'});
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

    grec.current.setOptions({ runningMode: "IMAGE", numHands: 2 })
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

  async function toggleVid() {
    var newShowVid: boolean = !showVid;
    setShowVid(newShowVid);
    localStorage.setItem('showVideo', newShowVid.toString());
    console.log(newShowVid.toString())
  }

  async function toggleMode() {
    var newPresentationMode: boolean = !presentationMode;
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
            <p ref={text}>None</p>
            <button onClick={prevSlide}>prev</button>
            <button onClick={nextSlide}>next</button>
            <button onClick={toggleVid}>toggleVid</button>
            <button onClick={toggleMode}>toggleMode</button>
        </div>
    </main>
  );
}
