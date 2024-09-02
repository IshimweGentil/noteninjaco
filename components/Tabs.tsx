import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex items-center justify-start h-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`py-2 px-4 focus:outline-none transition-colors duration-200 text-left ${
            activeTab === tab.id
              ? 'text-blue-100 border-b-2 border-blue-100'
              : 'text-gray-600 hover:text-blue-100'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;