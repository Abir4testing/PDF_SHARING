import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { X, Copy, CheckCircle, GripHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  filename: string;
  isProtected?: boolean;
  password?: string;
}

export function QRDialog({ isOpen, onClose, pdfUrl, filename, isProtected, password }: QRDialogProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Motion values for drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Create the full URL for accessing the PDF
  const fullUrl = (() => {
    const baseUrl = new URL(window.location.origin);
    const urlParts = pdfUrl.split('/');
    const username = urlParts[urlParts.length - 2];
    const pdfFilename = urlParts[urlParts.length - 1];
    
    baseUrl.pathname = `/api/pdf/${username}/${pdfFilename}`;
    
    if (isProtected && password) {
      baseUrl.searchParams.set('password', password);
    }
    
    return baseUrl.toString();
  })();

  useEffect(() => {
    if (isOpen && fullUrl) {
      console.log('Generating QR code for URL:', fullUrl);
      QRCode.toDataURL(fullUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => {
          console.log('QR code generated successfully');
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error('Error generating QR code:', err);
          toast.error('Failed to generate QR code');
        });
    }
  }, [isOpen, fullUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Link copied!', {
        duration: 2000,
        position: 'top-center',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  const handleViewPDF = () => {
    console.log('Opening PDF URL:', fullUrl);
    window.open(fullUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.1}
            dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl cursor-move"
          >
            {/* Drag Handle */}
            <div className="flex items-center justify-center p-2 border-b border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing">
              <GripHorizontal className="w-6 h-6 text-gray-400" />
            </div>

            <div className="p-6">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Share PDF
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 text-center max-w-[250px] truncate">
                  {filename}
                </p>

                {isProtected && (
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                    This PDF is password protected
                  </div>
                )}

                {qrCodeUrl && (
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" draggable={false} />
                  </div>
                )}

                <div className="w-full space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <input
                      type="text"
                      value={fullUrl}
                      readOnly
                      className="flex-1 bg-transparent border-none text-sm text-gray-800 dark:text-gray-200 focus:outline-none"
                    />
                    <button
                      onClick={handleCopy}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleViewPDF}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    View PDF
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
