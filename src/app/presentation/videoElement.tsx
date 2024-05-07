"use client";
import { useRef, useImperativeHandle, forwardRef } from "react";

const VideoElement = forwardRef((props: any, ref) => {
  const video = useRef<HTMLVideoElement|null>(null);

    useImperativeHandle(ref, () => ({
      play() {
        video.current!.play();
      },
      pause() {
        video.current!.pause();
      },
      skip(t: number){
        video.current!.currentTime += t;
      }
    }));

  return (
      <div className={props.styles}>     
      {props.video 
      ? <video ref={video} controls={props.controls??false}><source src={props.video} type="video/mp4"/></video> 
      : <p style={{color: "white"}}>No Video</p>}
      </div>
  );
});

export default VideoElement;
