import React, { useState, useRef, useEffect } from 'react';
import CompactPricing from './CompactPricing';
import MagicButton from "./MagicButton";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const GetStarted: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <MagicButton
        title="Get Started"
        icon={<FaLocationArrow />}
        position="right"
        onClick={() => setIsOpen(true)}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overlay with pointer cursor */}
            <div className="absolute inset-0 bg-black bg-opacity-20 cursor-pointer" onClick={() => setIsOpen(false)} />
            
            <motion.div 
              ref={modalRef}
              className="bg-slate-950 border border-slate-800 bg-opacity-90 backdrop-blur-lg rounded-lg w-full max-w-[90%] sm:max-w-[80%] md:max-w-2xl max-h-[85vh] sm:max-h-[80vh] relative p-3 sm:p-6 overflow-y-auto z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Prevent clicks on the modal from closing it
            >
              <button 
                className="absolute top-2 right-2 text-blue-100 hover:text-blue-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes size={20} />
              </button>
              <p className="uppercase text-sm sm:text-base text-blue-100 mb-2 sm:mb-4 text-center">
                Let's get you in
              </p>
              <CompactPricing />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GetStarted;