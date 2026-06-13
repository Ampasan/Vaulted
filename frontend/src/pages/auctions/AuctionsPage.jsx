import { useState } from "react";
import { Clock } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import SearchBar from "../../components/ui/SearchBar";
import Tabs from "../../components/ui/Tabs";
import Button from "../../components/ui/Button";
import StatusDot from "../../components/ui/StatusDot";
import AssetGrid from "../../components/features/asset/AssetGrid";
import AssetCard from "../../components/features/asset/AssetCard";

const featuredAuction = {
  image: "https://picsum.photos/800/600?random=20",
  lot: "LOT 8003",
  date: "YEAR 2026",
  title: "Patek Philippe Grandmaster Chime",
  subtitle: "Ref 6300A-010 - Unique Piece in Stainless Steel",
  currentBid: "CHF 31,190,400",
  bids: "01:45:12",
};

const activeLots = [
  {
    id: 1,
    image: "https://picsum.photos/600/400?random=21",
    lot: "LOT 8001",
    title: "Ferrari 250 GTO",
    subtitle: "Chassis 3413 GT - Scaglietti Coachwork",
    currentBid: "CHF 48,400,000",
    timeLeft: "Ends in 00:00:30",
  },
  {
    id: 2,
    image: "https://picsum.photos/600/400?random=22",
    lot: "LOT 8042",
    title: "Titanium Monolith",
    subtitle: "Anonymous Contemporary Art",
    currentBid: "CHF 1,250,000",
    timeLeft: "Ends in 04:12:00",
  },
  {
    id: 3,
    image: "https://picsum.photos/600/400?random=23",
    lot: "LOT 8011",
    title: "Porsche Carrera GT",
    subtitle: "5.7L V10 - Only 1,270 Produced",
    currentBid: "CHF 1,850,000",
    timeLeft: "Ends in 06:15:21",
  },
];

const upcomingCatalog = [
  {
    id: 1,
    image: "https://picsum.photos/200/200?random=24",
    title: "Hermès Birkin Collection",
    time: "Commencing 12.06.2026 | 16:00 GMT",
  },
  {
    id: 2,
    image: "https://picsum.photos/200/200?random=25",
    title: "Basquiat Painting Series",
    time: "Commencing 24.06.2026 | 18:00 GMT",
  },
  {
    id: 3,
    image: "https://picsum.photos/200/200?random=26",
    title: "Post-War Photography Archive",
    time: "Commencing 01.07.2026 | 15:30 GMT",
  },
];

const auctionTabs = [
  { id: "all", label: "All Lots" },
  { id: "fine-art", label: "Fine Art" },
  { id: "horology", label: "Horology" },
  { id: "hypercars", label: "Hypercars" },
];

const AuctionsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col w-full bg-cream text-ink">
      <Navbar />

      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-12 pb-32">
        <Header
          breadcrumb={
            <>
              VAULTED <span className="mx-2">-</span> AUCTION ROOM
            </>
          }
          title="Live & Upcoming Auctions"
          description="Real-time bidding on verified high-value assets."
        />

        <div className="mb-10">
          <SearchBar
            placeholder="Search lots by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mb-12">
          <Tabs
            tabs={auctionTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Featured Auction */}
        <div className="border border-[#dcd9ce] bg-cream-light p-6 md:p-8 flex flex-col lg:flex-row gap-8 lg:gap-16 mb-18">
          <div className="w-full lg:w-3/5 relative bg-cream-light aspect-16/10 overflow-hidden">
            <StatusDot
              status="live"
              size="md"
              className="absolute top-4 left-4"
            />
            <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-2 py-1 tracking-[0.2em] uppercase z-10">
              AUTHENTICATED
            </div>
            <img
              src={featuredAuction.image}
              alt={featuredAuction.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full lg:w-3/6 flex flex-col justify-center">
            <p className="text-[10px] text-[#8a8a8a] tracking-[0.2em] uppercase font-bold mb-3">
              {featuredAuction.lot} <span className="mx-2">•</span>{" "}
              {featuredAuction.date}
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-3">
              {featuredAuction.title}
            </h2>
            <p className="text-[13px] font-medium text-gray-500 mb-10">
              {featuredAuction.subtitle}
            </p>

            <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-1">
              Current Bid CHF
            </p>
            <div className="flex flex-col gap-2 mb-8">
              <p className="text-4xl font-black text-black">
                {featuredAuction.currentBid}
              </p>
              <div className="flex items-center gap-1.5 text-red-600 text-[12px] font-bold tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                {featuredAuction.bids}
              </div>
            </div>

            <Button fullWidth>ENTER AUCTION ROOM &rarr;</Button>
          </div>
        </div>

        {/* Active Lots */}
        <div className="mb-24">
          <div className="flex justify-between items-end mb-8 border-b border-[#dcd9ce] pb-4">
            <h2 className="text-2xl font-black tracking-tight text-black">
              Active Lots
            </h2>
            <a
              href="#"
              className="text-[11px] tracking-[0.2em] font-bold text-gray-500 uppercase hover:text-black transition-colors mb-1"
            >
              View All Lots &rarr;
            </a>
          </div>
          <AssetGrid
            items={activeLots}
            columns={2}
            renderItem={(lot) => (
              <AssetCard
                asset={{
                  ...lot,
                  category: lot.lot,
                  status: "live",
                  aspect: "landscape",
                  framed: true,
                  showWishlist: true,
                  actionLabel: "PLACE BID",
                  actionPlacement: "inline",
                }}
              />
            )}
          />
        </div>

        {/* Upcoming Catalog */}
        <div>
          <div className="mb-8 border-b border-[#dcd9ce] pb-4">
            <h2 className="text-xl font-black tracking-tight text-black">
              Upcoming Catalog
            </h2>
          </div>
          <AssetGrid
            items={upcomingCatalog}
            columns={3}
            className="gap-6 xl:gap-6"
            renderItem={(item) => (
              <AssetCard
                asset={{
                  ...item,
                  category: "Upcoming",
                  subtitle: item.time,
                  layout: "horizontal",
                  showWishlist: true,
                }}
              />
            )}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuctionsPage;
