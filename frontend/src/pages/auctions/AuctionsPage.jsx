import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import SearchBar from "../../components/ui/SearchBar";
import Tabs from "../../components/ui/Tabs";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import StatusDot from "../../components/ui/StatusDot";
import AssetGrid from "../../components/features/asset/AssetGrid";
import AssetCard from "../../components/features/asset/AssetCard";
import assetService from "../../services/assetService";
import { paginateItems } from "../../utils/pagination";
import useScrollToTop from "../../hooks/useScrollToTop";

const ACTIVE_LOTS_PER_PAGE = 4;
const UPCOMING_LOTS_PER_PAGE = 6;

const auctionTabs = [
  { id: "all", label: "All Lots" },
  { id: "fine-art", label: "Fine Art" },
  { id: "horology", label: "Horology" },
  { id: "hypercars", label: "Hypercars" },
];

const getTimeLeft = (endTime) => {
  const diff = new Date(endTime) - new Date();
  if (diff <= 0) return "Ended";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatUpcomingTime = (dateStr) => {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `Commencing ${day}.${month}.${year} | ${hours}:${mins} GMT`;
};

const getCategoryTabId = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('art') || cat.includes('painting') || cat.includes('sculpture')) return 'fine-art';
  if (cat.includes('horology') || cat.includes('watch') || cat.includes('chime')) return 'horology';
  if (cat.includes('automotive') || cat.includes('car') || cat.includes('ferrari') || cat.includes('porsche') || cat.includes('hypercars')) return 'hypercars';
  return 'horology';
};

