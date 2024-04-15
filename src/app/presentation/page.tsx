"use client";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import VideoElement from "./videoElement"
import PresentationElement from "./presentationElement";

type pointerStyle = {
  display: string,
  left: string,
  top: string,
}

export default function Presentation() {
  const text = useRef<HTMLParagraphElement>(null);
  const [pdf, setPdf] = useState(null);
  const [showVideo, setShowVideo] = useState(true);
  const [page, setPage] = useState(1);
  const [video, setVideo] = useState("");
  const [pointerStyles, setPointerStyles] = useState<pointerStyle>({display: 'none', left: '0%', top: '0%'});
  
  useEffect( () => {
    window.onstorage = (ev) => {
      console.log(ev);

      switch (ev.key) {
        case "slide": setPage(parseInt(ev.newValue ?? "1") ?? 1); break;
        case "showVideo": setShowVideo(ev.newValue === "true"); break;
        case "pointer": setPointerStyles(JSON.parse(ev.newValue ?? "{}")); break;
      }
    }
  }, []);

  const newPDF = (event: any) => {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
        setPdf(event.target.files[0]);
    }
  }

  const newVideo = (event: any) => {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
        setVideo(URL.createObjectURL(event.target.files[0]));
    }
  }

  return (
    <main>
      <div className={styles.pointer} style={pointerStyles} />
      <p style={{color: "white"}}>Test</p>
      <p style={{color: "white"}}>{page}</p>
      <input type="file" accept=".pdf" onChange={newPDF} />
      <input type="file" accept=".mp4" onChange={newVideo} />
    {showVideo 
    ? <VideoElement video={video}/>
    : <PresentationElement pdf={pdf} page={page}/>
    }
    </main>
  );
}
