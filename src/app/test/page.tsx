"use client"

import { useRef, useEffect, useState } from "react";
import * as MPHands from "@mediapipe/tasks-vision";

function FileLoader() {
    const grec = useRef<MPHands.GestureRecognizer | null>(null);
    const [findings, setFindings] = useState<[string, number]>(["none", 0]);

    useEffect(() => {
        initializeMediaPipe().then(() => {
            processImages();
        });
    }, []); 

    
    async function initializeMediaPipe() {

        const vision = await MPHands.FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
      
          grec.current = await MPHands.GestureRecognizer.createFromOptions(vision, {
            numHands: 1,
            runningMode: "IMAGE",
            customGesturesClassifierOptions: {scoreThreshold: 0.8},
            baseOptions: {
              modelAssetPath: "./gesture_recognizer.task",
              delegate: "GPU",
            },
          });
    }

    // Processes the images
    async function processImages() {        
        const startTime = Date.now();
        await performRecognition();
        const EndTime = Date.now();
        const elapsedTime = EndTime - startTime;
        console.log("Elapsed time: " + elapsedTime + "ms");
    }

    async function performRecognition() {
        for (let i = 0; i < 3; i++) {
            try {
                const image = await loadImage('/' + i + '.jpg');
                if (grec.current) {
                    const startTime2 = Date.now();
                    let results = await recognizeGesture(image);
                    const EndTime2 = Date.now();
                    console.log("Results for image " + i + ".jpg");
                    console.log(results?.gestures[0][0].categoryName);
                    setFindings([results?.gestures[0][0].categoryName, results?.gestures[0][0].score]);
                } 
            
            } catch {
                console.error("Error processing image " + i + ".jpg");
            }
           
        }
    }

    async function recognizeGesture(image: MPHands.ImageSource) {
        let results = await grec.current!.recognize(image);
        return results;
    }

    async function loadImage(imageName: string) {
        return new Promise<MPHands.ImageSource>((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = imageName;
        });
    }

    return (
        <main>
            <h1>Files</h1>
        </main>
    );
}

export default FileLoader;
