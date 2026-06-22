import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Gavel, PackageCheck, Store, XCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PriceHistoryChart from "../components/features/marketplace/PriceHistoryChart";
import assetService from "../services/assetService";
import useAuth from "../hooks/useAuth";
import useScrollToTop from "../hooks/useScrollToTop";

const formatCurrency = (value) => `CHF ${Number(value || 0).toLocaleString()}`;

const getStatusMeta = (status) => {
  if (status === "listed_marketplace") {
    return {
      label: "Listed Marketplace",
      tone: "text-[#0f67ad]",
      description: "Available for immediate acquisition in the marketplace.",
    };
  }
  if (status === "in_auction") {
    return {
      label: "In Auction",
      tone: "text-[#b76b00]",
      description: "Committed to auction. This action cannot be recalled.",
    };
  }
  if (status === "sold") {
    return {
      label: "Sold",
      tone: "text-gray-500",
      description: "Transferred out of your active vault holdings.",
    };
  }
  return {
    label: "Vault Secured",
    tone: "text-[#087a3f]",
    description: "Held privately in your collection.",
  };
};

const getImages = (item) => {
  if (Array.isArray(item?.imageUrl) && item.imageUrl.length > 0) return item.imageUrl;
  if (typeof item?.imageUrl === "string" && item.imageUrl) return [item.imageUrl];
  return ["https://picsum.photos/900/900?random=21"];
};

