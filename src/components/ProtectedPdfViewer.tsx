'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ProtectedPdfViewerProps {
  pdfUrl: string;
  password?: string;
}

const ProtectedPdfViewer: React.FC<ProtectedPdfViewerProps> = ({ pdfUrl, password: initialPassword }) => {
  const [password, setPassword] = useState(initialPassword || '');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsPasswordCorrect(true);
    setError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    if (err.message.includes('password')) {
      setIsPasswordCorrect(false);
      setError('Incorrect password. Please try again.');
    } else {
      setError('Error loading PDF. Please try again.');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordCorrect(false);
    // This will trigger a re-render and attempt to load the PDF with the new password
  };

  const nextPage = () => {
    if (pageNumber < (numPages || 1)) {
      setPageNumber(pageNumber + 1);
    }
  };

  const previousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  if (!isPasswordCorrect) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Protected PDF</h2>
        <p className="mb-4">This PDF is password protected. Please enter the password to view.</p>
        <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm">
          <div className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={previousPage}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="flex items-center">
          Page {pageNumber} of {numPages}
        </span>
        <button
          onClick={nextPage}
          disabled={pageNumber >= (numPages || 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Next
        </button>
        <button
          onClick={zoomOut}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Zoom Out
        </button>
        <button
          onClick={zoomIn}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Zoom In
        </button>
      </div>
      <div className="border rounded-lg p-4 bg-gray-100">
        <Document
          file={{
            url: pdfUrl,
            password,
          }}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
};

export default ProtectedPdfViewer;
