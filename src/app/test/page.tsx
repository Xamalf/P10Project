"use client"

import { useRef, useEffect, useState } from "react";
import * as MPHands from "@mediapipe/tasks-vision";

function FileLoader() {
    const grec = useRef<MPHands.GestureRecognizer | null>(null);
    const findings = useRef<string>("label;predicted;score;time\n");
    const [done, setDone] = useState<boolean>(false);

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
        for (let folder of ["peace", "pointer"]) {
            await performRecognition(folder);
        }
        const EndTime = Date.now();
        const elapsedTime = EndTime - startTime;
        setDone(true);
        console.log("Elapsed time: " + elapsedTime + "ms");
    }

    async function performRecognition(folderName: string) {
        for (let i = 1; i <= 3; i++) {
            try {
                const image = await loadImage("/testData/"+ folderName + "/" + i + '.jpg');
                if (grec.current) {
                    const startTime2 = Date.now();
                    let results = await recognizeGesture(image);
                    const EndTime2 = Date.now();
                    const elapsedTime = EndTime2 - startTime2;
                    findings.current += [folderName, 
                        results?.gestures[0] ? results?.gestures[0][0]?.categoryName : "-", 
                        results?.gestures[0] ? results?.gestures[0][0]?.score : "-", 
                        elapsedTime].join(";") + "\n";
                } 
            
            } catch {
                findings.current += folderName + ";error\n";
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
            {done ? <a href={URL.createObjectURL(new Blob([findings.current], {type: 'text/csv'}))} download='TestData.csv'>Download Data</a> : <p>Running Tests</p>}
        </main>
    );
}

export default FileLoader;
