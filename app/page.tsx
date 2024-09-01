'use client';

import './globals.css';
import React, { useState, useCallback } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import ChatButton from '../components/ChatButton';
import { Chat } from '../components/Chat';

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prevState => !prevState);
  }, []);

  const closeChat = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <>
      <main className="relative flex justify-center items-center flex-col mx-auto sm:px-10 px-5">
        <div className="max-w-7xl w-full">
          <Hero />
          <Features />
          <Pricing />
        </div>
      </main>
      <Footer />
      <ChatButton onClick={toggleVisibility} isVisible={isVisible} />
      {isVisible && <Chat isVisible={isVisible} setIsVisible={setIsVisible} closeChat={closeChat} />}
    </>
  );
};

export default Home;

