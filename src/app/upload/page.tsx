'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QRDialog } from '@/components/ui/qr-dialog';
import toast, { Toaster } from 'react-hot-toast';

interface UploadedFileInfo {
  url: string;
  filename: string;
  isProtected: boolean;
  password?: string;
}

export default function UploadPage() {
  const [username, setUsername] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<UploadedFileInfo | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [password, setPassword] = useState('');

  const SuccessToast = () => (
    <AnimatePresence>
      {showSuccessToast && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed left-1/2 top-[40vh] -translate-x-1/2 bg-gray-800/90 text-white px-6 py-4 rounded-xl shadow-2xl text-center z-50 backdrop-blur-sm"
          style={{
            width: 'min(90vw, 300px)',
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-full bg-green-500/20 p-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-lg font-medium">PDF Uploaded!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !username) {
      toast.error('Please select a file and enter a username');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    if (password) {
      formData.append('password', password);
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to upload file');
      }

      console.log('Upload response:', data);
      setUploadedFileInfo({
        url: data.fileUrl,
        filename: data.filename,
        isProtected: data.isProtected,
        password: password || undefined,
      });
      setShowQRCode(true);
      setUsername('');
      setFile(null);
      setPassword('');
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setMessage('');
      } else {
        setMessage('Please upload only PDF files');
        toast.error('Please upload only PDF files', {
          position: 'top-center',
          style: {
            background: '#991B1B',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '16px',
            padding: '12px 24px',
          },
        });
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upload PDF</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Share your PDF documents securely with a unique username</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="Enter a unique username"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password (Optional)
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="Add password protection (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PDF File
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">PDF files only</p>
                  </div>
                  {file && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                      Selected file: {file.name}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Uploading...' : 'Upload PDF'}
              </Button>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-md ${
                    message.includes('success')
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}
                >
                  <div className="flex items-center">
                    {message.includes('success') ? (
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-2" />
                    )}
                    {message}
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Success Toast */}
      <SuccessToast />

      {/* QR Code Dialog */}
      {uploadedFileInfo && (
        <QRDialog
          isOpen={showQRCode}
          onClose={() => setShowQRCode(false)}
          pdfUrl={uploadedFileInfo.url}
          filename={uploadedFileInfo.filename}
          isProtected={uploadedFileInfo.isProtected}
          password={uploadedFileInfo.password}
        />
      )}

      {/* Error Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            maxWidth: '90vw',
            margin: '0 auto',
          },
        }}
      />
    </>
  );
}
