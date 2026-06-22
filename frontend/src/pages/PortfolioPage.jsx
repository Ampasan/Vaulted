import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import Toggle from "../components/ui/Toggle";
import PortfolioChart from "../components/features/portfolio/PortfolioChart";
import AllocationChart from "../components/features/portfolio/AllocationChart";
import AssetCard from "../components/features/asset/AssetCard";
import HeldAssetRow from "../components/features/portfolio/HeldAssetRow";
import assetService from "../services/assetService";
import useScrollToTop from "../hooks/useScrollToTop";

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/[^0-9.]/g, ""));
};

const parseGain = (gainStr) => {
  if (!gainStr) return 0;
  return parseFloat(gainStr.replace(/[^0-9.-]/g, ""));
};

const PortfolioPage = () => {
  useScrollToTop();

  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("value");
  const [items, setItems] = useState([]);
  const [rawItems, setRawItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await assetService.getMyCollection();
        if (res.success && res.data) {
          const formatted = res.data.map((item) => {
            const nameParts = (item.name || "").split(" ");
            const maker = nameParts[0] || "Unknown";
            const titleOnly = nameParts.slice(1).join(" ") || item.name || "Untitled";

            const acqCost = item.priceHistory && item.priceHistory.length > 0
              ? item.priceHistory[0].price
              : item.currentPrice || 0;

            const currentPrice = item.currentPrice || 0;
            const gainVal = acqCost > 0 ? ((currentPrice - acqCost) / acqCost) * 100 : 0;
            const gainStr = `${gainVal >= 0 ? "+" : ""}${gainVal.toFixed(1)}%`;

            let status = "in-storage";
            let listStatus = "VAULT SECURED";
            let listStatusTone = "secured";

            if (item.status === "listed_marketplace") {
              status = "under-contract";
              listStatus = "LISTED FOR SALE";
              listStatusTone = "sale";
            } else if (item.status === "in_auction") {
              status = "in-storage";
              listStatus = "IN AUCTION";
              listStatusTone = "auction";
            } else if (item.status === "sold") {
              status = "sold";
              listStatus = "SOLD";
              listStatusTone = "sold";
            }

            return {
              id: item._id,
              image: Array.isArray(item.imageUrl) && item.imageUrl.length > 0
                ? item.imageUrl[0]
                : item.imageUrl,
              title: titleOnly,
              category: maker.toUpperCase(),
              price: `CHF ${currentPrice.toLocaleString()}`,
              acquisitionCost: `CHF ${acqCost.toLocaleString()}`,
              priceLabel: "CURRENT VALUE",
              gain: gainStr,
              location: "Geneva Freeport Alpha",
              status,
              listStatus,
              listStatusTone,
              date: item.createdAt,
            };
          });
          setItems(formatted);
          setRawItems(res.data);
        }
      } catch (err) {
        console.error("Failed to load collection:", err);
        setError("Failed to load collection items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  const sortedAssets = useMemo(() => {
    const list = items;
    return [...list].sort((a, b) => {
      if (sortBy === "value") {
        return parsePrice(b.price) - parsePrice(a.price);
      } else if (sortBy === "gain") {
        return parseGain(b.gain) - parseGain(a.gain);
      } else if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
  }, [sortBy, items]);

  const summary = useMemo(() => {
    const list = items.length > 0 ? items : [];
    
    const totalValue = list.reduce((sum, item) => {
      return sum + parsePrice(item.price);
    }, 0);

    const totalAcqCost = list.reduce((sum, item) => {
      return sum + parsePrice(item.acquisitionCost);
    }, 0);

    const gainAmount = totalValue - totalAcqCost;
    const gainPercent = totalAcqCost > 0 ? (gainAmount / totalAcqCost) * 100 : 0;
    const activeBids = list.filter(item => item.listStatus === "IN AUCTION").length;

    const formatM = (val) => {
      if (val >= 1000000) return `CHF ${(val / 1000000).toFixed(2)}M`;
      return `CHF ${val.toLocaleString()}`;
    };

    return {
      totalValue: formatM(totalValue),
      totalAcqCost: formatM(totalAcqCost),
      gainAmount: `${gainAmount >= 0 ? "+" : "-"}CHF ${Math.abs(gainAmount).toLocaleString()}`,
      gainPercent: `${gainPercent >= 0 ? "+" : ""}${gainPercent.toFixed(1)}%`,
      activeBids: activeBids.toString().padStart(2, "0"),
      count: list.length,
    };
  }, [items]);

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink">
      <Navbar activeLink="portfolio" />

      <main className="flex-1 max-w-360 w-full mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-flex items-center text-[11px] tracking-[0.2em] font-bold text-gray-400 uppercase mb-8">
            VAULTED <span className="mx-2 text-gray-300">-</span> COLLECTION PORTFOLIO
          </span>

          <div className="flex justify-between items-end">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              My Portfolio
            </h1>
            <Button variant="primary" size="md" className="gap-2" onClick={() => navigate("/asset")}>
              MAKE A ASSET{" "}
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-[#dcd9ce] mb-8 bg-transparent">
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#dcd9ce]">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">
              TOTAL VAULT VALUE
            </p>
            <p className="text-2xl font-mono text-black font-bold mb-1">
              {items.length > 0 ? summary.totalValue : "CHF 0"}
            </p>
            <p className="text-[13px] text-gray-400 font-mono">
              {items.length > 0 ? `${summary.count} assets` : "0 assets"}
            </p>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#dcd9ce]">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">
              UNREALIZED GAIN
            </p>
            <p className={`text-2xl font-mono font-bold mb-1 ${items.length > 0 && summary.gainAmount.startsWith("-") ? "text-red-600" : "text-green-600"}`}>
              {items.length > 0 ? summary.gainAmount : "+CHF 0"}
            </p>
            <p className="text-[13px] text-gray-400 font-mono">
              {items.length > 0 ? `${summary.gainPercent} since acquisition` : "+0.0% since acquisition"}
            </p>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#dcd9ce]">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">
              ACQUISITION COST
            </p>
            <p className="text-2xl font-mono text-black font-bold mb-1">
              {items.length > 0 ? summary.totalAcqCost : "CHF 0"}
            </p>
            <p className="text-[13px] text-gray-400 font-mono">
              Total deployed capital
            </p>
          </div>
          <div className="p-6">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">
              ACTIVE BIDS
            </p>
            <p className="text-2xl font-mono text-black font-bold mb-1">
              {items.length > 0 ? summary.activeBids : "00"}
            </p>
            <p className="text-[13px] text-gray-400 font-mono">
              Live auction rooms
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24 h-auto">
          <div className="lg:col-span-2 h-80">
            <PortfolioChart items={rawItems} />
          </div>
          <div className="lg:col-span-1 h-80">
            <AllocationChart items={rawItems} />
          </div>
        </div>

        {/* Held Assets Section */}
        <div>
          <div className="flex justify-between items-end border-b border-[#dcd9ce] pb-4 mb-6">
            <h2 className="text-2xl font-black font-serif tracking-tight">
              Held Assets
            </h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-400 uppercase tracking-[0.2em] font-bold">
                  SORT:
                </span>
                <span
                  onClick={() => setSortBy("value")}
                  className={`text-[11px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${sortBy === "value" ? "text-black border-b border-black" : "text-gray-400 hover:text-black"}`}
                >
                  VALUE
                </span>
                <span
                  onClick={() => setSortBy("gain")}
                  className={`text-[11px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${sortBy === "gain" ? "text-black border-b border-black" : "text-gray-400 hover:text-black"}`}
                >
                  GAIN
                </span>
                <span
                  onClick={() => setSortBy("date")}
                  className={`text-[11px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${sortBy === "date" ? "text-black border-b border-black" : "text-gray-400 hover:text-black"}`}
                >
                  DATE
                </span>
              </div>
              <Toggle
                mode="icons"
                value={viewMode}
                onValueChange={setViewMode}
              />
            </div>
          </div>

          {loading ? (
            <p className="py-16 text-center text-[13px] text-gray-500 font-medium">
              Loading portfolio assets...
            </p>
          ) : error ? (
            <p className="py-16 text-center text-[13px] text-red-500 font-medium">
              {error}
            </p>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={{ ...asset, aspect: "landscape", framed: false }}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-240">
                <div className="grid grid-cols-[minmax(360px,2.4fr)_1fr_1fr_1fr_1fr] items-center border-b border-[#dcd9ce] pb-4 text-[13px] text-gray-500 uppercase tracking-[0.28em] font-mono">
                  <span>Asset</span>
                  <span className="text-center">Acq. Cost</span>
                  <span className="text-center">Current Value</span>
                  <span className="text-center">Gain / Loss</span>
                  <span className="text-right">Status</span>
                </div>
                {sortedAssets.map((asset) => (
                  <HeldAssetRow key={asset.id} asset={asset} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortfolioPage;
