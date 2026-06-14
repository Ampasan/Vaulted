import React, { useState } from "react";
import { Link } from "react-router-dom";
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

const itemDetails = {
  id: 1,
  images: [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1587836374828-dd4052f6b3b5?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=400",
  ],
  lot: "LOT 8042",
  year: "YEAR 2016",
  title: "Patek Philippe Grandmaster Chime",
  subtitle: "Ref 6300A-010 • Unique Piece in Stainless Steel",
  currentBid: "CHF 31,190,400",
  startingBid: "CHF 18,000,000",
  endDateStr: "12.06.2026 • 18:00 GMT",
  totalBids: 47,
  bidders: 12,
  bidHistory: [
    {
      id: "#VLT-9938",
      amount: "CHF 31,190,400",
      time: "2 min ago",
      status: "LEADING",
    },
    {
      id: "#VLT-2241",
      amount: "CHF 30,800,000",
      time: "4 min ago",
      status: null,
    },
    {
      id: "#VLT-9938",
      amount: "CHF 29,500,000",
      time: "9 min ago",
      status: null,
    },
    {
      id: "#VLT-5517",
      amount: "CHF 28,200,000",
      time: "14 min ago",
      status: null,
    },
    {
      id: "#VLT-2241",
      amount: "CHF 27,000,000",
      time: "22 min ago",
      status: null,
    },
    {
      id: "#VLT-1103",
      amount: "CHF 25,500,000",
      time: "31 min ago",
      status: null,
    },
  ],
  provenance: [
    { period: "2016 - Present", desc: "Private Collection, Geneva" },
    { period: "Nov 2016", desc: "Only Watch Charity Auction" },
    { period: "2014 - 2016", desc: "Patek Philippe SA, Manufacture" },
  ],
};

