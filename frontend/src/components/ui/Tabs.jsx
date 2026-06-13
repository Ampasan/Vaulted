import { useState } from 'react';

const Tabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  const [internalActive, setInternalActive] = useState(tabs?.[0]?.id || '');
  const currentActive = activeTab !== undefined ? activeTab : internalActive;
  const handleChange = onTabChange || setInternalActive;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-10 border-b border-[#dcd9ce] pb-0">
        {tabs.map((tab) => {
          const isActive = currentActive === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleChange(tab.id)}
              className={`pb-3.5 text-[12px] tracking-[0.15em] uppercase font-bold transition-colors ${
                isActive
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
