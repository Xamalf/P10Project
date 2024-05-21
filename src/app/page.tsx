"use client";

import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import StateView from "./stateView";
import GestureRecognizer from "./gestureRecognizer";
import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

type pointerStyle = {
  display: string,
  left: string,
  top: string,
}

export default function Home() {
  const newGestureRef = useRef<any>(null);
  const [num, setNum] = useState<number>(1);
  const [playVideo, setPlayVideo] = useState<boolean>(false);
  const pointerStyles = useRef<pointerStyle>({display: 'none', left: '0%', top: '0%'});
  const showPointer = useRef<boolean>(false);
  const getPointerVals = useRef<boolean>(false);

  async function prevSlide() {
    var newNum: number = num - 1;
    if (newNum > 0) {
      setNum(newNum);
      localStorage.setItem('slide', newNum.toString());
    }
  }

  async function nextSlide() {
    var newNum: number = num + 1;
    setNum(newNum);
    localStorage.setItem('slide', newNum.toString());
  }

  async function toggleVid(newShowVid: boolean) {
    localStorage.setItem('showVideo', newShowVid.toString());
    console.log(newShowVid.toString())
  }

  async function viewPointer() {
    if (showPointer.current) {
      localStorage.setItem('pointer', JSON.stringify(pointerStyles.current));
    } else {
      localStorage.setItem('pointer', JSON.stringify({display: 'none', left: '0%', top: '0%'}));
    }
  }

  async function enablePointer(enable: boolean) {
    showPointer.current = enable;
    viewPointer();
    
    if (enable) {
      getPointerVals.current = true;
    }
  }

  async function toggleMode(newPresentationMode: boolean) {
    localStorage.setItem('presentationMode', newPresentationMode.toString());
    console.log(newPresentationMode.toString())
  }

  async function playPause() {
    var newPlayVideo = !playVideo;
    setPlayVideo(newPlayVideo);
    localStorage.setItem('playPause', newPlayVideo.toString());
  }

  useEffect( () => {
    localStorage.setItem('slide', '1');
  }, []);

  return (
    <main className={styles.main}>
      <Box margin={2}>
        <Grid container spacing={2} columns={4}>
          <Grid xs={4}>
            <header className={styles.title}>Hand Recognition<IconButton style={{position: 'fixed', right: '30px', top: '32px'}} href="/presentation" target="_blank"><OpenInNewIcon style={{height: '100%', color: 'black'}} fontSize="large"/></IconButton></header>
          </Grid>
          <Grid xs={1}>
            <StateView ref={newGestureRef} nextSlide={nextSlide} prevSlide={prevSlide} enablePointer={enablePointer} toggleVid={toggleVid} toggleMode={toggleMode} playPause={playPause} />
          </Grid>
          <GestureRecognizer showPointer={showPointer} pointerStyles={pointerStyles} viewPointer={viewPointer} getPointerVals={getPointerVals} newGestureRef={newGestureRef} />
        </Grid>
      </Box>
    </main>
  );
}
