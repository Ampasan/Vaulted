import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ListingTypeCards from '../components/features/asset/ListingTypeCards';
import AuctionForm from '../components/features/item/AuctionForm';
import SellForm from '../components/features/item/SellForm';

const initialAssetDetails = {
  title: '',
  category: '',
  year: '',
  condition: '',
  buyerTier: '',
  extrasRating: '',
  description: '',
};

const initialAuctionParams = {
  reservePrice: '',
  openingBid: '',
  bidIncrement: '',
  duration: '',
  startDate: '',
  buyNowEnabled: false,
};

const initialFixedPrice = {
  askingPrice: '',
};

const MakeAssetPage = () => {
  const [listingType, setListingType] = useState('sell');
  const [assetDetails, setAssetDetails] = useState(initialAssetDetails);
  const [auctionParams, setAuctionParams] = useState(initialAuctionParams);
  const [fixedPrice, setFixedPrice] = useState(initialFixedPrice);
  const [documents, setDocuments] = useState([]);

  const handleSaveDraft = () => {
    console.log('Save draft', { listingType, assetDetails, auctionParams, fixedPrice, documents });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submit', { listingType, assetDetails, auctionParams, fixedPrice, documents });
  };

  return (
    <div className="flex flex-col w-full bg-cream text-ink min-h-screen">
      <Navbar activeLink="asset" />

      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-10 md:pt-12 pb-20 md:pb-32">
        <Header
          breadcrumb={
            <>
              VAULTED <span className="mx-2">&mdash;</span> MAKE ASSET
            </>
          }
          title="List an Asset"
        />

        <form onSubmit={handleSubmit} className="mt-10 md:mt-12 mx-auto w-full max-w-5xl">
          <ListingTypeCards value={listingType} onChange={setListingType} />

          <div className="mt-14 md:mt-16">
            {listingType === 'auction' ? (
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
