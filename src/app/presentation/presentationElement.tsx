"use client";
import styles from "./presentationElement.module.css";
import { Document, Page } from "react-pdf";
import { pdfjs } from 'react-pdf';
import { useState, useEffect } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PresentationElement(props: any) {
  const [pages, setPages] = useState(1);

  useEffect( () => {
    setPages(parseInt(localStorage.getItem('pdfPages')??"1")??1);
  }, [pages]);

  return (
    <div className={props.styles}>   
      {props.pdf ? <Document file={props.pdf} onLoadSuccess={({numPages: pages}) => {if (props.pdfPages) {localStorage.setItem('pdfPages', pages.toString()); setPages(pages) }; }}>
      <Page pageNumber={props.page??1} renderTextLayer={false} renderAnnotationLayer={false} canvasBackground="transparent" width={4096}/>
      </Document> : <p>No PDF</p>}
      <p className={props.showPageNum ? styles.showPageNum : styles.hidden}>Page: {props.page??1} / {pages}</p>
    </div>
  );
}
