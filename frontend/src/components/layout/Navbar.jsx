import { Link } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';

const navLinkClass = (isDark, isActive) => {
  if (isActive) {
    return isDark
      ? 'text-white underline underline-offset-4 decoration-2 hover:text-white'
      : 'text-black underline underline-offset-4 decoration-2 hover:text-black';
  }

  return isDark
    ? 'transition-colors hover:text-white'
    : 'text-black transition-colors hover:text-black';
};

const Navbar = ({ variant = 'light', activeLink }) => {
  const isDark = variant === 'dark';

  return (
    <nav
      className={`w-full sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-16 py-6 text-[12px] tracking-[0.15em] uppercase font-bold ${
        isDark
          ? 'bg-black text-white'
          : 'text-black border-b border-gray-300 bg-cream'
      }`}
    >
      <div className="text-xl md:text-2xl font-black tracking-tighter w-48">
        <Link to="/">VAULTED</Link>
      </div>
      <div className={`hidden lg:flex flex-1 items-center justify-center gap-10 ${isDark ? 'text-[#888888]' : 'text-gray-600'}`}>
        <Link to="/marketplace" className={`transition-colors ${isDark ? 'hover:text-white' : 'text-black hover:text-black'}`}>Marketplace</Link>
        <Link to="/auctions" className={`transition-colors ${isDark ? 'hover:text-white' : 'text-black hover:text-black'}`}>Auctions</Link>
        <Link
          to="/asset"
          className={navLinkClass(isDark, activeLink === 'asset')}
        >
          Asset
        </Link>
        <a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Portfolio</a>
        <Link
          to="/wishlist"
          className={navLinkClass(isDark, activeLink === 'wishlist')}
        >
          Wishlist
        </Link>
        <Link
          to="/profile"
          className={navLinkClass(isDark, activeLink === 'profile')}
        >
          Profile
        </Link>
      </div>
      <div className="flex items-center justify-end gap-6 w-48">
        <div className={`flex items-center gap-1.5 cursor-pointer transition-colors ${isDark ? 'hover:text-[#888888]' : 'hover:text-gray-600'}`}>
           <ShoppingBag size={16} strokeWidth={2.5} />
           <div className="relative">
             <span className="absolute -top-3 -right-2 bg-red-600 text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center">3</span>
           </div>
        </div>
        <div className={`hidden md:block cursor-pointer transition-colors ${isDark ? 'hover:text-[#888888]' : 'hover:text-gray-600'}`}>
           <User size={16} strokeWidth={2} />
        </div>
        <Link
          to="/auth"
          className={`px-5 py-2.5 text-[10px] tracking-[0.2em] font-bold transition-colors whitespace-nowrap ${
            isDark
              ? 'bg-black text-white border border-white hover:bg-ink'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          LOGIN / SIGN UP
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
