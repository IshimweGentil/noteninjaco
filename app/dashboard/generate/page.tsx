'use client'

import React from 'react';
import { useUser } from '@clerk/nextjs';
import FileUploadArea from '@/components/FileUploadArea';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const GeneratePage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="pb-2">Welcome, {user.firstName || 'User'}!</h1>
      <FileUploadArea />
    </div>
  );
}

export default GeneratePage;