import StatusDot from '../../ui/StatusDot';

const LotCard = ({ lot }) => {
  return (
    <div className="group cursor-pointer flex flex-col h-full">
      <div className="relative overflow-hidden mb-5 bg-cream-light aspect-4/3">
        <StatusDot status="live" className="absolute top-4 left-4" />
        <img 
          src={lot.image} 
          alt={lot.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="space-y-1.5 flex-1 flex flex-col">
        <p className="text-[11px] text-gray-500 tracking-[0.2em] uppercase font-bold">{lot.lotNumber}</p>
        <h3 className="text-base font-black leading-tight line-clamp-1">{lot.title}</h3>
        <p className="text-[12px] text-gray-500 line-clamp-1 font-semibold">{lot.subtitle}</p>
        
        <div className="flex justify-between items-end pt-4 mt-auto">
          <div>
            <p className="text-[12px] text-gray-400 tracking-[0.2em] uppercase mb-1 font-bold">Current Bid</p>
            <p className="font-black text-xl">{lot.currentBid}</p>
          </div>
          <div className="text-right">
            {lot.bids && <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{lot.bids}</p>}
            <p className="text-[12px] font-bold tracking-widest text-gray-500 uppercase">{lot.timeLeft}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotCard;