const AuctionDetailPage = () => {
  // 'live' | 'won' | 'lost'
  const [auctionStatus, setAuctionStatus] = useState("live");
  const [autoBid, setAutoBid] = useState(false);
  const [hasBid, setHasBid] = useState(true); // Toggle this to test 'lost' vs 'won'
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageFull, setIsImageFull] = useState(false);
  const [isBidHistoryOpen, setIsBidHistoryOpen] = useState(false);
  const selectedImage = itemDetails.images[selectedImageIndex];

  const handleCountdownComplete = () => {
    setAuctionStatus(hasBid ? "won" : "lost");
  };

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
              {auctionStatus === "live" && (
                <StatusDot
                  status="live"
                  size="sm"
                  className="absolute top-4 right-4 z-10"
                />
              )}
              <img
                src={selectedImage}
                alt={itemDetails.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => setIsImageFull(true)}
                className="absolute bottom-4 right-4 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center rounded-full transition-colors z-20"
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
              {itemDetails.images.slice(0, 4).map((img, idx) => (
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
                  {itemDetails.totalBids}
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
                  {itemDetails.bidders}
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
              <PriceHistoryChart />
            </div>

            {/* Provenance */}
            <div className="border border-[#dcd9ce] p-6 md:p-8 bg-cream-light mb-8">
              <h3 className="text-lg font-black font-serif tracking-tight mb-6">
                Provenance
              </h3>
              <div className="flex flex-col gap-5">
                {itemDetails.provenance.map((prov, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-[12px] font-mono text-gray-400 mb-1">
                        {prov.period.split(" - ").map((p, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && (
                              <span className="mx-1 text-gray-300">-</span>
                            )}
                            {p === "Present" ? (
                              <span className="text-black">{p}</span>
                            ) : (
                              p
                            )}
                          </React.Fragment>
                        ))}
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
              <p className="text-[12px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-3 flex items-center justify-between">
                <span>
                  {itemDetails.lot} <span className="mx-2">•</span>{" "}
                  {itemDetails.year}
                </span>
                <span
                  className="text-[#3b8754] text-[8px] cursor-pointer hover:underline"
                  onClick={() => setHasBid(!hasBid)}
                >
                  [TEST: {hasBid ? "WILL WIN" : "WILL LOSE"}]
                </span>
              </p>
              <h1 className="text-4xl md:text-5xl font-black font-serif tracking-tight leading-none mb-4">
                {itemDetails.title}
              </h1>
              <p className="text-[15px] font-medium text-gray-500 mb-6">
                {itemDetails.subtitle}
              </p>
            </div>

            {/* Time Remaining */}
            <div className="border border-[#dcd9ce] p-6 mb-8 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-2">
                  TIME REMAINING
                </p>
                {auctionStatus === "live" ? (
                  <Countdown
                    initialSeconds={5}
                    onComplete={handleCountdownComplete}
                  />
                ) : (
                  <div className="text-3xl font-mono font-bold tracking-tight text-gray-300">
                    00 : 00 : 00
                  </div>
                )}
              </div>
              <div className="text-[13px] text-gray-400 tracking-[0.15em] uppercase font-bold flex items-center gap-1 text-right">
                <Clock className="w-3 h-3" /> {itemDetails.endDateStr}
              </div>
            </div>

            {/* High Bid */}
            <div className="mb-8">
              <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-2">
                CURRENT HIGH BID
              </p>
              <p className="text-3xl md:text-4xl font-mono font-bold text-black tracking-tight mb-2">
                {itemDetails.currentBid}
              </p>
              <p className="text-[13px] font-mono text-gray-400">
                Starting bid: {itemDetails.startingBid}
              </p>
            </div>

            {/* Logic Panels */}
            {auctionStatus === "live" && (
              <>
                <div className="border border-[#dcd9ce] p-6 mb-6">
                  <div className="flex flex-col mb-8">
                    <p className="text-[9px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-4">
                      PLACE BID
                    </p>
                    <div className="flex items-center">
                      <span className="text-[14px] font-mono text-gray-400 mr-4">
                        CHF
                      </span>
                      <Input
                        placeholder="200000000"
                        className="flex-1"
                        inputClassName="text-xl"
                      />
                      <button className="bg-[#3b8754] hover:bg-[#327347] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-3 ml-4 flex items-center gap-2 transition-colors">
                        BID PLACED{" "}
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
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-[#dcd9ce] pt-6 flex flex-col gap-4">
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
                </div>

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
                    BID PLACED — CHF 200000000
                  </p>
                  <p className="text-[12px] font-medium opacity-80 mb-6">
                    You are currently the leading bidder.
                  </p>
                  <button className="w-full border border-[#256037]/30 hover:bg-[#256037]/5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-colors">
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      ></path>
                    </svg>
                    SET BID ALERT & CONTINUE WATCHING
                  </button>
                </div>
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
                >
                  PROCEED TO SETTLEMENT &rarr;
                </Button>
              </div>
            )}

            {auctionStatus === "lost" && (
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
              <Button
                fullWidth
                variant="primary"
                size="lg"
                className="py-4 text-[11px] opacity-50 cursor-not-allowed"
              >
                ACQUIRE INSTANTLY &rarr;
              </Button>
              <div className="flex gap-3">
                <Button
                  fullWidth
                  variant="outline"
                  size="lg"
                  className="py-4 text-[11px] gap-2 border-[#dcd9ce] hover:border-black w-1/2"
                >
                  <Heart className="w-4 h-4" /> WISHLIST
                </Button>
                <div className="w-1/2 py-4 flex items-center justify-center gap-2 text-[11px] text-gray-500 tracking-[0.2em] uppercase font-bold">
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
                  BID HISTORY ({itemDetails.bidHistory.length})
                </p>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isBidHistoryOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isBidHistoryOpen && (
                <div className="border-t border-[#dcd9ce]">
                  {itemDetails.bidHistory.map((bid, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-5 ${idx !== itemDetails.bidHistory.length - 1 ? "border-b border-[#dcd9ce]" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-mono text-black">
                          Bidder {bid.id}
                        </p>
                        {bid.status && (
                          <span className="bg-black text-white text-[8px] font-bold px-2 py-0.5 tracking-widest uppercase">
                            {bid.status}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-[14px] font-mono font-bold text-black">
                          {bid.amount}
                        </p>
                        <p className="text-[13px] text-gray-400 font-mono">
                          {bid.time}
                        </p>
                      </div>
                    </div>
                  ))}
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
            alt={itemDetails.title}
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
