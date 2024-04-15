"use client";
import { Document, Page } from "react-pdf";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PresentationElement(props: any) {
  return (
    <div>   
      {props.pdf ? <Document file={props.pdf}>
      <Page pageNumber={props.page} renderTextLayer={false} renderAnnotationLayer={false} />
      </Document> : <p style={{color: "white"}}>No PDF</p>}
    </div>
  );
}
