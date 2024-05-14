"use client";
import styles from "./setupView.module.css";
import VideoElement from "./videoElement"
import PresentationElement from "./presentationElement";
import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const HiddenInput = styled('input')({
  height: 0,
  width: 0,
  overflow: 'hidden',
})

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
    <Box margin={2}>
      <Grid container spacing={2} columns={2}>
        <Grid xs={2}>
        <header className={styles.title}>Setup Presentation</header>
        </Grid>
        <Grid xs={1} sx={{height: '100%'}}>
          <Card style={{border: '1px solid black', borderRadius: '12px'}}>
            <PresentationElement pdf={props.pdf} styles={styles.presentationElement}/>
            <CardActions style={{justifyContent: 'center'}}>
              <Button
                component="label"
                variant="contained"
              >
                Input PDF
                <HiddenInput type="file" accept=".pdf" onChange={newPDF} />
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid xs={1} sx={{height: '100%'}}>
        <Card style={{border: '1px solid black', borderRadius: '12px'}}>
          <VideoElement video={props.video} styles={styles.videoElement} controls={true}/>
            <CardActions style={{justifyContent: 'center'}}>
              <Button
                component="label"
                variant="contained" 
              >
                Input Video
                <HiddenInput type="file" accept=".mp4" onChange={newVideo} />
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
