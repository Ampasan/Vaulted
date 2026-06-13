import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const featuredAuction = {
  image: 'https://picsum.photos/800/600?random=20',
  lot: 'LOT 8003',
  date: 'June 2026',
  title: 'Patek Philippe Grandmaster Chime',
  subtitle: 'Ref 6300A-010 - Unique Piece in Stainless Steel',
  currentBid: 'CHF 31,190,400',
  bids: '14 BIDS'
};

const activeLots = [
  {
    id: 1,
    image: 'https://picsum.photos/600/400?random=21',
    lot: 'LOT 8001',
    title: 'Ferrari 250 GTO',
    subtitle: 'Chassis 3413 GT - Scaglietti Coachwork',
    currentBid: 'CHF 48,400,000',
    timeLeft: 'Ends in 00:00:30'
  },
  {
    id: 2,
    image: 'https://picsum.photos/600/400?random=22',
    lot: 'LOT 8042',
    title: 'Titanium Monolith',
    subtitle: 'Anonymous Contemporary Art',
    currentBid: 'CHF 1,250,000',
    timeLeft: 'Ends in 04:12:00'
  },
  {
    id: 3,
    image: 'https://picsum.photos/600/400?random=23',
    lot: 'LOT 8011',
    title: 'Porsche Carrera GT',
    subtitle: '5.7L V10 - Only 1,270 Produced',
    currentBid: 'CHF 1,850,000',
    timeLeft: 'Ends in 06:15:21'
  }
];

const upcomingCatalog = [
  {
    id: 1,
    image: 'https://picsum.photos/200/200?random=24',
    title: 'Hermès Birkin Collection',
    time: 'Commencing 12.06.2026 | 16:00 GMT'
  },
  {
    id: 2,
    image: 'https://picsum.photos/200/200?random=25',
    title: 'Basquiat Painting Series',
    time: 'Commencing 24.06.2026 | 18:00 GMT'
  },
  {
    id: 3,
    image: 'https://picsum.photos/200/200?random=26',
    title: 'Post-War Photography Archive',
    time: 'Commencing 01.07.2026 | 15:30 GMT'
  }
];

