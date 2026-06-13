const Footer = () => {
  return (
    <footer className="bg-[#0c0c0c] text-white px-6 md:px-12 lg:px-16 xl:px-18 pb-12 pt-8 w-full">
      <div className="max-w-400 mx-auto flex flex-col md:flex-row justify-between mb-32">
        {/* Left side */}
        <div className="flex-1 mb-16 md:mb-0">
          <div className="text-xl md:text-2xl font-black tracking-[0.2em] mb-6 uppercase">VAULTED</div>
          <p className="text-[#6b6b6b] text-[13px] font-medium">
            Private marketplace for verified high-value physical assets.
          </p>
        </div>
        
        {/* Right side */}
        <div className="flex gap-20 md:gap-32 lg:mr-16">
          {/* Navigate */}
          <div className="flex flex-col gap-5">
            <h4 className="text-[#4a4a4a] text-[15px] tracking-[0.15em] font-bold uppercase mb-2">Navigate</h4>
            <a href="#" className="text-[#c4c4c4] text-[15px] tracking-[0.15em] font-bold uppercase hover:text-white transition-colors">Marketplace</a>
            <a href="#" className="text-[#c4c4c4] text-[15px] tracking-[0.15em] font-bold uppercase hover:text-white transition-colors">Auctions</a>
            <a href="#" className="text-[#c4c4c4] text-[15px] tracking-[0.15em] font-bold uppercase hover:text-white transition-colors">Asset</a>
            <a href="#" className="text-[#c4c4c4] text-[15px] tracking-[0.15em] font-bold uppercase hover:text-white transition-colors">Portfolio</a>
            <a href="#" className="text-[#c4c4c4] text-[15px] tracking-[0.15em] font-bold uppercase hover:text-white transition-colors">Wishlist</a>
            <a href="#" className="text-[#c4c4c4] text-[15px] tracking-[0.15em] font-bold uppercase hover:text-white transition-colors">Profile</a>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-5">
            <h4 className="text-[#4a4a4a] text-[10px] tracking-[0.15em] font-bold uppercase mb-2">Legal</h4>
            <a href="#" className="text-[#c4c4c4] text-[10px] tracking-[0.15em] font-bold uppercase hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-[#c4c4c4] text-[10px] tracking-[0.15em] font-bold uppercase hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-[#c4c4c4] text-[10px] tracking-[0.15em] font-bold uppercase hover:text-white transition-colors">Security</a>
            <a href="#" className="text-[#c4c4c4] text-[10px] tracking-[0.15em] font-bold uppercase hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-400 mx-auto flex flex-col md:flex-row justify-between items-center text-[#4a4a4a] text-[9px] tracking-[0.15em] uppercase font-bold pt-8 border-t border-[#2a2a2a]">
        <p>© 2026 VAULTED WEB. ALL RIGHTS RESERVED. PRIVATE MEMBERSHIP REQUIRED.</p>
        <p>VAULT SECURITY ASSURED.</p>
      </div>
    </footer>
  );
};

export default Footer;
