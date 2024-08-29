'use client'

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { IconMessages } from '@tabler/icons-react'
import { useState } from 'react'
import { Chat } from '../components/Chat'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(prevState => !prevState);
  };

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-900 text-white min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <IconMessages onClick={toggleVisibility} className=".cursor-pointer p-3 border border-white rounded-full fixed mb-10 mr-[1.5rem] right-0 bottom-0 w-[3.5rem] h-[3.5rem] text-white hover:bg-purple-600" />
          {isVisible && <Chat />}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