const AuctionsPage = () => {
  return (
    <div className="flex flex-col w-full bg-cream text-ink">
      <Navbar />
      
      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-12 pb-32">
         {/* Header */}
         <div className="mb-12">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mb-4 font-bold">
              VAULTED <span className="mx-2">&gt;</span> AUCTION ROOM
            </p>
            <h1 className="text-5xl md:text-[64px] font-black tracking-tighter mb-4 uppercase">Live &amp; Upcoming Auctions</h1>
            <p className="text-[#6b6b6b] text-[12px] font-medium max-w-xl mb-12">
              Real-time bidding on verified high-value assets.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex items-center border border-[#dcd9ce] bg-transparent px-5 py-3.5 mb-16">
              <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input 
                type="text" 
                placeholder="Search lots by title or description..." 
                className="bg-transparent border-none outline-none w-full text-[11px] text-black placeholder-gray-400 tracking-wide font-medium"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-10 border-b border-[#dcd9ce] pb-0">
               <button className="text-[10px] tracking-[0.15em] font-bold uppercase border-b-2 border-black pb-3.5 text-black">All Lots</button>
               <button className="text-[10px] tracking-[0.15em] font-bold uppercase pb-3.5 text-gray-500 hover:text-black transition-colors">Fine Art</button>
               <button className="text-[10px] tracking-[0.15em] font-bold uppercase pb-3.5 text-gray-500 hover:text-black transition-colors">Horology</button>
               <button className="text-[10px] tracking-[0.15em] font-bold uppercase pb-3.5 text-gray-500 hover:text-black transition-colors">Hypercars</button>
            </div>
         </div>

         {/* Featured Auction */}
         <div className="border border-[#dcd9ce] bg-cream-light p-6 md:p-8 flex flex-col lg:flex-row gap-8 lg:gap-16 mb-24">
            <div className="w-full lg:w-3/5 relative bg-cream-light aspect-[16/10] overflow-hidden">
               <div className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-bold px-2.5 py-1 tracking-[0.2em] uppercase z-10 flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)] animate-pulse"></span> LIVE
               </div>
               <div className="absolute top-4 right-4 bg-black text-white text-[8px] font-bold px-2 py-1 tracking-[0.2em] uppercase z-10">
                 AUTHENTICATED
               </div>
               <img src={featuredAuction.image} alt={featuredAuction.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="w-full lg:w-2/5 flex flex-col justify-center">
               <p className="text-[9px] text-[#8a8a8a] tracking-[0.2em] uppercase font-bold mb-3">{featuredAuction.lot} <span className="mx-2">•</span> {featuredAuction.date}</p>
               <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-3">{featuredAuction.title}</h2>
               <p className="text-[11px] font-medium text-gray-500 mb-10">{featuredAuction.subtitle}</p>
               
               <p className="text-[9px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-1">Current Bid CHF</p>
               <div className="flex items-baseline gap-4 mb-8">
                 <p className="text-3xl font-black text-black">{featuredAuction.currentBid}</p>
                 <div className="flex items-center gap-1.5 text-red-600 text-[10px] font-bold tracking-[0.1em]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {featuredAuction.bids}
                 </div>
               </div>
               
               <button className="w-full bg-black text-white py-4 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-gray-800 transition-colors">
                  ENTER AUCTION ROOM &gt;
               </button>
            </div>
         </div>

         {/* Active Lots */}
         <div className="mb-24">
            <div className="flex justify-between items-end mb-8 border-b border-[#dcd9ce] pb-4">
              <h2 className="text-xl font-black tracking-tight text-black">Active Lots</h2>
              <a href="#" className="text-[9px] tracking-[0.2em] font-bold text-gray-500 uppercase hover:text-black transition-colors mb-1">View All Lots &gt;</a>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {activeLots.map(lot => (
                  <div key={lot.id} className="group cursor-pointer bg-cream-light border border-[#dcd9ce] flex flex-col">
                     <div className="relative overflow-hidden bg-cream-light aspect-[16/9]">
                        <div className="absolute top-4 left-4 bg-red-600 text-white text-[8px] font-bold px-2 py-1 tracking-[0.2em] uppercase z-10 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)] animate-pulse"></span> LIVE
                        </div>
                        <div className="absolute top-4 right-4 bg-cream/90 p-1.5 rounded-full z-10 hover:bg-white transition-colors cursor-pointer">
                          <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        </div>
                        <img src={lot.image} alt={lot.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                     </div>
                     <div className="p-6">
                        <p className="text-[9px] text-[#8a8a8a] tracking-[0.2em] uppercase font-bold mb-1.5">{lot.lot}</p>
                        <h3 className="text-[14px] font-black leading-tight mb-1">{lot.title}</h3>
                        <p className="text-[10px] font-medium text-gray-500 mb-6">{lot.subtitle}</p>
                        
                        <div className="flex justify-between items-end">
                           <div>
                              <p className="text-[8px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-1">Current Bid</p>
                              <p className="text-[14px] font-black text-black mb-1">{lot.currentBid}</p>
                              <p className="text-[10px] text-gray-500 font-medium">{lot.timeLeft}</p>
                           </div>
                           <button className="bg-black text-white px-6 py-2.5 text-[8px] tracking-[0.2em] font-bold uppercase hover:bg-gray-800 transition-colors">
                              PLACE BID
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Upcoming Catalog */}
         <div>
            <div className="mb-8 border-b border-[#dcd9ce] pb-4">
              <h2 className="text-xl font-black tracking-tight text-black">Upcoming Catalog</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {upcomingCatalog.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-cream-light border border-[#dcd9ce] p-4 cursor-pointer hover:bg-white transition-colors group">
                     <div className="w-16 h-16 flex-shrink-0 bg-cream-light">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[8px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-1">Upcoming</p>
                        <h4 className="text-[11px] font-black truncate text-black mb-1">{item.title}</h4>
                        <p className="text-[9px] text-gray-500 truncate font-medium">{item.time}</p>
                     </div>
                     <div className="flex-shrink-0 text-gray-400 group-hover:text-black transition-colors px-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
      </main>

      <Footer />
    </div>
  );
};

export default AuctionsPage;
