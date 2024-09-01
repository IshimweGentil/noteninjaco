'use client'

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "../components/Footer";
import { IconMessages } from '@tabler/icons-react'
import { useState } from 'react'
import { Chat } from '../components/Chat'
import './globals.css'
import NavBar from '../components/NavBar'
import NavBarMobile from '../components/NavBarMobile'

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
          <div className="flex">
            <main className="flex-1">
              <NavBar />
              <NavBarMobile />
              {children}
              <Footer />
            </main>
            <IconMessages onClick={toggleVisibility} className="active:bg-purple-600 .cursor-pointer p-3 border border-white rounded-full fixed mb-10 mr-[1.5rem] right-0 bottom-0 w-[3.5rem] h-[3.5rem] bg-gray-900 text-white hover:bg-purple-600" />
            {isVisible && <Chat />}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
