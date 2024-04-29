"use client";
import styles from "./setupView.module.css";
import VideoElement from "./videoElement"
import PresentationElement from "./presentationElement";

export default function SetupView(props: any) {
  const newPDF = (event: any) => {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
        props.setPdf(event.target.files[0]);
    }
  }

  const newVideo = (event: any) => {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
        props.setVideo(URL.createObjectURL(event.target.files[0]));
    }
  }

  return (
    <div className={styles.main}>
        <header className={styles.title}>Setup Presentation</header>
        <div className={styles.presentation}>
            <input className={styles.presentationInput} type="file" accept=".pdf" onChange={newPDF} />
            <PresentationElement pdf={props.pdf} styles={styles.presentationElement}/>
        </div>
        <div className={styles.video}>
            <input className={styles.videoInput} type="file" accept=".mp4" onChange={newVideo} />
            <VideoElement video={props.video} styles={styles.videoElement} controls={true}/>
        </div>
    </div>
  );
}
