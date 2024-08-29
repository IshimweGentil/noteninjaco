import React from 'react';
import Link from 'next/link';

const DashboardSidebar = () => {
  return (
    <aside className="w-48 bg-gray-900 ">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded text-white">
              Generate
            </Link>
          </li>
          <li>
            <Link href="/dashboard/study" className="block py-2 px-4 hover:bg-gray-700 rounded text-white">
              Study
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;