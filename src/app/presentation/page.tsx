"use client";
import { useEffect, useState } from "react";
import PresentationView from "./presentationView";
import SetupView from "./setupView";

type pointerStyle = {
  display: string,
  left: string,
  top: string,
}

export default function Presentation() {
  const [presentationMode, setPresentationMode] = useState(false);
  const [pdf, setPdf] = useState(null);
  const [video, setVideo] = useState("");
  const [showVideo, setShowVideo] = useState(true);
  const [page, setPage] = useState(1);
  const [pointerStyles, setPointerStyles] = useState<pointerStyle>({display: 'none', left: '0%', top: '0%'});

  async function sendEvent(name: string, data?: any) {
    document.dispatchEvent(new CustomEvent(name, {detail: data}));
  }

  useEffect( () => {
    setPointerStyles(JSON.parse(localStorage.getItem("pointer") ?? "{}"));
    setPage(parseInt(localStorage.getItem("slide") ?? "1") ?? 1);
    setShowVideo(localStorage.getItem("showVideo") === "true");
    setPresentationMode(localStorage.getItem("presentationMode") === "true");

    window.onstorage = (ev) => {
      console.log(ev);

      switch (ev.key) {
        case "pointer": setPointerStyles(JSON.parse(ev.newValue ?? "{}")); break;
        case "slide": setPage(parseInt(ev.newValue ?? "1") ?? 1); break;
        case "showVideo": setShowVideo(ev.newValue === "true"); break;
        case "presentationMode": setPresentationMode(ev.newValue === "true"); break;
        case "test1": sendEvent("play"); break;
        case "test2": sendEvent("pause"); break;
        case "test3": sendEvent("time", parseInt(ev.newValue ?? "1") ?? 1); break;
      }
    }
  }, []);

  return (
    <main>
      {presentationMode 
      ? <PresentationView pdf={pdf} video={video} showVideo={showVideo} page={page} pointerStyles={pointerStyles} />
      : <SetupView pdf={pdf} setPdf={setPdf} video={video} setVideo={setVideo} />
      }
    </main>
  );
}
