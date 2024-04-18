"use client";
import styles from "./page.module.css";
import VideoElement from "./videoElement"
import PresentationElement from "./presentationElement";

export default function PresentationView(props: any) { 
  return (
    <div>
      <div className={styles.pointer} style={props.pointerStyles} />
      {props.showVideo 
      ? <VideoElement video={props.video}/>
      : <PresentationElement pdf={props.pdf} page={props.page}/>
      }
    </div>
  );
}
