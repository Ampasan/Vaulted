import React, { useState, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';
import PortfolioChart from '../components/features/portfolio/PortfolioChart';
import AllocationChart from '../components/features/portfolio/AllocationChart';
import AssetCard from '../components/features/asset/AssetCard';
import HeldAssetRow from '../components/features/portfolio/HeldAssetRow';

const heldAssets = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    title: '"Untitled" 1982',
    category: 'BASQUIAT',
    price: 'CHF 3.20M',
    priceLabel: 'CURRENT VALUE',
    gain: '+6.0%',
    location: 'Geneva Freeport Alpha',
    status: 'in-storage',
    date: '2023-05-12',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    title: 'Miura P400 SV 1972',
    category: 'LAMBORGHINI',
    price: 'CHF 2.80M',
    priceLabel: 'CURRENT VALUE',
    gain: '+14.3%',
    location: 'Monaco Heritage Vault',
    status: 'yield-check-in',
    date: '2022-11-04',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800',
    title: '1962 Ferrari 250 GTO (Shares)',
    category: 'FERRARI',
    price: 'CHF 1.02M',
    priceLabel: 'CURRENT VALUE',
    gain: '+28.0%',
    location: 'Zurich Secure Storage',
    status: 'under-contract',
    date: '2021-08-21',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
    title: 'Daytona Ref. 6265',
    category: 'ROLEX',
    price: 'CHF 445,000',
    priceLabel: 'CURRENT VALUE',
    gain: '+39.1%',
    location: 'Geneva Freeport Alpha',
    status: 'yield-check-in',
    date: '2020-03-15',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800',
    title: 'Birkin 35 Himalaya',
    category: 'HERMÈS',
    price: 'CHF 295,000',
    priceLabel: 'CURRENT VALUE',
    gain: '+5.4%',
    location: 'Geneva Freeport Alpha',
    status: 'sold',
    date: '2023-09-02',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',
    title: 'Nautilus 5711/1A',
    category: 'PATEK PHILIPPE',
    price: 'CHF 165,000',
    priceLabel: 'CURRENT VALUE',
    gain: '+32.0%',
    location: 'Geneva Freeport Alpha',
    status: 'in-storage',
    date: '2021-12-10',
  }
];

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  let numStr = priceStr.replace(/[^0-9.M]/g, '');
  let multiplier = 1;
  if (numStr.includes('M')) {
    multiplier = 1000000;
    numStr = numStr.replace('M', '');
  }
  return parseFloat(numStr) * multiplier;
};

const parseGain = (gainStr) => {
  if (!gainStr) return 0;
  return parseFloat(gainStr.replace(/[^0-9.-]/g, ''));
};

const PortfolioPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('value');

  const sortedAssets = useMemo(() => {
    return [...heldAssets].sort((a, b) => {
      if (sortBy === 'value') {
        return parsePrice(b.price) - parsePrice(a.price); // Descending value
      } else if (sortBy === 'gain') {
        return parseGain(b.gain) - parseGain(a.gain); // Descending gain
      } else if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date); // Newest date first
      }
      return 0;
    });
  }, [sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink">
      <Navbar activeLink="portfolio" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12">
          <a href="#" className="inline-flex items-center text-[9px] tracking-[0.2em] font-bold text-gray-400 hover:text-black uppercase mb-8 transition-colors">
            VAULTED <span className="mx-2 text-gray-300">/</span> COLLECTION PORTFOLIO
          </a>
          
          <div className="flex justify-between items-end">
            <h1 className="text-5xl md:text-6xl font-black font-serif tracking-tight">My Portfolio</h1>
            <Button variant="primary" size="md" className="gap-2">
              MAKE A DEPOSIT <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-[#dcd9ce] mb-8 bg-transparent">
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#dcd9ce]">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">TOTAL VAULT VALUE</p>
            <p className="text-2xl font-mono text-black font-bold mb-1">CHF 7.92M</p>
            <p className="text-[10px] text-gray-400 font-mono">6 assets</p>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#dcd9ce]">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">UNREALIZED GAIN</p>
            <p className="text-2xl font-mono text-green-600 font-bold mb-1">+CHF 700,000</p>
            <p className="text-[10px] text-gray-400 font-mono">+9.7% since acquisition</p>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#dcd9ce]">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">ACQUISITION COST</p>
            <p className="text-2xl font-mono text-black font-bold mb-1">CHF 7.22M</p>
            <p className="text-[10px] text-gray-400 font-mono">Total deployed capital</p>
          </div>
          <div className="p-6">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">ACTIVE BIDS</p>
            <p className="text-2xl font-mono text-black font-bold mb-1">02</p>
            <p className="text-[10px] text-gray-400 font-mono">Live auction rooms</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 h-[320px]">
          <div className="lg:col-span-2 h-full">
            <PortfolioChart />
          </div>
          <div className="lg:col-span-1 h-full">
            <AllocationChart />
          </div>
        </div>

        {/* Held Assets Section */}
        <div>
          <div className="flex justify-between items-end border-b border-[#dcd9ce] pb-4 mb-6">
            <h2 className="text-2xl font-black font-serif tracking-tight">Held Assets</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold">SORT:</span>
                <span 
                  onClick={() => setSortBy('value')}
                  className={`text-[10px] font-bold uppercase tracking-[0.1em] cursor-pointer transition-colors ${sortBy === 'value' ? 'text-black border-b border-black' : 'text-gray-400 hover:text-black'}`}
                >VALUE</span>
                <span 
                  onClick={() => setSortBy('gain')}
                  className={`text-[10px] font-bold uppercase tracking-[0.1em] cursor-pointer transition-colors ${sortBy === 'gain' ? 'text-black border-b border-black' : 'text-gray-400 hover:text-black'}`}
                >GAIN</span>
                <span 
                  onClick={() => setSortBy('date')}
                  className={`text-[10px] font-bold uppercase tracking-[0.1em] cursor-pointer transition-colors ${sortBy === 'date' ? 'text-black border-b border-black' : 'text-gray-400 hover:text-black'}`}
                >DATE</span>
              </div>
              <Toggle mode="icons" value={viewMode} onValueChange={setViewMode} />
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAssets.map(asset => (
                <AssetCard key={asset.id} asset={{...asset, aspect: 'landscape', framed: false}} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              {sortedAssets.map(asset => (
                <HeldAssetRow key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PortfolioPage;
