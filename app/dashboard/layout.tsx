import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-800">
      {/* This div adds the thin line under the NavBar */}
      <div className="h-[1px] bg-gray-700 w-full"></div>
      {children}
    </div>
  );
}