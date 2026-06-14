import { Search } from 'lucide-react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const SearchBar = ({ placeholder = 'Search...', value, onChange, className = '', inputClassName = '' }) => {
  return (
    <div className={cx("max-w-2xl flex items-center border border-[#dcd9ce] bg-transparent px-5 py-3.5", className)}>
      <Search className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cx("bg-transparent border-none outline-none w-full text-[15px] text-black placeholder-gray-400 tracking-wide font-medium", inputClassName)}
      />
    </div>
  );
};

export default SearchBar;
