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
      },
      captureSlide(t: number){
        console.log("Here5");
        console.log(video.current!.duration);
        var newTime = video.current!.duration * t;
        console.log(t);
        console.log(newTime);
        video.current!.currentTime = newTime;
      }
    }));

  return (
      <div className={props.styles}>     
      {props.video 
      ? <video ref={video} controls={props.controls??false}><source src={props.video} type="video/mp4"/></video> 
      : <p>No Video</p>}
      </div>
  );
});

export default VideoElement;
