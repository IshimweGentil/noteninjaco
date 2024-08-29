'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';
import FileUploadArea from '@/components/FileUploadArea';


const Dashboard = () => {
  const { isLoaded,isSignedIn,user } = useUser();

  if (!isLoaded || !isSignedIn) {
    redirect('/')
  }
  

  return (
    <div className="flex flex-1">
      <DashboardSidebar />
      <div className="flex-1 p-6 ">
        <h1 className="text-p mb-4">Welcome, {user?.firstName || 'User'}</h1>
        <FileUploadArea />
      </div>
    </div>
  );
};

export default Dashboard;