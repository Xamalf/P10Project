"use client";
import styles from "./setupView.module.css";

export default function VideoElement(props: any) {
  return (
      <div className={styles.videoElement}>     
      {props.video 
      ? <video controls><source src={props.video} type="video/mp4"/></video> 
      : <p style={{color: "white"}}>No Video</p>}
      </div>
  );
}
