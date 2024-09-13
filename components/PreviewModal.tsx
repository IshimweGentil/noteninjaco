import React, { useState, useEffect } from 'react';
import { XIcon, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import MagicButton from './ui/MagicButton';


interface PreviewItem {
  front: string;
  back: string;
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PreviewItem[];
  onSave: (name: string) => void;
  onRegenerate: () => void;
  isLoading: boolean;
  title?: string;
  projectNames?: string[];
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  items,
  onSave,
  onRegenerate,
  isLoading,
  title = 'Preview',
  projectNames= []
}) => {
  const [name, setName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
      }, 2000);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsFlipped(false);
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
            className="bg-slate-950 border border-slate-800 bg-opacity-90 backdrop-blur-lg rounded-lg w-full max-w-[90%] sm:max-w-[80%] md:max-w-2xl max-h-[85vh] sm:max-h-[80vh] relative p-3 sm:p-6 overflow-y-auto z-10"
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
            <h2 className="text-2xl font-bold text-blue-100 mb-4 text-center">{title}</h2>

            <motion.div
              className="mb-4"
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="bg-slate-800 p-4 rounded-lg h-48 flex items-center justify-center cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div 
                  className="w-full h-full flex items-center justify-center"
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.p 
                    className="text-xl font-semibold text-center text-blue-100 absolute backface-hidden"
                    initial={false}
                    animate={{ opacity: isFlipped ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {items[currentIndex].front}
                  </motion.p>
                  <motion.p 
                    className="text-xl font-semibold text-center text-blue-100 absolute backface-hidden"
                    initial={false}
                    animate={{ opacity: isFlipped ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    {items[currentIndex].back}
                  </motion.p>
                </motion.div>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 bg-slate-800 text-blue-100 rounded hover:bg-slate-700 transition-colors"
                >
                  Previous
                </button>
                <span className="text-blue-100 self-center">
                  {currentIndex + 1} / {items.length}
                </span>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-slate-800 text-blue-100 rounded hover:bg-slate-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </motion.div>

            <div className="mb-4">
              <input
                list="projects"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter set name"
                className="w-full px-3 py-2 bg-slate-800 text-blue-100 border border-slate-700 rounded focus:outline-none focus:border-blue-500"
              />
              <datalist id="projects">
                {projectNames.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
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
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                disabled={isLoading}
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
                  <span>Flashcard set saved successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreviewModal;