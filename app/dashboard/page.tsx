'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    redirect('/');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Welcome, {user.firstName}!</h1>
      <div className="bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-purple-900 p-4 rounded-md">
            <p className="text-lg font-medium">Total Flashcards</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-purple-800 p-4 rounded-md">
            <p className="text-lg font-medium">Sets Created</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-purple-700 p-4 rounded-md">
            <p className="text-lg font-medium">Study Streak</p>
            <p className="text-2xl font-bold">0 days</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-400">No recent activity to show.</p>
      </div>
    </div>
  );
};

export default Dashboard;