const AuctionsPage = () => {
  useScrollToTop();

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date());
  const [activePage, setActivePage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        setError(null);

        const [activeRes, upcomingRes] = await Promise.all([
          assetService.getAuctions("active"),
          assetService.getAuctions("upcoming")
        ]);

        const allData = [];

        if (activeRes.success && activeRes.data) {
          allData.push(...activeRes.data);
        }

        if (upcomingRes.success && upcomingRes.data) {
          allData.push(...upcomingRes.data);
        }

        if (allData.length > 0) {
          const formatted = allData.map((auc) => {
            const item = auc.itemId || {};
            const lotSerial = `LOT ${auc._id.substring(18).toUpperCase()}`;
            return {
              id: auc._id,
              image: Array.isArray(item.imageUrl) && item.imageUrl.length > 0
                ? item.imageUrl[0]
                : (typeof item.imageUrl === 'string' && item.imageUrl ? item.imageUrl : 'https://picsum.photos/600/400?random=50'),
              lot: lotSerial,
              date: item.year ? `YEAR ${item.year}` : 'UNIQUE',
              title: item.name || 'Untitled Lot',
              subtitle: item.description || 'No description provided.',
              currentBid: `CHF ${(Math.max(auc.currentBid, auc.startPrice) || 0).toLocaleString()}`,
              startTime: auc.startTime,
              endTime: auc.endTime,
              categoryId: getCategoryTabId(item.category || ''),
            };
          });
          setLots(formatted);
        }
      } catch (err) {
        console.error("Failed to load auctions:", err);
        setError("Failed to load auction lots.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { liveLots, upcomingLots } = useMemo(() => {
    const live = [];
    const upcoming = [];
    const rightNow = now;

    lots.forEach((lot) => {
      const start = new Date(lot.startTime);
      const end = new Date(lot.endTime);
      if (start <= rightNow && end > rightNow) {
        live.push(lot);
      } else if (start > rightNow) {
        upcoming.push(lot);
      }
    });

    return { liveLots: live, upcomingLots: upcoming };
  }, [lots, now]);

  const filteredLots = useMemo(() => {
    return liveLots.filter((lot) => {
      const matchesTab = activeTab === "all" || lot.categoryId === activeTab;
      const matchesSearch =
        search.trim() === "" ||
        lot.title.toLowerCase().includes(search.toLowerCase()) ||
        lot.subtitle.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search, liveLots]);

  const filteredUpcomingLots = useMemo(() => {
    return upcomingLots.filter((lot) => {
      const matchesTab = activeTab === "all" || lot.categoryId === activeTab;
      const matchesSearch =
        search.trim() === "" ||
        lot.title.toLowerCase().includes(search.toLowerCase()) ||
        lot.subtitle.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search, upcomingLots]);

  useEffect(() => {
    setActivePage(1);
    setUpcomingPage(1);
  }, [activeTab, search]);

  const featured = filteredLots[0];

  const activeList = useMemo(
    () =>
      filteredLots.slice(1).map((lot) => ({
        ...lot,
        timeLeft: `Ends in ${getTimeLeft(lot.endTime)}`,
      })),
    [filteredLots]
  );

  const activePagination = useMemo(
    () => paginateItems(activeList, activePage, ACTIVE_LOTS_PER_PAGE),
    [activeList, activePage]
  );

  const upcomingList = useMemo(
    () =>
      filteredUpcomingLots.map((lot) => ({
        id: lot.id,
        image: lot.image,
        title: lot.title,
        time: formatUpcomingTime(lot.startTime),
      })),
    [filteredUpcomingLots]
  );

  const upcomingPagination = useMemo(
    () => paginateItems(upcomingList, upcomingPage, UPCOMING_LOTS_PER_PAGE),
    [upcomingList, upcomingPage]
  );

  const featuredTimeLeft = featured
    ? featured.endTime
      ? getTimeLeft(featured.endTime)
      : featured.timeLeft
    : "";

  return (
    <div className="flex flex-col w-full bg-cream text-ink">
      <Navbar activeLink="auctions" />

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

        {loading ? (
          <p className="py-16 text-center text-[13px] text-gray-500 font-medium">
            Loading auction room...
          </p>
        ) : error ? (
          <p className="py-16 text-center text-[13px] text-red-500 font-medium">
            {error}
          </p>
        ) : (
          <>
            {/* Featured Auction */}
            {featured && (
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
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full lg:w-3/6 flex flex-col justify-center">
                  <p className="text-[10px] text-[#8a8a8a] tracking-[0.2em] uppercase font-bold mb-3">
                    {featured.lot} <span className="mx-2">•</span>{" "}
                    {featured.date}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-3">
                    {featured.title}
                  </h2>
                  <p className="text-[13px] font-medium text-gray-500 mb-10">
                    {featured.subtitle}
                  </p>

                  <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-1">
                    Current Bid CHF
                  </p>
                  <div className="flex flex-col gap-2 mb-8">
                    <p className="text-4xl font-black text-black">
                      {featured.currentBid}
                    </p>
                    <div className="flex items-center gap-1.5 text-red-600 text-[12px] font-bold tracking-widest">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredTimeLeft}
                    </div>
                  </div>

                  <Link to={`/auctions/${featured.id}`} className="w-full">
                    <Button fullWidth>ENTER AUCTION ROOM &rarr;</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Active Lots */}
            <div className="mb-24">
              <div className="flex justify-between items-end mb-8 border-b border-[#dcd9ce] pb-4">
                <h2 className="text-2xl font-black tracking-tight text-black">
                  Active Lots
                </h2>
                <span className="text-[11px] tracking-[0.2em] font-bold text-gray-500 uppercase">
                  {filteredLots.length} Lot(s) Available
                </span>
              </div>
              {activeList.length > 0 ? (
                <>
                  <AssetGrid
                    items={activePagination.items}
                    columns={2}
                    renderItem={(lot) => (
                      <Link key={lot.id} to={`/auctions/${lot.id}`} className="block h-full">
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
                      </Link>
                    )}
                  />
                  <Pagination
                    currentPage={activePagination.currentPage}
                    totalPages={activePagination.totalPages}
                    totalItems={activePagination.totalItems}
                    onPageChange={setActivePage}
                  />
                </>
              ) : (
                <p className="py-12 text-center text-[13px] text-gray-500 font-medium">
                  No active lots match your filters.
                </p>
              )}
            </div>

            {/* Upcoming Catalog */}
            <div>
              <div className="mb-8 border-b border-[#dcd9ce] pb-4">
                <h2 className="text-xl font-black tracking-tight text-black">
                  Upcoming Catalog
                </h2>
              </div>
              {upcomingList.length > 0 ? (
                <>
                  <AssetGrid
                    items={upcomingPagination.items}
                    columns={3}
                    className="gap-6 xl:gap-6"
                    renderItem={(item) => {
                      const card = (
                        <AssetCard
                          asset={{
                            ...item,
                            category: "Upcoming",
                            subtitle: item.time,
                            layout: "horizontal",
                            showWishlist: true,
                          }}
                        />
                      );
                      if (item.id && typeof item.id === "string" && item.id !== "featured") {
                        return (
                          <Link key={item.id} to={`/auctions/${item.id}`} className="block h-full">
                            {card}
                          </Link>
                        );
                      }
                      return <div key={item.id}>{card}</div>;
                    }}
                  />
                  <Pagination
                    currentPage={upcomingPagination.currentPage}
                    totalPages={upcomingPagination.totalPages}
                    totalItems={upcomingPagination.totalItems}
                    onPageChange={setUpcomingPage}
                  />
                </>
              ) : (
                <p className="py-12 text-center text-[13px] text-gray-500 font-medium">
                  No upcoming lots match your filters.
                </p>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AuctionsPage;
