import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  Heart,
  ChevronDown,
  X,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Toggle from "../../components/ui/Toggle";
import Input from "../../components/ui/Input";
import Countdown from "../../components/ui/Countdown";
import StatusDot from "../../components/ui/StatusDot";
import PriceHistoryChart from "../../components/features/marketplace/PriceHistoryChart";
import useAuth from "../../hooks/useAuth";
import assetService from "../../services/assetService";
import wishlistService from "../../services/wishlistService";
import { getEffectiveBuyerTier, formatBuyerTierLabel, checkBuyerTierAccess } from "../../utils/tierUtils";
import useScrollToTop from "../../hooks/useScrollToTop";

const AuctionDetailPage = () => {
  useScrollToTop();

  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState(null);
  const [bidSuccess, setBidSuccess] = useState(false);

  const [autoBid, setAutoBid] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageFull, setIsImageFull] = useState(false);
  const [isBidHistoryOpen, setIsBidHistoryOpen] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const fetchAuction = async () => {
    try {
      const res = await assetService.getAuctionById(id);
      if (res.success && res.data) {
        setAuction(res.data);
      } else {
        throw new Error(res.message || "Failed to fetch auction details");
      }
    } catch (err) {
      console.error("Error loading auction:", err);
      setError(err.message || "Error loading auction.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAuction();
    }
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) {
      const checkWishlist = async () => {
        try {
          const res = await wishlistService.getWishlist();
          if (res.success && res.data) {
            const inWishlist = res.data.some(w => {
              const currentId = w.itemId?._id || w.itemId;
              return currentId === auction?.itemId?._id;
            });
            setIsWishlisted(inWishlist);
          }
        } catch (err) {
          console.error("Failed to check wishlist status", err);
        }
      };
      if (auction?.itemId) {
        checkWishlist();
      }
    }
  }, [auction?.itemId, isAuthenticated]);

  const handleCountdownComplete = () => {
    fetchAuction();
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidError(null);
    setBidSuccess(false);

    if (!isAuthenticated) {
      navigate("/auth", { state: { from: `/auctions/${id}` } });
      return;
    }

    if (!tierAccess.allowed) {
      setBidError(tierAccess.message);
      return;
    }

    const amount = Number(bidAmount);
    if (!amount || isNaN(amount)) {
      setBidError("Please enter a valid bid amount.");
      return;
    }

    const currentHighPrice = Math.max(auction?.currentBid || 0, auction?.startPrice || 0);
    if (amount <= currentHighPrice) {
      setBidError(`Bid must be greater than CHF ${currentHighPrice.toLocaleString()}`);
      return;
    }

    try {
      const res = await assetService.placeBid(id, amount);
      if (res.success) {
        setBidSuccess(true);
        setBidAmount("");
        fetchAuction();
      } else {
        setBidError(res.message || "Failed to place bid");
      }
    } catch (err) {
      console.error(err);
      setBidError(err.response?.data?.message || "Failed to place bid.");
    }
  };

  const item = useMemo(() => auction?.itemId || {}, [auction]);
  const images = useMemo(() => {
    if (Array.isArray(item.imageUrl) && item.imageUrl.length > 0) {
      return item.imageUrl;
    }
    if (typeof item.imageUrl === "string" && item.imageUrl) {
      return [item.imageUrl];
    }
    return [];
  }, [item]);

  const selectedImage = images[selectedImageIndex] ?? images[0];

  const requiredTierLabel = useMemo(
    () => formatBuyerTierLabel(getEffectiveBuyerTier(item)),
    [item]
  );

  const tierAccess = useMemo(() => {
    if (!item || Object.keys(item).length === 0) return { allowed: true };
    if (!isAuthenticated) return { allowed: true };
    return checkBuyerTierAccess(user?.tier, item);
  }, [item, user?.tier, isAuthenticated]);

  const nameParts = useMemo(() => (item.name || "").split(" "), [item]);
  const maker = nameParts[0] || "";
  const titleOnly = nameParts.slice(1).join(" ") || item.name || "Untitled";

  const lotSerial = useMemo(() => `LOT ${id?.substring(18).toUpperCase() || "LOT"}`, [id]);
  const vaultSerial = useMemo(() => `GP-${item._id?.substring(18).toUpperCase() || "GP"}`, [item]);

  const totalBids = useMemo(() => auction?.bids?.length || 0, [auction]);
  const biddersCount = useMemo(() => {
    if (!auction?.bids) return 0;
    return new Set(auction.bids.map((b) => b.userId?._id || b.userId)).size;
  }, [auction]);

  const sortedBids = useMemo(() => {
    if (!auction?.bids) return [];
    return [...auction.bids].sort((a, b) => b.amount - a.amount);
  }, [auction]);

  const isUpcoming = useMemo(() => {
    if (!auction?.startTime) return false;
    return new Date(auction.startTime) > new Date();
  }, [auction]);

  const initialSeconds = useMemo(() => {
    if (!auction) return 0;
    const targetDate = isUpcoming ? new Date(auction.startTime) : new Date(auction.endTime);
    const diff = Math.floor((targetDate - new Date()) / 1000);
    return Math.max(0, diff);
  }, [auction, isUpcoming]);

  const isLive = useMemo(() => {
    return auction?.status === "active" && !isUpcoming && initialSeconds > 0;
  }, [auction, isUpcoming, initialSeconds]);

  const currentUserId = user?.id || user?._id;
  const isLeadingBidder = useMemo(() => {
    if (!auction?.highestBidderId || !currentUserId) return false;
    const leadId = typeof auction.highestBidderId === "object"
      ? auction.highestBidderId._id || auction.highestBidderId.id
      : auction.highestBidderId;
    return leadId === currentUserId;
  }, [auction, currentUserId]);

  const hasPlacedAnyBid = useMemo(() => {
    if (!auction?.bids || !currentUserId) return false;
    return auction.bids.some(b => {
      const bidUserId = typeof b.userId === "object" ? b.userId._id || b.userId.id : b.userId;
      return bidUserId === currentUserId;
    });
  }, [auction, currentUserId]);

  const auctionStatus = useMemo(() => {
    if (isUpcoming) return "upcoming";
    if (isLive) return "live";
    if (hasPlacedAnyBid && isLeadingBidder) return "won";
    return "lost";
  }, [isUpcoming, isLive, hasPlacedAnyBid, isLeadingBidder]);

  const handleGoToSettlement = () => {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: `/auctions/${id}` } });
      return;
    }

    if (!tierAccess.allowed) {
      return;
    }

    const finalAmount = Math.max(auction?.currentBid || 0, auction?.startPrice || 0);
    const firstImage = images[0];

    navigate("/settlement", {
      state: {
        asset: {
          image: firstImage,
          title: item.name || "Untitled Lot",
          currency: "CHF",
          amount: finalAmount,
          id: item._id,
        },
        returnTo: `/auctions/${id}`,
      },
    });
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: `/auctions/${id}` } });
      return;
    }

    const targetItemId = auction?.itemId?._id;
    if (!targetItemId) return;

    try {
      setWishlistLoading(true);
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(targetItemId);
        setIsWishlisted(false);
      } else {
        await wishlistService.addToWishlist(targetItemId);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const provenance = useMemo(() => {
    return [
      { period: "Present", desc: `Secured in Vault. Custody managed under certificate ${vaultSerial}.` },
      { period: "Listed", desc: `Listed for public auction on Vaulted Platform by authorized owner.` }
    ];
  }, [vaultSerial]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-cream text-ink">
        <Navbar activeLink="auctions" />
        <main className="flex-1 flex items-center justify-center p-16">
          <p className="text-[13px] text-gray-500 font-mono uppercase tracking-wider">Loading auction details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="flex flex-col min-h-screen bg-cream text-ink">
        <Navbar activeLink="auctions" />
        <main className="flex-1 flex flex-col items-center justify-center p-16">
          <p className="text-[13px] text-red-500 font-mono uppercase tracking-wider mb-6">{error || "Auction not found"}</p>
          <Link to="/auctions" className="text-[11px] font-bold tracking-[0.2em] uppercase hover:underline">
            &larr; Back to Auctions
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink">
      <Navbar activeLink="auctions" />

      <main className="flex-1 w-full max-w-360 mx-auto px-6 lg:px-12 py-8 lg:py-12">
        {/* Breadcrumb */}
        <Link
          to="/auctions"
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] font-bold text-gray-500 hover:text-black uppercase mb-8 lg:mb-12 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO AUCTIONS
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column */}
          <div className="flex flex-col">
            {/* Main Image */}
            <div className="relative aspect-square md:aspect-4/3 lg:aspect-square bg-[#e0dfd9] w-full mb-4 group overflow-hidden">
              <Badge
                variant="dark"
                className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px]"
              >
                AUTHENTICATED
              </Badge>
              {isUpcoming ? (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-gray-500 text-white text-[9px] font-bold px-2 py-1 tracking-widest uppercase">
                  UPCOMING
                </div>
              ) : isLive ? (
                <StatusDot
                  status="live"
                  size="sm"
                  className="absolute top-4 right-4 z-10"
                />
              ) : null}
              <img
                src={selectedImage}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => setIsImageFull(true)}
                className="absolute bottom-4 right-4 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center rounded-full transition-colors z-20 cursor-pointer"
                aria-label="Open full image"
              >
                <svg
                  className="w-3.5 h-3.5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square bg-[#e0dfd9] overflow-hidden cursor-pointer ${selectedImageIndex === idx ? "border-2 border-black" : "opacity-70 hover:opacity-100 transition-opacity"}`}
                  aria-label={`Show image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 border border-[#dcd9ce] mb-8 divide-x divide-[#dcd9ce] text-center">
              <div className="p-4">
                <p className="text-[10px] text-gray-400 tracking-[0.2em] font-bold uppercase mb-2">
                  TOTAL BIDS
                </p>
                <p className="text-[15px] font-mono font-bold text-black">
                  {totalBids}
                </p>
              </div>
              <div className="p-4">
                <p className="text-[10px] text-gray-400 tracking-[0.2em] font-bold uppercase mb-2">
                  BIDDERS
                </p>
                <p className="text-[15px] font-mono font-bold text-black flex items-center justify-center gap-1.5">
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  {biddersCount}
                </p>
              </div>
              <div className="p-4">
                <p className="text-[10px] text-gray-400 tracking-[0.2em] font-bold uppercase mb-2">
                  RESERVE
                </p>
                <p className="text-[14px] font-mono font-bold text-[#3b8754] flex items-center justify-center gap-1">
                  MET{" "}
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
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </p>
              </div>
            </div>

            {/* Price History */}
            <div className="border border-[#dcd9ce] p-6 mb-8 flex flex-col">
              <p className="text-[10px] text-gray-400 tracking-[0.2em] font-bold uppercase flex items-center gap-2">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  ></path>
                </svg>
                PRICE HISTORY
              </p>
              <PriceHistoryChart history={item.priceHistory || []} initialPrice={item.currentPrice} />
            </div>

            {/* Provenance */}
            <div className="border border-[#dcd9ce] p-6 md:p-8 bg-cream-light mb-8">
              <h3 className="text-lg font-black font-serif tracking-tight mb-6">
                Provenance
              </h3>
              <div className="flex flex-col gap-5">
                {provenance.map((prov, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-[12px] font-mono text-gray-400 mb-1">
                        {prov.period}
                      </p>
                      <p className="text-[13px] font-medium text-black">
                        {prov.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            {/* Headers */}
            <div className="mb-8">
              <p className="text-[12px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-3">
                {lotSerial} {item.year ? <><span className="mx-2">•</span> YEAR {item.year}</> : null}
              </p>
              <h1 className="text-4xl md:text-5xl font-black font-serif tracking-tight leading-none mb-4">
                <span className="text-[#888888] font-normal mr-2 block uppercase">{maker}</span>
                {titleOnly}
              </h1>
              <p className="text-[15px] font-medium text-gray-500 mb-6">
                {item.description || "No description provided."}
              </p>
              {requiredTierLabel && (
                <div className="mb-6">
                  <Badge variant="outline" className="text-[10px] tracking-[0.15em] uppercase">
                    Requires {requiredTierLabel}
                  </Badge>
                </div>
              )}
            </div>

            {/* Time Remaining / Commencing */}
            <div className="border border-[#dcd9ce] p-6 mb-8 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-2">
                  {isUpcoming ? "AUCTION COMMENCES IN" : "TIME REMAINING"}
                </p>
                {isUpcoming || isLive ? (
                  <Countdown
                    key={initialSeconds}
                    initialSeconds={initialSeconds}
                    onComplete={handleCountdownComplete}
                  />
                ) : (
                  <div className="text-3xl font-mono font-bold tracking-tight text-gray-300">
                    00 : 00 : 00
                  </div>
                )}
              </div>
              <div className="text-[13px] text-gray-400 tracking-[0.15em] uppercase font-bold flex items-center gap-1 text-right">
                <Clock className="w-3 h-3" /> {new Date(isUpcoming ? auction.startTime : auction.endTime).toLocaleString('en-GB')}
              </div>
            </div>

            {/* High Bid / Starting Bid */}
            <div className="mb-8">
              <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-2">
                {isUpcoming ? "STARTING BID" : "CURRENT HIGH BID"}
              </p>
              <p className="text-3xl md:text-4xl font-mono font-bold text-black tracking-tight mb-2">
                CHF {Math.max(auction.currentBid || 0, auction.startPrice || 0).toLocaleString()}
              </p>
              {!isUpcoming && (
                <p className="text-[13px] font-mono text-gray-400">
                  Starting bid: CHF {auction.startPrice.toLocaleString()}
                </p>
              )}
            </div>

            {/* Logic Panels */}
            {isUpcoming && (
              <div className="border border-[#dcd9ce] p-6 mb-6 bg-cream-light text-center">
                <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-2">
                  AUCTION NOT STARTED
                </p>
                <p className="text-sm font-medium text-gray-600">
                  Bidding has not commenced for this lot yet. The auction will start on{" "}
                  <strong>{new Date(auction.startTime).toLocaleString('en-GB')}</strong>.
                </p>
              </div>
            )}
            {isLive && (
              <>
                {!tierAccess.allowed && (
                  <div className="border border-amber-200 bg-amber-50 px-4 py-3 mb-6 text-[11px] font-mono text-amber-900 tracking-wide">
                    {tierAccess.message}
                    {!user?.identityVerified && (
                      <Link to="/profile" className="block mt-2 font-bold uppercase underline">
                        Complete verification in Profile &rarr;
                      </Link>
                    )}
                  </div>
                )}
                <form onSubmit={handlePlaceBid} className="border border-[#dcd9ce] p-6 mb-6">
                  {tierAccess.allowed && bidError && (
                    <div className="mb-4 text-xs font-mono text-red-600 uppercase tracking-wide">
                      Error: {bidError}
                    </div>
                  )}
                  {bidSuccess && (
                    <div className="mb-4 text-xs font-mono text-green-600 uppercase tracking-wide">
                      Success: Bid placed successfully!
                    </div>
                  )}

                  <div className="flex flex-col mb-8">
                    <p className="text-[9px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-4">
                      PLACE BID
                    </p>
                    <div className="flex items-center">
                      <span className="text-[14px] font-mono text-gray-400 mr-4">
                        CHF
                      </span>
                      <Input
                        placeholder={(Math.max(auction.currentBid || 0, auction.startPrice || 0) + auction.bidIncrement).toString()}
                        className="flex-1"
                        inputClassName={`text-xl ${!tierAccess.allowed ? 'opacity-50 pointer-events-none' : ''}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={!tierAccess.allowed}
                        className="bg-[#3b8754] hover:bg-[#327347] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[10px] font-bold tracking-widest uppercase px-4 py-3 ml-4 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        PLACE BID
                      </button>
                    </div>
                  </div>
                  <div className={`border-t border-[#dcd9ce] pt-6 flex flex-col gap-4 ${!tierAccess.allowed ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase font-bold">
                        AUTO-BID
                      </p>
                      <Toggle
                        mode="switch"
                        checked={autoBid}
                        onChange={(e) => setAutoBid(e.target.checked)}
                      />
                    </div>
                    {autoBid && (
                      <div>
                        <p className="text-[9px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-2">
                          MAXIMUM AUTO-BID (CHF)
                        </p>
                        <Input placeholder="Enter maximum bid ceiling..." />
                      </div>
                    )}
                  </div>
                </form>

                {isLeadingBidder && (
                  <div className="bg-[#eef8f1] border border-[#b2ddbe] p-6 mb-8 text-[#256037] flex flex-col items-center justify-center text-center">
                    <p className="text-[11px] font-bold tracking-[0.15em] uppercase flex items-center gap-2 mb-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      LEADING BIDDER
                    </p>
                    <p className="text-[12px] font-medium opacity-80">
                      You are currently the leading bidder for this lot.
                    </p>
                  </div>
                )}
              </>
            )}

            {auctionStatus === "won" && (
              <div className="bg-[#eef8f1] border border-[#b2ddbe] p-8 mb-8 text-[#256037] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-[#256037] text-white rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2">
                  AUCTION WON
                </h3>
                <p className="text-[13px] opacity-80 mb-8 max-w-sm">
                  Congratulations! You have successfully acquired this lot.
                  Please proceed to settlement to finalize the transaction.
                </p>
                <Button
                  fullWidth
                  variant="primary"
                  size="lg"
                  className="w-full py-4 text-[11px] bg-[#256037] hover:bg-[#1a4326] border-[#256037]"
                  onClick={handleGoToSettlement}
                  disabled={!tierAccess.allowed}
                >
                  PROCEED TO SETTLEMENT &rarr;
                </Button>
              </div>
            )}

            {auctionStatus === "lost" && !isLive && (
              <div className="bg-[#fcf0f0] border border-[#eabebf] p-8 mb-8 text-[#8c2a2a] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-2 border-[#8c2a2a] rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2">
                  AUCTION ENDED — NOT WON
                </h3>
                <p className="text-[13px] opacity-80 mb-8 max-w-sm">
                  This lot has been acquired by another bidder. Explore our
                  other active lots to find your next piece.
                </p>
                <Link to="/auctions" className="w-full">
                  <Button
                    fullWidth
                    variant="outline"
                    size="lg"
                    className="py-4 text-[11px] border-[#8c2a2a] text-[#8c2a2a] hover:bg-[#8c2a2a] hover:text-white"
                  >
                    VIEW OTHER LOTS &rarr;
                  </Button>
                </Link>
              </div>
            )}

            {/* General Actions */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex gap-3">
                <Button
                  fullWidth
                  variant="outline"
                  size="lg"
                  className={`py-4 text-[11px] gap-2 border-[#dcd9ce] w-1/2 ${isWishlisted ? 'bg-black text-white hover:bg-gray-800' : 'hover:border-black'}`}
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-white' : ''}`} /> {isWishlisted ? 'WISHLISTED' : 'WISHLIST'}
                </Button>
                <div className="w-1/2 py-4 flex items-center justify-center gap-2 text-[11px] text-gray-500 tracking-[0.2em] uppercase font-bold select-none">
                  <ShieldCheck className="w-4 h-4 text-gray-400" /> VAULT
                  SECURED
                </div>
              </div>
            </div>

            {/* Bid History */}
            <div className="border border-[#dcd9ce]">
              <button
                type="button"
                onClick={() => setIsBidHistoryOpen(!isBidHistoryOpen)}
                className="w-full p-5 flex items-center justify-between cursor-pointer hover:bg-cream-light transition-colors"
              >
                <p className="text-[11px] text-gray-600 tracking-[0.2em] uppercase font-bold">
                  BID HISTORY ({totalBids})
                </p>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isBidHistoryOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isBidHistoryOpen && (
                <div className="border-t border-[#dcd9ce] max-h-80 overflow-y-auto">
                  {sortedBids.length > 0 ? (
                    sortedBids.map((bid, idx) => {
                      const bidderIdStr = typeof bid.userId === "object" ? bid.userId._id || bid.userId.id : bid.userId;
                      const displayId = bidderIdStr ? `#VLT-${bidderIdStr.substring(18).toUpperCase()}` : '#VLT-ANON';
                      const isLeadingBid = idx === 0 && isLive;
                      
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-5 ${idx !== sortedBids.length - 1 ? "border-b border-[#dcd9ce]" : ""}`}
                        >
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-mono text-black">
                              Bidder {displayId}
                            </p>
                            {isLeadingBid && (
                              <span className="bg-black text-white text-[8px] font-bold px-2 py-0.5 tracking-widest uppercase">
                                LEADING
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-[14px] font-mono font-bold text-black">
                              CHF {bid.amount.toLocaleString()}
                            </p>
                            <p className="text-[13px] text-gray-400 font-mono">
                              {new Date(bid.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="p-5 text-center text-xs font-mono uppercase text-gray-400">No bids placed yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {isImageFull && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setIsImageFull(false)}
        >
          <button
            type="button"
            onClick={() => setIsImageFull(false)}
            className="absolute right-6 top-6 w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center rounded-full transition-colors"
            aria-label="Close full image"
          >
            <X className="w-5 h-5 text-black" />
          </button>
          <img
            src={selectedImage}
            alt={item.name}
            className="max-h-full max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AuctionDetailPage;
