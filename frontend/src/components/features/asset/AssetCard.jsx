import React from 'react';

const AssetCard = ({ asset }) => {
  return (
    <div className="group cursor-pointer flex flex-col h-full">
      <div className="overflow-hidden mb-5 bg-gray-200 aspect-[3/4]">
        <img 
          src={asset.image} 
          alt={asset.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="space-y-1.5 flex-1 flex flex-col">
        <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase font-bold">{asset.category}</p>
        <h3 className="text-sm font-black leading-snug line-clamp-1">{asset.title}</h3>
        <p className="text-[11px] font-medium text-gray-500 mt-auto pt-1">{asset.price}</p>
      </div>
    </div>
  );
};

export default AssetCard;