const PortfolioAssetDetailPage = () => {
  useScrollToTop();

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [marketPrice, setMarketPrice] = useState("");
  const [auctionPrice, setAuctionPrice] = useState("");
  const [auctionDays, setAuctionDays] = useState("7");
  const [bidIncrement, setBidIncrement] = useState("1000");

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await assetService.getItemById(id);
      if (res.success && res.data) {
        setItem(res.data);
        setMarketPrice(String(res.data.currentPrice || ""));
        setAuctionPrice(String(res.data.currentPrice || ""));
      } else {
        setError("Asset not found.");
      }
    } catch (err) {
      console.error("Failed to load owned asset:", err);
      setError(err.response?.data?.message || "Failed to load asset.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  const images = useMemo(() => getImages(item), [item]);
  const selectedImage = images[selectedImageIndex] || images[0];
  const statusMeta = getStatusMeta(item?.status);
  const isOwner = item?.ownerId?._id === user?.id || item?.ownerId?._id === user?._id || item?.ownerId === user?.id;
  const canList = item?.status === "owned";
  const canUnlist = item?.status === "listed_marketplace";
  const canAuction = item?.status === "owned";
  const isAuctionLocked = item?.status === "in_auction";
  const vaultSerial = `GP-${item?._id?.substring(18).toUpperCase() || "ASSET"}`;

  const handleListMarketplace = async () => {
    const price = Number(marketPrice);
    if (!price || price < 0) {
      setError("Enter a valid marketplace price.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const res = await assetService.listItemOnMarketplace(id, price);
      setItem(res.data);
      setMessage("Asset listed on marketplace.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to list asset.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMarketplace = async () => {
    try {
      setSaving(true);
      setError(null);
      const res = await assetService.removeItemFromMarketplace(id);
      setItem(res.data);
      setMessage("Asset removed from marketplace.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove marketplace listing.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAuction = async () => {
    const startPrice = Number(auctionPrice);
    const durationDays = Number(auctionDays);
    const increment = Number(bidIncrement);

    if (!startPrice || startPrice < 0 || !durationDays || durationDays < 1) {
      setError("Enter valid auction terms before committing.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const endTime = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
      const res = await assetService.createAuction({
        itemId: id,
        startPrice,
        endTime,
        bidIncrement: increment || undefined,
      });
      setItem(res.data.itemId || { ...item, status: "in_auction" });
      setMessage("Asset committed to auction.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create auction.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-cream text-ink">
        <Navbar activeLink="portfolio" />
        <main className="flex-1 flex items-center justify-center p-16">
          <p className="text-[13px] text-gray-500 font-mono uppercase tracking-wider">Loading asset controls...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="flex flex-col min-h-screen bg-cream text-ink">
        <Navbar activeLink="portfolio" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-16">
          <p className="text-red-500 font-mono tracking-wider uppercase">{error}</p>
          <Button variant="outline" onClick={() => navigate("/portfolio")}>Back to Portfolio</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink">
      <Navbar activeLink="portfolio" />

      <main className="flex-1 w-full max-w-360 mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] font-bold text-gray-500 hover:text-black uppercase mb-8 lg:mb-12 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> PORTFOLIO
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="flex flex-col">
            <div className="relative aspect-square md:aspect-4/3 lg:aspect-square bg-[#e0dfd9] w-full mb-4 overflow-hidden">
              <Badge variant="dark" className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px]">
                OWNED ASSET
              </Badge>
              <img src={selectedImage} alt={item.name} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-4 gap-4 mb-12">
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square bg-[#e0dfd9] overflow-hidden ${selectedImageIndex === idx ? "border-2 border-black" : "opacity-70 hover:opacity-100 transition-opacity"}`}
                  aria-label={`Show image ${idx + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-0 border border-[#dcd9ce] mb-8">
              <div className="p-4 border-r border-[#dcd9ce]">
                <p className="text-[11px] text-gray-400 tracking-[0.2em] font-bold uppercase mb-2">Status</p>
                <p className={`text-[13px] font-mono font-bold uppercase ${statusMeta.tone}`}>{statusMeta.label}</p>
              </div>
              <div className="p-4">
                <p className="text-[11px] text-gray-400 tracking-[0.2em] font-bold uppercase mb-2">Vault Serial</p>
                <p className="text-[13px] font-mono text-gray-600">{vaultSerial}</p>
              </div>
            </div>

            <div className="border border-[#dcd9ce] p-6">
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-2">Price History</p>
              <PriceHistoryChart history={item.priceHistory || []} initialPrice={item.currentPrice} />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-10">
              <p className="text-[12px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-3">
                {item.category || "COLLECTION"} {item.year ? <span className="mx-2">- YEAR {item.year}</span> : null}
              </p>
              <h1 className="text-4xl md:text-5xl font-black font-serif tracking-tight leading-none mb-4">
                {item.name}
              </h1>
              <p className="text-[14px] font-medium text-gray-500 mb-6">
                {item.description || "No description provided."}
              </p>
              <Badge variant="outline" className="text-[10px] tracking-[0.15em] uppercase">
                {statusMeta.description}
              </Badge>
            </div>

            {!isOwner && (
              <div className="border border-red-200 bg-red-50 px-4 py-3 mb-6 text-[11px] font-mono text-red-700 tracking-wide">
                This asset is not owned by the signed-in account.
              </div>
            )}

            {message && (
              <div className="border border-[#bdd6c5] bg-[#eef8f1] px-4 py-3 mb-6 text-[11px] font-mono text-[#256037] tracking-wide">
                {message}
              </div>
            )}

            {error && (
              <div className="border border-red-200 bg-red-50 px-4 py-3 mb-6 text-[11px] font-mono text-red-700 tracking-wide">
                {error}
              </div>
            )}

            <div className="border border-[#dcd9ce] p-6 md:p-8 mb-8 bg-transparent">
              <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-2">Current Valuation</p>
              <p className="text-4xl font-mono font-bold text-black tracking-tight mb-8">
                {formatCurrency(item.currentPrice)}
              </p>

              <div className="border-t border-[#dcd9ce] pt-8">
                <div className="flex items-center gap-2 mb-5">
                  <Store className="w-4 h-4 text-gray-400" />
                  <h2 className="text-[12px] text-black tracking-[0.2em] uppercase font-bold">Marketplace Control</h2>
                </div>
                <Input
                  label="Marketplace price (CHF)"
                  type="number"
                  value={marketPrice}
                  onChange={(e) => setMarketPrice(e.target.value)}
                  disabled={!canList}
                />
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button fullWidth onClick={handleListMarketplace} disabled={!canList || saving || !isOwner}>
                    <PackageCheck className="w-4 h-4" /> Add to Marketplace
                  </Button>
                  <Button fullWidth variant="outline" onClick={handleRemoveMarketplace} disabled={!canUnlist || saving || !isOwner}>
                    <XCircle className="w-4 h-4" /> Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className="border border-[#dcd9ce] p-6 md:p-8 bg-cream-light">
              <div className="flex items-center gap-2 mb-5">
                <Gavel className="w-4 h-4 text-gray-400" />
                <h2 className="text-[12px] text-black tracking-[0.2em] uppercase font-bold">Auction Commitment</h2>
              </div>

              {isAuctionLocked ? (
                <div className="border border-[#e1c89d] bg-[#fff8eb] p-4 text-[12px] font-mono text-[#8a5a00] tracking-wide">
                  This asset is already committed to auction and cannot be recalled.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Input label="Opening bid" type="number" value={auctionPrice} onChange={(e) => setAuctionPrice(e.target.value)} />
                    <Input label="Duration days" type="number" value={auctionDays} onChange={(e) => setAuctionDays(e.target.value)} />
                    <Input label="Bid increment" type="number" value={bidIncrement} onChange={(e) => setBidIncrement(e.target.value)} />
                  </div>
                  <p className="text-[11px] text-gray-500 font-mono leading-relaxed mt-5 mb-6">
                    Once submitted, this item moves to auction status and cannot be returned to marketplace or private vault controls.
                  </p>
                  <Button fullWidth onClick={handleCreateAuction} disabled={!canAuction || saving || !isOwner}>
                    <Gavel className="w-4 h-4" /> Add to Auction
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortfolioAssetDetailPage;
