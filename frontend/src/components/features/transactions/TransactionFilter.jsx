import SearchBar from '../../ui/SearchBar';
import Button from '../../ui/Button';

const statuses = ['ALL', 'SETTLED', 'IN TRANSIT', 'ESCROW HOLD', 'CANCELLED', 'PENDING'];
const types = ['ALL', 'ACQUISITION', 'AUCTION WIN', 'PRIVATE SALE', 'CONSIGNMENT'];

const TransactionFilter = ({
  activeStatus = 'ALL',
  onStatusChange,
  activeType = 'ALL',
  onTypeChange,
  isOpen = false,
  onToggle,
}) => {
  return (
    <div className="flex flex-col gap-6 mb-12">
      <div className="flex items-center justify-between border-b border-[#dcd9ce] pb-3">
        <div className="w-1/2">
          <SearchBar 
            placeholder="Search by asset or TX ID..." 
            className="border-none px-0! py-0!" 
            inputClassName="text-[10px] tracking-[0.1em] text-black" 
          />
        </div>
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="link"
            onClick={onToggle}
            aria-expanded={isOpen}
            className={`${isOpen ? 'text-black' : 'text-gray-500'} hover:text-black font-bold`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg> FILTER
          </Button>
          <Button variant="ghost" size="link" className="text-gray-500 hover:text-black font-bold">
            DATE <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </Button>
          <Button variant="ghost" size="link" className="text-gray-500 hover:text-black font-bold">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> EXPORT
          </Button>
        </div>
      </div>
      
      {isOpen && (
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-12 text-[10px] tracking-[0.2em] font-bold text-gray-500 uppercase mt-2">
          <div className="flex items-center gap-2">
             <span className="mr-2">STATUS:</span>
             {statuses.map(s => (
               <button 
                 key={s} 
                 onClick={() => onStatusChange && onStatusChange(s)}
                 className={`px-3 py-1.5 border transition-colors ${activeStatus === s ? 'bg-black text-white border-black' : 'border-[#dcd9ce] text-gray-500 hover:bg-gray-100 hover:text-black'}`}
               >
                 {s}
               </button>
             ))}
          </div>
          <div className="flex items-center gap-2">
             <span className="mr-2">TYPE:</span>
             {types.map(t => (
               <button 
                 key={t} 
                 onClick={() => onTypeChange && onTypeChange(t)}
                 className={`px-3 py-1.5 border transition-colors ${activeType === t ? 'bg-black text-white border-black' : 'border-[#dcd9ce] text-gray-500 hover:bg-gray-100 hover:text-black'}`}
               >
                 {t}
               </button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilter;
