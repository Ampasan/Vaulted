import React from 'react';

import StatusDot from '../../ui/StatusDot';
import PriceTag from '../../ui/PriceTag';

const TransactionRow = ({ transaction }) => {

  return (
    <div className="flex items-center justify-between py-5 border-b border-[#dcd9ce] hover:bg-cream-light transition-colors group px-2 -mx-2">
      <div className="w-[12%] text-[10px] font-mono text-gray-500 tracking-wider">
        {transaction.date}
      </div>
      
      <div className="w-[30%] flex items-center gap-4">
        <div className="w-10 h-10 bg-[#e0dfd9] flex-shrink-0">
          <img src={transaction.image} alt="" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
        </div>
        <div>
          <h4 className="text-[11px] font-bold text-black mb-0.5">{transaction.assetName}</h4>
          <p className="text-[9px] font-mono text-gray-400 tracking-[0.15em]">{transaction.assetId}</p>
        </div>
      </div>
      
      <div className="w-[18%] text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">
        {transaction.type}
      </div>
      
      <div className="w-[15%] text-[10px] font-mono text-gray-400 tracking-widest uppercase">
        {transaction.hash}
      </div>
      
      <div className="w-[15%] flex justify-end">
        <PriceTag 
          label={null} 
          currency={transaction.settlement.split(' ')[0]} 
          amount={transaction.settlement.split(' ')[1]} 
          size="sm" 
          align="right" 
        />
      </div>
      
      <div className="w-[10%] flex justify-end items-center gap-3">
        <StatusDot status={transaction.status.toLowerCase().replace(' ', '-')} size="xs" />
        <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
    </div>
  );
};

export default TransactionRow;
