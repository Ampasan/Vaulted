import React from 'react';
import StatusDot from '../../ui/StatusDot';
import PriceTag from '../../ui/PriceTag';

const HeldAssetRow = ({ asset }) => {
  return (
    <div className="flex items-center justify-between bg-cream-light border border-[#dcd9ce] p-4 mb-3 hover:bg-white transition-colors cursor-pointer group">
      <div className="flex items-center gap-6 w-1/3">
        <div className="w-16 h-16 shrink-0 relative">
          <img src={asset.image} alt={asset.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
          {asset.status && <StatusDot status={asset.status} size="xs" className="absolute top-1.5 left-1.5" />}
        </div>
        <div>
          <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-1">{asset.category || asset.lot}</p>
          <h4 className="text-[13px] font-black text-black leading-snug">{asset.title}</h4>
          <p className="text-[11px] text-gray-500 mt-1">{asset.subtitle || asset.ref}</p>
        </div>
      </div>
      
      <div className="w-1/4">
        {asset.location && (
          <div className="flex items-center gap-1.5 text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <p className="text-[10px] font-mono tracking-widest">{asset.location}</p>
          </div>
        )}
      </div>

      <div className="w-1/6 flex justify-end">
        <PriceTag 
          label="CURRENT VALUE" 
          currency={asset.price.split(' ')[0]} 
          amount={asset.price.split(' ').slice(1).join(' ')} 
          size="xs" 
          align="right" 
        />
      </div>

      <div className="w-1/6 flex flex-col items-end">
        <p className="text-[9px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-0.5">GAIN</p>
        <p className="text-[14px] font-mono font-bold text-green-600">{asset.gain}</p>
      </div>
      
      <div className="w-12 flex justify-end">
        <svg className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
    </div>
  );
};

export default HeldAssetRow;
