'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, Lock, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordDialog } from '@/components/ui/password-dialog';
import toast from 'react-hot-toast';

interface PDFFile {
  id: string;
  filename: string;
  username: string;
  isProtected: boolean;
  url: string;
  uploadedAt: string;
}

export default function SearchPage() {
  const [username, setUsername] = useState('');
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error('Please enter a username');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?username=${encodeURIComponent(username)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search PDFs');
      }

      setFiles(data.pdfs || []);
      
      if (data.pdfs?.length > 0) {
        toast.success(`Found ${data.pdfs.length} PDF file(s)`);
      } else {
        toast.error('No PDFs found for this username');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to search PDFs');
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileClick = async (file: PDFFile) => {
    if (file.isProtected) {
      setSelectedFile(file);
      setShowPasswordDialog(true);
    } else {
      window.open(file.url, '_blank');
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    if (!selectedFile) return;

    try {
      const url = new URL(selectedFile.url, window.location.origin);
      url.searchParams.set('password', password);
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid password');
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl, '_blank');
      window.URL.revokeObjectURL(fileUrl);

      setShowPasswordDialog(false);
      setSelectedFile(null);
      toast.success('PDF opened successfully');
    } catch (error) {
      console.error('Password error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to open PDF');
    }
  };

  return (
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
            <Search className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Search PDFs</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Enter a username to find shared PDF documents
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm dark:bg-gray-700"
                placeholder="Enter username"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                'Search PDFs'
              )}
            </Button>
          </form>

          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Found PDFs:
              </h3>
              <div className="space-y-4">
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={() => handleFileClick(file)}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {file.filename}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Shared by: {file.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                        {file.isProtected ? 'Protected' : 'Public'}
                      </p>
                      {file.isProtected ? (
                        <Lock className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Download className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <PasswordDialog
        isOpen={showPasswordDialog}
        onClose={() => {
          setShowPasswordDialog(false);
          setSelectedFile(null);
        }}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
}
