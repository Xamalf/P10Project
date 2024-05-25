"use client";
import styles from "./presentationView.module.css";
import VideoElement from "./videoElement"
import PresentationElement from "./presentationElement";
import { useRef, useEffect } from "react";

export default function PresentationView(props: any) {
  const video = useRef<any>(null);

  const play = () => { video.current && video.current.play() }
  const pause = () => { video.current && video.current.pause() }
  const time = (e: any) => { video.current && video.current.skip(e.detail); }
  const captureSlide = (e: any) => { video.current && video.current.captureSlide(e.detail); }
  


  function addEventListeners() {
    document.addEventListener('play', play);
    document.addEventListener('pause', pause);
    document.addEventListener('skip', time);
    document.addEventListener('captureSlide', captureSlide);
  }

  function removeEventListeners() {
    document.removeEventListener('play', play);
    document.removeEventListener('pause', pause);
    document.removeEventListener('skip', time);
    document.removeEventListener('captureSlide', captureSlide);
  }

  useEffect( () => {
    addEventListeners();

    return () => {
      removeEventListeners()
    }
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.pointer} style={props.pointerStyles} />
      {props.showVideo 
      ? <VideoElement ref={video} video={props.video} styles={styles.videoElement} controls={props.showControls} />
      : <PresentationElement pdf={props.pdf} page={props.page} styles={styles.presentationElement}/>
      }
    </div>
  );
}
