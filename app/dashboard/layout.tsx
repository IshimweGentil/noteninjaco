'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar'; // Update the path as needed
import PageWrapper from '@/components/PageWrapper';
import MarginWidthWrapper from '@/components/MarginWidthWrapper';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex" style={{backgroundColor:'rgba(17, 24, 39, 0.7)'}}>
      <Sidebar />
      <main className="flex-1 p-4">
        <MarginWidthWrapper>
        <PageWrapper>
        {children}
        </PageWrapper>
        </MarginWidthWrapper>

      </main>
    </div>
  );
};

export default DashboardLayout;
