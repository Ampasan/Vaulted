import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ListingTypeCards from "../components/features/asset/ListingTypeCards";
import AuctionForm from "../components/features/item/AuctionForm";
import SellForm from "../components/features/item/SellForm";
import assetService from "../services/assetService";

const initialAssetDetails = {
  title: "",
  category: "",
  year: "",
  condition: "",
  buyerTier: "",
  extrasRating: "",
  description: "",
};

const initialAuctionParams = {
  reservePrice: "",
  openingBid: "",
  bidIncrement: "",
  duration: "",
  startDate: "",
  buyNowEnabled: false,
  buyNowPrice: "",
};

const initialFixedPrice = {
  askingPrice: "",
};

const MakeAssetPage = () => {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState("sell");
  const [assetDetails, setAssetDetails] = useState(initialAssetDetails);
  const [auctionParams, setAuctionParams] = useState(initialAuctionParams);
  const [fixedPrice, setFixedPrice] = useState(initialFixedPrice);
  const [documents, setDocuments] = useState({ imageUrls: [], verificationDocument: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSaveDraft = () => {
    console.log("Save draft", {
      listingType,
      assetDetails,
      auctionParams,
      fixedPrice,
      documents,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const isFixedPrice = listingType === "sell";
      const price = isFixedPrice
        ? (Number(fixedPrice.askingPrice) || 0)
        : (Number(auctionParams.openingBid) || Number(auctionParams.reservePrice) || 0);

      const itemRes = await assetService.createItem({
        title: assetDetails.title,
        description: assetDetails.description,
        category: assetDetails.category,
        year: assetDetails.year,
        condition: assetDetails.condition,
        buyerTier: assetDetails.buyerTier,
        extrasRating: assetDetails.extrasRating,
        imageUrl: documents.imageUrls,
        currentPrice: price,
        verificationDocument: documents.verificationDocument,
      });

      if (!itemRes.success) {
        throw new Error(itemRes.message || "Failed to create asset item.");
      }

      const itemId = itemRes.data._id;

      if (isFixedPrice) {
        const listRes = await assetService.listItemOnMarketplace(itemId, price);
        if (!listRes.success) {
          throw new Error(listRes.message || "Failed to list item on marketplace.");
        }
        navigate("/marketplace");
      } else {
        const durationDays = Number(auctionParams.duration) || 7;
        const endTime = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

        const auctionPayload = {
          itemId,
          startPrice: price,
          endTime,
        };

        if (auctionParams.reservePrice) {
          auctionPayload.reservePrice = Number(auctionParams.reservePrice);
        }
        if (auctionParams.bidIncrement) {
          auctionPayload.bidIncrement = Number(auctionParams.bidIncrement);
        }
        if (auctionParams.startDate) {
          auctionPayload.scheduledStart = new Date(auctionParams.startDate);
        }
        if (auctionParams.buyNowEnabled && auctionParams.buyNowPrice) {
          auctionPayload.buyNowEnabled = true;
          auctionPayload.buyNowPrice = Number(auctionParams.buyNowPrice || price * 1.5);
        }

        const auctionRes = await assetService.createAuction(auctionPayload);

        if (!auctionRes.success) {
          throw new Error(auctionRes.message || "Failed to create auction.");
        }
        navigate("/auctions");
      }
    } catch (err) {
      console.error("Error creating listing:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-cream text-ink min-h-screen">
      <Navbar activeLink="asset" />

      <main className="flex-1 max-w-360 w-full mx-auto px-6 lg:px-12 pt-10 md:pt-12 pb-20 md:pb-32">
        <Header
          breadcrumb={
            <>
              VAULTED <span className="mx-2">&mdash;</span> MAKE ASSET
            </>
          }
          title="List an Asset"
        />

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 md:mt-12 w-full">
          <ListingTypeCards value={listingType} onChange={setListingType} />

          {loading && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Submitting listing details...
            </div>
          )}

          <div className="mt-14 md:mt-16">
            {listingType === "auction" ? (
              <AuctionForm
                assetDetails={assetDetails}
                onAssetDetailsChange={setAssetDetails}
                auctionParams={auctionParams}
                onAuctionParamsChange={setAuctionParams}
                onDocumentsChange={setDocuments}
                onSaveDraft={handleSaveDraft}
              />
            ) : (
              <SellForm
                assetDetails={assetDetails}
                onAssetDetailsChange={setAssetDetails}
                fixedPrice={fixedPrice}
                onFixedPriceChange={setFixedPrice}
                onDocumentsChange={setDocuments}
                onSaveDraft={handleSaveDraft}
              />
            )}
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default MakeAssetPage;
