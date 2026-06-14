import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Jan 23', value: 5.50 },
  { name: 'Feb 23', value: 5.62 },
  { name: 'Mar 23', value: 5.60 },
  { name: 'Apr 23', value: 5.68 },
  { name: 'May 23', value: 5.82 },
  { name: 'Jun 23', value: 5.80 },
  { name: 'Jul 23', value: 5.85 },
  { name: 'Aug 23', value: 5.92 },
  { name: 'Sep 23', value: 6.10 },
  { name: 'Oct 23', value: 6.55 },
  { name: 'Nov 23', value: 7.10 },
  { name: 'Dec 23', value: 7.65 },
  { name: 'Jan 24', value: 7.92 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-3 py-2 text-[10px] font-mono tracking-wider shadow-lg">
        <p className="opacity-70 mb-1">{payload[0].payload.name}</p>
        <p className="font-bold">CHF {payload[0].value.toFixed(2)}M</p>
      </div>
    );
  }
  return null;
};

const PortfolioChart = () => {
  return (
    <div className="border border-[#dcd9ce] p-6 bg-transparent h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">PORTFOLIO PERFORMANCE</p>
          <div className="flex items-center gap-1 text-green-600">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            <p className="text-[12px] font-mono font-bold">+CHF 2.15M YTD</p>
          </div>
        </div>
        <div className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold border border-[#dcd9ce] px-2 py-1">
          2023
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={['dataMin - 1', 'dataMax + 0.5']} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#dcd9ce', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#1a1a1a" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              activeDot={{ r: 4, fill: '#1a1a1a', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between text-[8px] text-gray-400 uppercase tracking-widest font-bold mt-4 pt-4 border-t border-[#dcd9ce]">
        <span>Jan 23</span>
        <span>Mar 23</span>
        <span>May 23</span>
        <span>Jul 23</span>
        <span>Sep 23</span>
        <span>Nov 23</span>
        <span>Jan 24</span>
      </div>
    </div>
  );
};

export default PortfolioChart;
