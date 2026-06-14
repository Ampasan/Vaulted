import { Link } from "react-router-dom";
import { Bell, User } from "lucide-react";

const navLinkClass = (isDark, isActive) => {
  if (isActive) {
    return isDark
      ? "text-white underline underline-offset-4 decoration-2 hover:text-white"
      : "text-black underline underline-offset-4 decoration-2 hover:text-black";
  }

  return isDark
    ? "transition-colors hover:text-white"
    : "text-black transition-colors hover:text-black";
};

const Navbar = ({ variant = "light", activeLink }) => {
  const isDark = variant === "dark";

  return (
    <nav
      className={`w-full sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-16 py-6 text-[12px] tracking-[0.15em] uppercase font-bold ${
        isDark
          ? "bg-black text-white"
          : "text-black border-b border-gray-300 bg-cream"
      }`}
    >
      <div className="text-xl md:text-2xl font-black tracking-tighter w-48">
        <Link to="/">VAULTED</Link>
      </div>
      <div
        className={`hidden lg:flex flex-1 items-center justify-center gap-10 ${isDark ? "text-[#888888]" : "text-gray-600"}`}
      >
        <Link
          to="/marketplace"
          className={navLinkClass(isDark, activeLink === "marketplace")}
        >
          Marketplace
        </Link>
        <Link
          to="/auctions"
          className={navLinkClass(isDark, activeLink === "auctions")}
        >
          Auctions
        </Link>
        <Link
          to="/asset"
          className={navLinkClass(isDark, activeLink === "asset")}
        >
          Asset
        </Link>
        <Link
          to="/portfolio"
          className={navLinkClass(isDark, activeLink === "portfolio")}
        >
          Portfolio
        </Link>
        <Link
          to="/wishlist"
          className={navLinkClass(isDark, activeLink === "wishlist")}
        >
          Wishlist
        </Link>
        <Link
          to="/profile"
          className={navLinkClass(isDark, activeLink === "profile")}
        >
          Profile
        </Link>
      </div>
      <div className="flex items-center justify-end gap-6 w-48">
        <Link
          to="/notifications"
          className={`relative flex items-center gap-1.5 transition-colors ${isDark ? "hover:text-[#888888]" : "hover:text-gray-600"}`}
          aria-label="Notifications"
        >
          <Bell size={16} strokeWidth={2.5} />
          <span className="absolute -top-2.5 -right-2 bg-red-600 text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
            3
          </span>
        </Link>
        <Link
          to="/profile"
          className={`hidden md:flex items-center justify-center transition-colors ${isDark ? "hover:text-[#888888]" : "hover:text-gray-600"}`}
          aria-label="Profile"
        >
          <User size={16} strokeWidth={2} />
        </Link>
        <Link
          to="/auth"
          className={`px-5 py-2.5 text-[10px] tracking-[0.2em] font-bold transition-colors whitespace-nowrap ${
            isDark
              ? "bg-black text-white border border-white hover:bg-ink"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          LOGIN / SIGN UP
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
