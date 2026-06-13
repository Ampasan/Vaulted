import { useMemo, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import Tabs from '../components/ui/Tabs';
import Toggle from '../components/ui/Toggle';
import AssetListRow from '../components/features/asset/AssetListRow';
import AssetGrid from '../components/features/asset/AssetGrid';
import AssetCard from '../components/features/asset/AssetCard';

const wishlistData = [
  {
    id: 1,
    image: 'https://picsum.photos/200/160?random=31',
    maker: 'PATEK PHILIPPE',
    title: 'Nautilus 5711/1A',
    category: 'Horology',
    categoryId: 'horology',
    status: 'live',
    addedDate: '12 May 2026',
    saleType: 'Private Sale',
    currency: 'CHF',
    price: '165,000',
  },
  {
    id: 2,
    image: 'https://picsum.photos/200/160?random=32',
    maker: 'FERRARI',
    title: '250 GTO 1962',
    category: 'Automobiles',
    categoryId: 'automobiles',
    badge: 'Automobiles',
    addedDate: '08 May 2026',
    saleType: 'Live Auction',
    currency: 'CHF',
    price: '48,400,000',
  },
  {
    id: 3,
    image: 'https://picsum.photos/200/160?random=33',
    maker: 'BASQUIAT',
    title: 'Untitled (Skull) 1981',
    category: 'Fine Art',
    categoryId: 'fine-art',
    badge: 'Fine Art',
    addedDate: '03 May 2026',
    saleType: 'Private Sale',
    currency: 'CHF',
    price: '5,100,000',
  },
  {
    id: 4,
    image: 'https://picsum.photos/200/160?random=34',
    maker: 'ROLEX',
    title: 'Submariner \'Comex\' 1680',
    category: 'Horology',
    categoryId: 'horology',
    status: 'live',
    addedDate: '28 Apr 2026',
    saleType: 'Live Auction',
    currency: 'CHF',
    price: '165,000',
  },
  {
    id: 5,
    image: 'https://picsum.photos/200/160?random=35',
    maker: 'LAMBORGHINI',
    title: 'Miura P400 SV 1972',
    category: 'Automobiles',
    categoryId: 'automobiles',
    badge: 'Automobiles',
    addedDate: '21 Apr 2026',
    saleType: 'Private Sale',
    currency: 'CHF',
    price: '2,450,000',
  },
];

const wishlistTabs = [
  { id: 'all', label: 'All' },
  { id: 'horology', label: 'Horology' },
  { id: 'automobiles', label: 'Automobiles' },
  { id: 'fine-art', label: 'Fine Art' },
];

const WishlistPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [items, setItems] = useState(wishlistData);

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return items;
    return items.filter((item) => item.categoryId === activeTab);
  }, [activeTab, items]);

  const handleRemove = (asset) => {
    setItems((current) => current.filter((item) => item.id !== asset.id));
  };

  return (
    <div className="flex flex-col w-full bg-cream text-ink min-h-screen">
      <Navbar />

      <section className="w-full bg-black px-6 md:px-12 lg:px-16 xl:px-24 pt-10 pb-14">
        <Header
          variant="dark"
          breadcrumb={
            <>
              VAULTED <span className="mx-2">&mdash;</span> SAVED ASSETS
            </>
          }
          title="Wishlist"
          description={`${items.length} saved asset${items.length === 1 ? '' : 's'} across your portfolio`}
          action={{ label: 'Browse Assets \u2192', to: '/marketplace' }}
        />
      </section>

      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-10 pb-32">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <Tabs
            tabs={wishlistTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="flex-1"
          />
          <Toggle mode="icons" value={viewMode} onValueChange={setViewMode} />
        </div>

        {viewMode === 'list' ? (
          <div>
            <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_160px_minmax(140px,180px)_126px_24px] gap-8 pb-3 border-b border-[#dcd9ce]">
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold">Asset</p>
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold text-center">Added</p>
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold text-right">Price</p>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </div>

            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <AssetListRow
                  key={item.id}
                  asset={item}
                  onRemove={handleRemove}
                />
              ))
            ) : (
              <p className="py-16 text-center text-[13px] text-gray-500 font-medium">
                No saved assets in this category.
              </p>
            )}
          </div>
        ) : (
          <AssetGrid
            items={filteredItems}
            columns={3}
            renderItem={(item) => (
              <AssetCard
                asset={{
                  ...item,
                  image: item.image,
                  category: item.maker,
                  subtitle: item.category,
                  price: `${item.currency} ${item.price}`,
                  priceLabel: 'Est. Price',
                  status: item.status,
                  aspect: 'marketplace',
                  framed: true,
                  showWishlist: true,
                  actionLabel: <>VIEW &rarr;</>,
                }}
              />
            )}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
