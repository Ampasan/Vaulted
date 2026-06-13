import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const marketplaceData = [
  { id: 1, image: 'https://picsum.photos/600/800?random=11', featured: true, maker: 'PATEK', title: 'Cosmograph Daytona 1969', ref: 'Ref. 6263', prevPrice: 'CHF 388,000', currPrice: 'CHF 458,000' },
  { id: 2, image: 'https://picsum.photos/600/800?random=12', featured: false, maker: 'FORMATIGN', title: 'Le Rêve Lithograph 1932', ref: 'Print 4/12', prevPrice: 'CHF 95,000', currPrice: 'CHF 120,000' },
  { id: 3, image: 'https://picsum.photos/600/800?random=13', featured: false, maker: 'FERRARI', title: 'F3 Carrera GT 1973', ref: 'Chassis 7087267', prevPrice: 'CHF 720,000', currPrice: 'CHF 850,000' },
  { id: 4, image: 'https://picsum.photos/600/800?random=14', featured: false, maker: 'ROLEX', title: 'Submariner \'Comex\' 1680', ref: 'Ref. 1680 - Comex 1970', prevPrice: 'CHF 145,000', currPrice: 'CHF 165,000' },
  { id: 5, image: 'https://picsum.photos/600/800?random=15', featured: false, maker: 'BASQUIAT', title: 'Untitled (Skull) 1981', ref: 'Acrylic on canvas - 40x30in', prevPrice: 'CHF 4,200,000', currPrice: 'CHF 5,100,000' },
  { id: 6, image: 'https://picsum.photos/600/800?random=16', featured: false, maker: 'LAMBORGHINI', title: 'Miura P400 SV 1972', ref: '3.9L V12 - Matching Numbers', prevPrice: 'CHF 2,100,000', currPrice: 'CHF 2,450,000' }
];

const Marketplace = () => {
  return (
    <div className="flex flex-col w-full bg-cream text-ink">
      <Navbar />
      
      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-12 pb-32">
         {/* Header */}
         <div className="mb-12">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mb-4 font-bold">
              VAULTED <span className="mx-2">&gt;</span> MARKETPLACE
            </p>
            <h1 className="text-5xl md:text-[64px] font-black tracking-tighter mb-4 uppercase">Marketplace</h1>
            <p className="text-[#6b6b6b] text-[12px] font-medium max-w-xl mb-12">
              Curated authenticated physical assets available for immediate acquisition. Vault-listing required.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex items-center border border-[#dcd9ce] bg-transparent px-5 py-3.5 mb-16">
              <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input 
                type="text" 
                placeholder="Search by title, maker, or category..." 
                className="bg-transparent border-none outline-none w-full text-[11px] text-black placeholder-gray-400 tracking-wide font-medium"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-10 border-b border-[#dcd9ce] pb-0">
               <button className="text-[10px] tracking-[0.15em] font-bold uppercase border-b-2 border-black pb-3.5 text-black">All Categories</button>
               <button className="text-[10px] tracking-[0.15em] font-bold uppercase pb-3.5 text-gray-500 hover:text-black transition-colors">Horology</button>
               <button className="text-[10px] tracking-[0.15em] font-bold uppercase pb-3.5 text-gray-500 hover:text-black transition-colors">Fine Art</button>
               <button className="text-[10px] tracking-[0.15em] font-bold uppercase pb-3.5 text-gray-500 hover:text-black transition-colors">Automotive</button>
            </div>
         </div>

         {/* Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {marketplaceData.map(item => (
               <div key={item.id} className="group cursor-pointer flex flex-col h-full">
                  <div className="relative overflow-hidden mb-5 bg-cream-light aspect-[4/5]">
                     {item.featured && (
                        <div className="absolute top-4 left-4 bg-[#111] text-white text-[8px] font-bold px-2 py-1 tracking-[0.2em] uppercase z-10">
                           FEATURED
                        </div>
                     )}
                     <div className="absolute top-4 right-4 bg-cream/90 p-1.5 rounded-full z-10 hover:bg-white transition-colors cursor-pointer">
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                     </div>
                     <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  </div>
                  
                  <div className="flex flex-col flex-1">
                     <p className="text-[9px] text-[#8a8a8a] tracking-[0.2em] uppercase font-bold mb-1.5">{item.maker}</p>
                     <h3 className="text-[13px] font-black leading-snug line-clamp-1">{item.title}</h3>
                     <p className="text-[10px] font-medium text-gray-500 mt-1">{item.ref}</p>
                     
                     <div className="mt-6 mb-5">
                        <p className="text-[8px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-1.5">Acquisition Value</p>
                        <p className="text-[10px] text-gray-500 font-medium mb-0.5">{item.prevPrice}</p>
                        <p className="text-[13px] font-black text-black">{item.currPrice}</p>
                     </div>

                     <button className="mt-auto w-full bg-[#0a0a0a] text-white py-3.5 text-[9px] tracking-[0.2em] font-bold uppercase hover:bg-gray-800 transition-colors">
                        ACQUIRE INSTANTLY &gt;
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
