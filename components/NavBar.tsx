'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import { useSelectedLayoutSegment } from 'next/navigation';

const NavBar: React.FC = () => {
  const { isSignedIn } = useUser();
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const isDashboardRoute = selectedLayout?.startsWith('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Added state for menu visibility

  return (
    <nav
      className={cn(
        "sticky inset-x-0 top-0 z-30 w-full transition-all text-white",
        {
          "border-b border-gray-800 bg-gray-900/75 backdrop-blur-lg": scrolled,
          "border-b border-gray-800": isDashboardRoute,
        }
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">NoteNinja.co</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isSignedIn && (
                <Link href="/dashboard" className="hover:text-gray-300 transition duration-300">Dashboard</Link>
              )}
              {!isSignedIn && (
                <>
                  <SignInButton mode="modal">
                    <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-transparent border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-600 hover:text-white transition duration-300">
                      Sign Up
                    </button>
                  </SignUpButton>
                </>
              )}
              {isSignedIn && (
                <UserButton afterSignOutUrl="/" />
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen} // Updated to reflect the state
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block hover:text-gray-300 transition duration-300">Home</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
