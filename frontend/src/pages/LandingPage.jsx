import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LotCard from '../components/features/auction/LotCard';
import AssetCard from '../components/features/asset/AssetCard';

const liveAuctionsData = [
  {
    id: 1,
    image: 'https://picsum.photos/800/600?random=1',
    lotNumber: 'LOT 9042',
    title: 'Patek Philippe Grandmaster Chime',
    subtitle: 'Ref. 6300A-010 - Unique Piece',
    currentBid: 'CHF 31,190,400',
    timeLeft: '02:45:12',
    bids: ''
  },
  {
    id: 2,
    image: 'https://picsum.photos/800/600?random=2',
    lotNumber: 'LOT 8051',
    title: '1962 Ferrari 250 GTO',
    subtitle: 'Chassis 3413 GT - Scaglietti Coachwork',
    currentBid: 'CHF 48,400,000',
    timeLeft: 'Ends in 00:00:00',
    bids: 'Bids: 14 (CLOSED)'
  },
  {
    id: 3,
    image: 'https://picsum.photos/800/600?random=3',
    lotNumber: 'LOT 9048',
    title: 'Titanium Monolith',
    subtitle: 'Anonymous Contemporary Art',
    currentBid: 'CHF 1,250,000',
    timeLeft: 'Ends in 05:12:00',
    bids: ''
  }
];

const recentAcquisitionsData = [
  {
    id: 1,
    image: 'https://picsum.photos/600/800?random=4',
    category: 'Fine Art',
    title: 'The Blue Royal',
    price: 'CHF 2,150,000'
  },
  {
    id: 2,
    image: 'https://picsum.photos/600/800?random=5',
    category: 'Collectibles',
    title: 'Leica M3 TTL',
    price: 'CHF 15,000'
  },
  {
    id: 3,
    image: 'https://picsum.photos/600/800?random=6',
    category: 'Horology',
    title: 'Rolex Daytona Ref. 6265',
    price: 'CHF 320,000'
  },
  {
    id: 4,
    image: 'https://picsum.photos/600/800?random=7',
    category: 'Fine Art',
    title: 'Basquiat "Untitled" 1982',
    price: 'CHF 3,500,000'
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-cream text-ink font-sans selection:bg-black selection:text-white flex flex-col w-full">
      <Navbar />
      
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-80px)]">
          <div className="flex-1 px-6 md:px-12 lg:pl-16 xl:pl-24 lg:pr-12 flex flex-col justify-center py-16 lg:py-0 space-y-10 lg:max-w-[50%]">
            <p className="text-[10px] tracking-[0.25em] text-gray-500 uppercase font-bold">The Grand Gallery — 2026</p>
            <h1 className="text-[70px] md:text-[90px] xl:text-[112px] font-black leading-[0.85] tracking-tighter text-black">
              Acquire<br />Rarity.
            </h1>
            <p className="text-gray-500 max-w-md leading-relaxed text-[15px] font-medium pr-12">
              Authenticated physical assets horology, fine art, and automotive available through private treaty and live auction.
            </p>
            <div className="flex items-center gap-7 pt-6">
              <button className="bg-black text-white px-8 py-4 text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-gray-800 transition-colors whitespace-nowrap">
                Enter Auction Room &rarr;
              </button>
              <button className="text-black text-[10px] tracking-[0.2em] font-bold uppercase border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors whitespace-nowrap">
                Browse Marketplace
              </button>
            </div>
          </div>
          <div className="flex-1 w-full relative min-h-[50vh] lg:min-h-0 bg-gray-200">
            <img 
              src="https://picsum.photos/1200/800?random=10" 
              alt="Hero" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8 text-white/70 text-[9px] tracking-[0.2em] font-bold uppercase z-10 mix-blend-difference">
              Patek Philippe — Ref 6300A-010
            </div>
          </div>
        </section>

        {/* Live Auctions */}
        <section className="px-6 md:px-12 lg:px-16 xl:px-24 py-24 w-full">
          <div className="flex justify-between items-end mb-12 border-b border-gray-300 pb-4">
            <h2 className="text-2xl font-black tracking-tight text-black">Live Auctions</h2>
            <a href="#" className="text-[10px] tracking-[0.2em] font-bold text-gray-500 uppercase hover:text-black transition-colors mb-1">View All &rarr;</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {liveAuctionsData.map(lot => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        </section>

        {/* Recent Acquisitions */}
        <section className="px-6 md:px-12 lg:px-16 xl:px-24 py-24 w-full bg-cream">
          <div className="flex justify-between items-end mb-12 border-b border-gray-300 pb-4">
            <h2 className="text-2xl font-black tracking-tight text-black">Recent Acquisitions</h2>
            <a href="#" className="text-[10px] tracking-[0.2em] font-bold text-gray-500 uppercase hover:text-black transition-colors mb-1">View All &rarr;</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {recentAcquisitionsData.map(asset => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-[#0c0c0c] text-white px-6 md:px-12 lg:px-16 xl:px-24 pt-32 pb-16 w-full">
          <div className="max-w-400 mx-auto">
            <h2 className="text-6xl md:text-8xl lg:text-[100px] font-black tracking-tighter mb-4">List Your Asset.</h2>
            <p className="text-[#6b6b6b] max-w-xl text-[13px] font-medium leading-relaxed">
              Submit your piece for vault appraisal and list through private treaty or live auction.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
