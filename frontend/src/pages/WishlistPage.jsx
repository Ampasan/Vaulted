import { useMemo, useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import Tabs from '../components/ui/Tabs';
import Toggle from '../components/ui/Toggle';
import AssetListRow from '../components/features/asset/AssetListRow';
import AssetGrid from '../components/features/asset/AssetGrid';
import AssetCard from '../components/features/asset/AssetCard';
import wishlistService from '../services/wishlistService';

const wishlistTabs = [
  { id: 'all', label: 'All' },
  { id: 'horology', label: 'Horology' },
  { id: 'automobiles', label: 'Automobiles' },
  { id: 'fine-art', label: 'Fine Art' },
];

const getCategoryId = (name = '', description = '') => {
  const text = `${name} ${description}`.toLowerCase();
  if (text.includes('patek') || text.includes('rolex') || text.includes('watch') || text.includes('nautilus') || text.includes('chronograph') || text.includes('daytona')) {
    return 'horology';
  }
  if (text.includes('ferrari') || text.includes('lamborghini') || text.includes('car') || text.includes('miura') || text.includes('automobiles') || text.includes('chassis') || text.includes('automotive')) {
    return 'automobiles';
  }
  if (text.includes('basquiat') || text.includes('art') || text.includes('skull') || text.includes('painting') || text.includes('lithograph')) {
    return 'fine-art';
  }
  return 'horology';
};

const getCategoryLabel = (catId) => {
  if (catId === 'horology') return 'Horology';
  if (catId === 'automobiles') return 'Automobiles';
  if (catId === 'fine-art') return 'Fine Art';
  return 'Horology';
};

const WishlistPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await wishlistService.getWishlist();
      if (res.success && res.data) {
        const formatted = res.data.map((item) => {
          const itemData = item.itemId || {};
          const nameParts = (itemData.name || '').split(' ');
          const maker = nameParts[0] || '';
          const title = nameParts.slice(1).join(' ') || itemData.name || 'Untitled';
          const catId = getCategoryId(itemData.name, itemData.description);
          
          return {
            id: itemData._id || item._id,
            wishlistId: item._id,
            image: itemData.imageUrl || 'https://picsum.photos/200/160?random=31',
            maker: maker,
            title: title,
            category: getCategoryLabel(catId),
            categoryId: catId,
            status: itemData.status === 'in_auction' || itemData.status === 'listed_marketplace' ? 'live' : undefined,
            addedDate: new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            saleType: itemData.status === 'in_auction' ? 'Live Auction' : 'Private Sale',
            currency: 'CHF',
            price: itemData.currentPrice?.toLocaleString() || '0',
          };
        });
        setItems(formatted);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to fetch wishlist assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return items;
    return items.filter((item) => item.categoryId === activeTab);
  }, [activeTab, items]);

  const handleRemove = async (asset) => {
    try {
      const res = await wishlistService.removeFromWishlist(asset.id);
      if (res.success) {
        setItems((current) => current.filter((item) => item.id !== asset.id));
      }
    } catch (err) {
      console.error('Failed to remove item from wishlist:', err);
    }
  };

  return (
    <div className="flex flex-col w-full bg-cream text-ink min-h-screen">
      <Navbar activeLink="wishlist" />

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

        {loading ? (
          <p className="py-16 text-center text-[13px] text-gray-500 font-medium">
            Loading saved assets...
          </p>
        ) : error ? (
          <p className="py-16 text-center text-[13px] text-red-500 font-medium">
            {error}
          </p>
        ) : viewMode === 'list' ? (
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
                key={item.id}
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
