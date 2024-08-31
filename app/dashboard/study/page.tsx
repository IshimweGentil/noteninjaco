'use client'

import React from 'react';
import { useUser } from '@clerk/nextjs';
import StudyContent from '@/components/StudyContent';

const StudyPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <span className="">Welcome, {user.firstName || 'Student'}!</span>
      <span className="font-bold text-2xl">Let's Study</span>
      <div className="border-dashed border-zinc-500 w-full h-12"></div>
      <div className="border-dashed border-zinc-500 w-full h-64"></div>

      <StudyContent />
    </>
  );
};

export default StudyPage;