"use client";
import styles from "./gestureRecognizer.module.css";
import { useRef, useEffect } from "react";
import { Camera as MPCam } from "@mediapipe/camera_utils";

export default function Camera(props: any) {
  const frame = useRef<any>(null);
  const camera = useRef<MPCam|null>(null);

  async function setupCamera() {
    camera.current = new MPCam(frame.current!, {onFrame: newfrmae, width: 1280, height: 720})
    camera.current.start();
  }

  async function newfrmae() {
    props.recognizeFrame(frame.current);
  }

  useEffect( () => {
    setupCamera();

    return () => {
      camera.current?.stop()
    }
  }, []);

  return (
    <div className={styles.hidden}>
        <video style={{ display: 'none' }} playsInline ref={frame}/>
    </div>
  );
};
