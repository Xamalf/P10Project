"use client";
import { useEffect, useState, useRef } from "react";
import PresentationView from "./presentationView";
import SetupView from "./setupView";

type pointerStyle = {
  display: string,
  left: string,
  top: string,
}

type captureSlideType = {
  temp: string, 
  percent: string
}

export default function Presentation() {
  const [presentationMode, setPresentationMode] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [video, setVideo] = useState("");
  const [showVideo, setShowVideo] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [pointerStyles, setPointerStyles] = useState<pointerStyle>({display: 'none', left: '0%', top: '0%'});
  const [captureSlide, setCaptureSlide] = useState<captureSlideType>({temp: 'false', percent: '0'});
  const pdfPages = useRef<number>(0);

  async function sendEvent(name: string, data?: any) {
    document.dispatchEvent(new CustomEvent(name, {detail: data}));
  }

  async function newCaptureSlide(value: string|null) {
    var captureSlideLocal = JSON.parse(value ?? "{}")
    setCaptureSlide(captureSlideLocal);
    
    if (captureSlideLocal.temp == 'true') {
      var percent = parseFloat(captureSlideLocal.percent ?? "0") ?? 0;

      if (showVideo) {
        sendEvent("captureSlide", percent)
      }
    }
  }

  useEffect( () => {
    setPointerStyles(JSON.parse(localStorage.getItem("pointer") ?? "{}"));
    setPage(parseInt(localStorage.getItem("slide") ?? "1") ?? 1);
    setShowVideo(localStorage.getItem("showVideo") === "true");
    setPresentationMode(localStorage.getItem("presentationMode") === "true");

    window.onstorage = (ev) => {
      switch (ev.key) {
        case "pointer": setPointerStyles(JSON.parse(ev.newValue ?? "{}")); break;
        case "slide": setPage(parseInt(ev.newValue ?? "1") ?? 1); break;
        case "showVideo": setShowVideo(ev.newValue === "true"); break;
        case "presentationMode": setPresentationMode(ev.newValue === "true"); break;
        case "playPause": ev.newValue === "true" ? sendEvent("play") : sendEvent("pause"); break;
        case "skip": sendEvent("skip", parseInt(ev.newValue ?? "0") ?? 0); break;
        case "captureSlide": newCaptureSlide(ev.newValue); break;
      }
    }
  }, [showVideo]);

  return (
    <main>
      {presentationMode 
      ? <PresentationView pdf={pdf} video={video} showVideo={showVideo} page={page} pointerStyles={pointerStyles} showControls={captureSlide.temp == 'true'} />
      : <SetupView pdf={pdf} setPdf={setPdf} pdfPages={pdfPages} video={video} setVideo={setVideo} />
      }
    </main>
  );
}
