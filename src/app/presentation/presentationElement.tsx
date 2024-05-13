"use client";
import { Document, Page } from "react-pdf";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PresentationElement(props: any) {
  return (
    <div className={props.styles}>   
      {props.pdf ? <Document file={props.pdf}>
      <Page pageNumber={props.page??1} renderTextLayer={false} renderAnnotationLayer={false} canvasBackground="transparent" width={4096}/>
      </Document> : <p>No PDF</p>}
    </div>
  );
}
