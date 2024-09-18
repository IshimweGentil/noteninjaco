'use client';

import React from 'react';
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

  return (
    <nav
      className={cn(
        "sticky inset-x-0 top-0 z-30 w-full transition-all text-white",
        {
          "border-b border-blue-800 border-slate-900/75 backdrop-blur-lg": scrolled,
          "border-b border-slate-700": isDashboardRoute,
        }
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">NoteNinja.co</Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn && (
              <Link href="/dashboard/generate" className="hover:text-gray-300 transition duration-300">Dashboard</Link>
            )}
            {!isSignedIn ? (
              <SignInButton mode="modal" >
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300">
                  Sign In
                </button>
              </SignInButton>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
