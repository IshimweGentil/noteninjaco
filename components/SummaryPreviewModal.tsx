import React, { useState, useEffect } from 'react';
import { XIcon, ArrowRight, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import MagicButton from './ui/MagicButton';

interface SummaryPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  error: string | null;
  onSave: (name: string) => void;
  onRegenerate: () => void;
  isLoading: boolean;
}

const SummaryPreviewModal: React.FC<SummaryPreviewModalProps> = ({
  isOpen,
  onClose,
  summary,
  error,
  onSave,
  onRegenerate,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    console.log("Summary in modal:", summary); // Debug log
  }, [summary]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim() && summary) {
      onSave(name);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
      }, 2000);
    }
  };

  const formatSummary = (text: string) => {
    // Replace [important] tags with styled spans
    let formattedText = text.replace(
      /\[important\](.*?)\[\/important\]/g, 
      '<span class="bg-yellow-500 text-black px-1 rounded font-semibold">$1</span>'
    );

    // Convert markdown-style headings to HTML headings with classes
    formattedText = formattedText.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2 text-blue-300">$1</h2>');
    formattedText = formattedText.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-3 text-blue-200">$1</h1>');

    // Convert line breaks to <br> tags
    formattedText = formattedText.replace(/\n/g, '<br>');

    return formattedText;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20 cursor-pointer" onClick={onClose} />
          
          <motion.div 
            className="bg-slate-950 border border-slate-800 bg-opacity-90 backdrop-blur-lg rounded-lg w-full max-w-[90%] sm:max-w-[80%] md:max-w-4xl max-h-[90vh] sm:max-h-[85vh] relative p-3 sm:p-6 overflow-y-auto z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-2 right-2 text-blue-100 hover:text-blue-300 transition-colors"
              onClick={onClose}
            >
              <XIcon size={20} />
            </button>
            <h2 className="text-2xl font-bold text-blue-100 mb-4 text-center">Summary Preview</h2>

            <div className="bg-slate-800 p-4 rounded-lg mb-4 max-h-[60vh] overflow-y-auto">
              {error ? (
                <div className="flex items-center text-red-500">
                  <AlertTriangle size={20} className="mr-2" />
                  <p>{error}</p>
                </div>
              ) : summary ? (
                <div 
                  className="text-blue-100 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatSummary(summary) }}
                />
              ) : (
                <div className="flex items-center text-yellow-500">
                  <AlertTriangle size={20} className="mr-2" />
                  <p>No summary available. Please try regenerating.</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter summary name"
                className="w-full px-3 py-2 bg-slate-800 text-blue-100 border border-slate-700 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <MagicButton
                title={isLoading ? "Regenerating..." : "Regenerate"}
                icon={isLoading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                position="right"
                onClick={onRegenerate}
                disabled={isLoading}
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !summary || !name.trim()}
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-700 text-blue-100 rounded hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>

            <AnimatePresence>
              {showSuccessMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.3 }}
                  className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <CheckCircle size={20} />
                  <span>Summary saved successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SummaryPreviewModal;