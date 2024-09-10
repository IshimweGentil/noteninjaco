import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface NotAvailablePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotAvailablePopup: React.FC<NotAvailablePopupProps> = ({ isOpen, onClose }) => {
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
            className="bg-slate-950 border border-slate-800 bg-opacity-90 backdrop-blur-lg rounded-lg w-full max-w-[90%] sm:max-w-[80%] md:max-w-md relative p-6 overflow-y-auto z-10"
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
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">Not Available Yet</h3>
            <p className="text-gray-300 mb-4">Exciting updates are on the way! Our premium features are coming soon,
                                                 and we can’t wait to share them with you. Stay tuned for more</p>
            <button 
              onClick={onClose}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotAvailablePopup;