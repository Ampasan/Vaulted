import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AssetCard from '../components/features/asset/AssetCard';
import AssetGrid from '../components/features/asset/AssetGrid';
import Button from '../components/ui/Button';
import assetService from '../services/assetService';

const getTimeLeft = (endTime) => {
  const diff = new Date(endTime) - new Date();
  if (diff <= 0) return 'Ended';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getCategoryLabel = (category = '', name = '', description = '') => {
  const text = `${category} ${name} ${description}`.toLowerCase();
  if (text.includes('patek') || text.includes('rolex') || text.includes('watch') || text.includes('nautilus') || text.includes('chronograph') || text.includes('daytona') || text.includes('horology')) {
    return 'Horology';
  }
  if (text.includes('ferrari') || text.includes('lamborghini') || text.includes('car') || text.includes('miura') || text.includes('automotive') || text.includes('gt')) {
    return 'Automotive';
  }
  if (text.includes('basquiat') || text.includes('art') || text.includes('painting') || text.includes('skull') || text.includes('lithograph') || text.includes('fine-art') || text.includes('fine art')) {
    return 'Fine Art';
  }
  return category || 'Horology';
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [recentAcquisitions, setRecentAcquisitions] = useState([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aucRes, marketRes] = await Promise.all([
          assetService.getAuctions('active'),
          assetService.getMarketplaceItems(),
        ]);

        if (aucRes.success && aucRes.data) {
          const formatted = aucRes.data.map((auc) => {
            const item = auc.itemId || {};
            const lotSerial = `LOT ${auc._id.substring(18).toUpperCase()}`;
            return {
              id: auc._id,
              image: Array.isArray(item.imageUrl) && item.imageUrl.length > 0
                ? item.imageUrl[0]
                : item.imageUrl,
              lotNumber: lotSerial,
              title: item.name || 'Untitled Lot',
              subtitle: item.description || 'No description provided.',
              currentBid: `CHF ${(Math.max(auc.currentBid, auc.startPrice) || 0).toLocaleString()}`,
              endTime: auc.endTime,
              bids: '',
            };
          });
          setLiveAuctions(formatted);
        }

        if (marketRes.success && marketRes.data) {
          const formatted = marketRes.data.slice(0, 4).map((item) => {
            const cat = getCategoryLabel(item.category, item.name, item.description);
            return {
              id: item._id,
              image: Array.isArray(item.imageUrl) && item.imageUrl.length > 0
                ? item.imageUrl[0]
                : item.imageUrl,
              category: cat,
              title: item.name || 'Untitled Piece',
              price: `CHF ${item.currentPrice?.toLocaleString() || '0'}`,
            };
          });
          setRecentAcquisitions(formatted);
        }
      } catch (err) {
        console.error('Error loading landing page data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const liveList = useMemo(() => {
    return liveAuctions.slice(0, 3).map((lot) => ({
      ...lot,
      timeLeft: `Ends in ${getTimeLeft(lot.endTime)}`,
    }));
  }, [liveAuctions, now]);

  const recentList = recentAcquisitions;

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
              <Button onClick={() => navigate('/auctions')}>
                Enter Auction Room &rarr;
              </Button>
              <Button variant="link" size="link" onClick={() => navigate('/marketplace')}>
                Browse Marketplace
              </Button>
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
            <Link to="/auctions" className="text-[10px] tracking-[0.2em] font-bold text-gray-500 uppercase hover:text-black transition-colors mb-1">View All &rarr;</Link>
          </div>
          <AssetGrid
            items={liveList}
            columns={3}
            renderItem={(lot) => {
              return <Link key={lot.id} to={`/auctions/${lot.id}`} className="block h-full">
                <AssetCard
                  asset={{
                    ...lot,
                    category: lot.lotNumber,
                    status: lot.endTime && new Date(lot.endTime) <= now ? 'closed' : 'live',
                    aspect: 'auction',
                  }}
                />
              </Link>
            }}
          />
        </section>

        {/* Recent Acquisitions */}
        <section className="px-6 md:px-12 lg:px-16 xl:px-24 py-24 w-full bg-cream">
          <div className="flex justify-between items-end mb-12 border-b border-gray-300 pb-4">
            <h2 className="text-2xl font-black tracking-tight text-black">Recent Acquisitions</h2>
            <Link to="/marketplace" className="text-[10px] tracking-[0.2em] font-bold text-gray-500 uppercase hover:text-black transition-colors mb-1">View All &rarr;</Link>
          </div>
          <AssetGrid
            items={recentList}
            columns={4}
            renderItem={(asset) => {
              return <Link key={asset.id} to={`/marketplace/${asset.id}`} className="block h-full">
                <AssetCard asset={asset} />
              </Link>;
            }}
          />
        </section>

        {/* Call to Action */}
        <section className="bg-[#0c0c0c] text-white px-6 md:px-12 lg:px-16 xl:px-18 pt-32 pb-16 w-full">
          <div className="max-w-400 mx-auto">
            <h2 className="text-6xl md:text-8xl lg:text-[70px] font-black tracking-tighter mb-4">List Your Asset.</h2>
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
