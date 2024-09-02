'use client'

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Tabs from '@/components/Tabs';
import FileTab from '@/components/FileTab';
import TextTab from '@/components/TextTab';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const GeneratePage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState('file');

  if (!isLoaded || !isSignedIn) {
    return <LoadingSpinner />;
  }

  const tabs = [
    { id: 'file', label: 'Files' },
    { id: 'text', label: 'Text' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b border-slate-700">
        <div className="container mx-auto px-4">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
      <div className="flex-grow container mx-auto px-4 py-6">
        <h1 className=" mb-2">Welcome, {user.firstName || 'User'}!</h1>
        <div className="mt-2">
          {activeTab === 'file' ? <FileTab /> : <TextTab />}
        </div>
      </div>
    </div>
  );
}

export default GeneratePage;