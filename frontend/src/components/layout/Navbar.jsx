import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-12 lg:px-16 py-6 text-[12px] tracking-[0.15em] uppercase font-bold text-black border-b border-gray-300 bg-cream">
      <div className="text-xl md:text-2xl font-black tracking-tighter w-48">
        <Link to="/">VAULTED</Link>
      </div>
      <div className="hidden lg:flex flex-1 items-center justify-center gap-10 text-gray-600">
        <Link to="/marketplace" className="hover:text-black transition-colors text-black">Marketplace</Link>
        <Link to="/auctions" className="hover:text-black transition-colors text-black">Auctions</Link>
        <a href="#" className="hover:text-black transition-colors">Asset</a>
        <a href="#" className="hover:text-black transition-colors">Portfolio</a>
        <a href="#" className="hover:text-black transition-colors">Wishlist</a>
        <a href="#" className="hover:text-black transition-colors">Profile</a>
      </div>
      <div className="flex items-center justify-end gap-6 w-48">
        <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-600 transition-colors">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
           <div className="relative">
             <span className="absolute -top-3 -right-2 bg-red-600 text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center">3</span>
           </div>
        </div>
        <div className="hidden md:block cursor-pointer hover:text-gray-600 transition-colors">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <Link
          to="/auth"
          className="bg-black text-white px-5 py-2.5 text-[10px] tracking-[0.2em] font-bold hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          LOGIN / SIGN UP
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
