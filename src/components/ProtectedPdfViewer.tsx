'use client';

import React, { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Lock, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedPdfViewerProps {
  pdfUrl: string;
  password?: string;
}

const ProtectedPdfViewer: React.FC<ProtectedPdfViewerProps> = ({ pdfUrl, password: initialPassword }) => {
  const [password, setPassword] = useState(initialPassword || '');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dragControls = useDragControls();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    try {
      const url = new URL(pdfUrl, window.location.origin);
      url.searchParams.set('password', password);
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid password');
      }

      setIsPasswordCorrect(true);
      setError(null);
    } catch (error) {
      console.error('Password error:', error);
      setError(error instanceof Error ? error.message : 'Failed to verify password');
      setIsPasswordCorrect(false);
    }
  };

  if (!isPasswordCorrect) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        drag
        dragControls={dragControls}
        dragMomentum={false}
        dragElastic={0.1}
        whileDrag={{ scale: 1.02 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
      >
        <div className="p-6">
          <div 
            className="absolute left-0 top-0 w-full h-10 flex items-center justify-center px-4 cursor-move bg-gray-50 dark:bg-gray-700 rounded-t-2xl"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <GripHorizontal className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex flex-col items-center space-y-4 mt-8">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              Protected PDF
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              This PDF is password protected. Please enter the password to view.
            </p>

            <form onSubmit={handlePasswordSubmit} className="w-full space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
              >
                View PDF
              </Button>
            </form>

            {error && (
              <p className="text-sm text-red-500 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // When password is correct, open the PDF in a new tab
  const url = new URL(pdfUrl, window.location.origin);
  url.searchParams.set('password', password);
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <iframe
        src={url.toString()}
        className="w-full h-[calc(100vh-200px)] rounded-lg border border-gray-200 dark:border-gray-700"
        title="PDF Viewer"
      />
    </div>
  );
};

export default ProtectedPdfViewer;
