'use client';

import { useParams } from 'next/navigation';
import ProtectedPdfViewer from '@/components/ProtectedPdfViewer';

export default function PDFViewerPage() {
  const params = useParams();
  const pdfId = params.id as string;

  // In a real application, you would fetch the PDF URL and any initial password from your backend
  const pdfUrl = `/api/pdf/${pdfId}`; // This would be your API endpoint that serves the PDF

  return (
    <div className="container mx-auto py-8">
      <ProtectedPdfViewer pdfUrl={pdfUrl} />
    </div>
  );
}
