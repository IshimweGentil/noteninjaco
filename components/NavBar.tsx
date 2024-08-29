'use client';

import React from 'react'
import Link from 'next/link'
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

const NavBar: React.FC = () => {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="flex flex-wrap justify-between items-center py-4 px-6 ">
      <Link href="/" className="text-2xl font-bold text-white">NoteNinja.co</Link>
      <div className="space-x-4">
        <Link href="/" className="text-gray-300 hover:text-white transition duration-300">Home</Link>
        {isSignedIn && (
          <>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition duration-300">Dashboard</Link>
          </>
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
    </nav>
  )
}

export default NavBar