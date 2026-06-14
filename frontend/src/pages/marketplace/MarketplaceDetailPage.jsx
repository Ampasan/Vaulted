import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Copy, ShieldCheck, X } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import PriceHistoryChart from "../../components/features/marketplace/PriceHistoryChart";

const itemDetails = {
  id: 1,
  images: [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1587836374828-dd4052f6b3b5?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=400",
  ],
  maker: "PATEK",
  category: "HOROLOGY",
  title: "Cosmograph Daytona 1969",
  ref: "Ref. 6263",
  vaultSerial: "GP-6263-1969",
  condition: "MINT - UNWORN",
  specsSummary: "37mm - Stainless Steel - Manual Wind",
  specs: [
    { label: "MOVEMENT", value: "Valjoux 72B - Manual Wind" },
    { label: "CASE DIAMETER", value: "37.0 mm" },
    { label: "CASE MATERIAL", value: "Stainless Steel" },
    { label: "DIAL", value: "Exotic 'Oyster' Black" },
    { label: "BRACELET", value: "Original Riveted Steel" },
    { label: "VAULT SERIAL", value: "GP-6263-1969" },
  ],
  acquisitionValue: "CHF 380,000",
  privateSalePrice: "CHF 450,000",
  provenance: [
    { period: "2018 - Present", desc: "Private Collection, Zürich" },
    { period: "2011 - 2018", desc: "Antiquorum Geneva, Lot 412" },
    { period: "1978 - 2011", desc: "Original Purchaser, Geneva" },
  ],
};

const parsePrice = (price) => {
  const [currency, ...amountParts] = price.trim().split(/\s+/);
  return {
    currency: currency || "CHF",
    amount: amountParts.join(" ") || "0",
  };
};

const MarketplaceDetailPage = () => {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageFull, setIsImageFull] = useState(false);
  const selectedImage = itemDetails.images[selectedImageIndex];

  const handleAcquireInstantly = () => {
    const { currency, amount } = parsePrice(itemDetails.privateSalePrice);
    navigate("/settlement", {
      state: {
        asset: {
          image: itemDetails.images[0],
          title: itemDetails.title,
          currency,
          amount,
        },
        returnTo: `/marketplace/${itemDetails.id}`,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink">
      <Navbar activeLink="marketplace" />

      <main className="flex-1 w-full max-w-360 mx-auto px-6 lg:px-12 py-8 lg:py-12">
        {/* Breadcrumb */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] font-bold text-gray-500 hover:text-black uppercase mb-8 lg:mb-12 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> MARKETPLACE
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column: Images & Specs */}
          <div className="flex flex-col">
            {/* Main Image */}
            <div className="relative aspect-square md:aspect-4/3 lg:aspect-square bg-[#e0dfd9] w-full mb-4 group overflow-hidden">
              <Badge
                variant="dark"
                className="absolute top-4 left-4 z-10 px-3 py-1 text-[10px]"
              >
                AUTHENTICATED
              </Badge>
              <img
                src={selectedImage}
                alt={itemDetails.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => setIsImageFull(true)}
                className="absolute bottom-4 right-4 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center rounded-full transition-colors"
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
            <div className="grid grid-cols-4 gap-4 mb-12">
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

            {/* Condition & Specs Summary Boxes */}
            <div className="grid grid-cols-2 gap-0 border border-[#dcd9ce] mb-8">
              <div className="p-4 border-r border-[#dcd9ce]">
                <p className="text-[11px] text-gray-400 tracking-[0.2em] font-bold uppercase mb-2">
                  CONDITION
                </p>
                <p className="text-[13px] font-mono font-bold text-black uppercase">
                  {itemDetails.condition}
                </p>
              </div>
              <div className="p-4">
                <p className="text-[11px] text-gray-400 tracking-[0.2em] font-bold uppercase mb-2">
                  SPECIFICATIONS
                </p>
                <p className="text-[13px] font-mono text-gray-600">
                  {itemDetails.specsSummary}
                </p>
              </div>
            </div>

            {/* Detailed Specs List */}
            <div className="border border-[#dcd9ce] flex flex-col">
              {itemDetails.specs.map((spec, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center p-4 text-[12px] tracking-widest font-mono ${idx !== itemDetails.specs.length - 1 ? "border-b border-[#dcd9ce]" : ""}`}
                >
                  <span className="text-gray-400 uppercase">{spec.label}</span>
                  <span className="text-black font-bold text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing & Actions */}
          <div className="flex flex-col">
            {/* Headers */}
            <div className="mb-10">
              <p className="text-[12px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-3">
                {itemDetails.maker} <span className="mx-2">•</span>{" "}
                {itemDetails.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-black font-serif tracking-tight leading-none mb-4">
                {itemDetails.title}
              </h1>
              <p className="text-[14px] font-medium text-gray-500 mb-6">
                {itemDetails.ref}
              </p>
              <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] font-bold text-gray-400 uppercase">
                VAULT SERIAL:{" "}
                <span className="text-black">{itemDetails.vaultSerial}</span>
                <button
                  className="hover:text-black transition-colors"
                  title="Copy Serial"
                >
                  <Copy className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="border border-[#dcd9ce] p-6 md:p-8 mb-8 bg-transparent">
              <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-1">
                ACQUISITION VALUE
              </p>
              <p className="text-[13px] font-mono text-gray-400 line-through mb-6">
                {itemDetails.acquisitionValue}
              </p>

              <p className="text-[12px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-2">
                PRIVATE SALE PRICE
              </p>
              <p className="text-4xl font-mono font-bold text-black tracking-tight mb-8">
                {itemDetails.privateSalePrice}
              </p>

              <div className="border-t border-[#dcd9ce] pt-8">
                <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-2">
                  PRICE HISTORY
                </p>
                <PriceHistoryChart />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-6">
              <Button
                fullWidth
                variant="primary"
                size="lg"
                className="py-4 text-[11px]"
                onClick={handleAcquireInstantly}
              >
                ACQUIRE INSTANTLY &rarr;
              </Button>
              <Button
                fullWidth
                variant="outline"
                size="lg"
                className="py-4 text-[11px] gap-2 border-[#dcd9ce] hover:border-black"
              >
                <Heart className="w-4 h-4" /> ADD TO WISHLIST
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-16">
              <ShieldCheck className="w-3.5 h-3.5" /> VAULT SECURED •
              CRYPTOGRAPHIC CERTIFICATE ISSUED
            </div>

            {/* Provenance */}
            <div>
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

export default MarketplaceDetailPage;
