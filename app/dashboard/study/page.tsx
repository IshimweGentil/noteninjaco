'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import DashboardSidebar from '@/components/DashboardSidebar';

const Study = () => {
  const { user } = useUser();

  return (
    <div className="flex h-full">
      <DashboardSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-p  mb-4">Study Mode</h1>
        <p className="mb-4">Welcome to the study page, {user?.firstName || 'User'}!</p>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Your Flashcard Sets</h2>
          <ul className="list-disc list-inside">
            <li>Set 1: Biology Basics</li>
            <li>Set 2: World History</li>
            <li>Set 3: Mathematics Formulas</li>
          </ul>
        </div>
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Study Statistics</h2>
          <p>Total cards studied: 150</p>
          <p>Current streak: 5 days</p>
          <p>Accuracy: 85%</p>
        </div>
      </div>
    </div>
  );
};

export default Study;