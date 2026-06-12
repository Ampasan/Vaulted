const Tabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'login', label: 'LOGIN' },
    { id: 'register', label: 'REGISTER' },
  ];

  return (
    <div className="w-full">
      <div className="flex gap-10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`pb-3 text-[10px] tracking-[0.2em] uppercase font-bold transition-colors ${
                isActive
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="w-full border-b border-gray-300" />
    </div>
  );
};

export default Tabs;
