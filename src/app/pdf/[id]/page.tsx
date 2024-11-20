'use client';

import { useParams } from 'next/navigation';
import ProtectedPdfViewer from '@/components/ProtectedPdfViewer';

export default function PDFViewerPage() {
  const params = useParams();
  
  if (!params?.id) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="mt-4 text-gray-600">PDF ID not found</p>
      </div>
    );
  }

  const pdfId = params.id as string;
  const pdfUrl = `/api/pdf/${pdfId}`; // This would be your API endpoint that serves the PDF

  return (
    <div className="container mx-auto py-8">
      <ProtectedPdfViewer pdfUrl={pdfUrl} />
    </div>
  );
}
