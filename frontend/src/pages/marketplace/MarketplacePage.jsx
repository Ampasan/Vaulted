import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import SearchBar from '../../components/ui/SearchBar';
import Tabs from '../../components/ui/Tabs';
import Pagination from '../../components/ui/Pagination';
import AssetGrid from '../../components/features/asset/AssetGrid';
import AssetCard from '../../components/features/asset/AssetCard';
import assetService from '../../services/assetService';
import { paginateItems } from '../../utils/pagination';
import useScrollToTop from '../../hooks/useScrollToTop';

const ITEMS_PER_PAGE = 9;

const marketplaceTabs = [
  { id: 'all', label: 'All Categories' },
  { id: 'horology', label: 'Horology' },
  { id: 'fine-art', label: 'Fine Art' },
  { id: 'automotive', label: 'Automotive' },
];

const getCategoryId = (category = '', name = '', description = '') => {
  const text = `${category} ${name} ${description}`.toLowerCase();
  if (text.includes('patek') || text.includes('rolex') || text.includes('watch') || text.includes('nautilus') || text.includes('chronograph') || text.includes('daytona') || text.includes('horology')) {
    return 'horology';
  }
  if (text.includes('ferrari') || text.includes('lamborghini') || text.includes('car') || text.includes('miura') || text.includes('automobiles') || text.includes('automotive') || text.includes('chassis') || text.includes('gt')) {
    return 'automotive';
  }
  if (text.includes('basquiat') || text.includes('art') || text.includes('skull') || text.includes('painting') || text.includes('lithograph') || text.includes('fine-art') || text.includes('fine art')) {
    return 'fine-art';
  }
  return 'horology';
};

const getCategoryLabel = (category = '', name = '', description = '') => {
  const catId = getCategoryId(category, name, description);
  if (catId === 'horology') return 'Horology';
  if (catId === 'automotive') return 'Automotive';
  if (catId === 'fine-art') return 'Fine Art';
  return category || 'Horology';
};

const Marketplace = () => {
  useScrollToTop();

  const listingRef = useRef(null);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await assetService.getMarketplaceItems();
      if (res.success && res.data) {
        const formatted = res.data.map((item) => {
          const nameParts = (item.name || '').split(' ');
          const maker = nameParts[0] || '';
          const title = nameParts.slice(1).join(' ') || item.name || 'Untitled';
          const categoryId = getCategoryId(item.category, item.name, item.description);
          const category = getCategoryLabel(item.category, item.name, item.description);

          return {
            id: item._id,
            image: Array.isArray(item.imageUrl) && item.imageUrl.length > 0
              ? item.imageUrl[0]
              : (typeof item.imageUrl === 'string' && item.imageUrl ? item.imageUrl : 'https://picsum.photos/600/800?random=11'),
            maker: maker.toUpperCase(),
            title: title,
            ref: item.description?.substring(0, 50) || 'Fine Asset',
            prevPrice: item.priceHistory && item.priceHistory.length > 1
              ? `CHF ${item.priceHistory[item.priceHistory.length - 2].price.toLocaleString()}`
              : undefined,
            currPrice: `CHF ${item.currentPrice?.toLocaleString() || '0'}`,
            category,
            categoryId,
            name: item.name,
            description: item.description,
          };
        });
        setItems(formatted);
      }
    } catch (err) {
      console.error('Error fetching marketplace items:', err);
      setError('Failed to load marketplace items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab = activeTab === 'all' || item.categoryId === activeTab;
      const matchesSearch =
        search.trim() === '' ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search, items]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  const pagination = useMemo(
    () => paginateItems(filteredItems, currentPage, ITEMS_PER_PAGE),
    [filteredItems, currentPage]
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    requestAnimationFrame(() => {
      listingRef.current?.scrollIntoView({ block: 'start' });
    });
  };

  return (
    <div className="flex flex-col w-full bg-cream text-ink">
      <Navbar activeLink="marketplace" />

      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-12 pb-32">
        <Header
          breadcrumb={<>VAULTED <span className="mx-2">-</span> MARKETPLACE</>}
          title="Marketplace"
          description="Curated, authenticated physical assets available for immediate acquisition. No bidding required."
        />

        <div className="mb-10">
          <SearchBar
            placeholder="Search by title, maker, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div ref={listingRef} />

        <div className="mb-12">
          <Tabs
            tabs={marketplaceTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {loading ? (
          <p className="py-16 text-center text-[13px] text-gray-500 font-medium">
            Loading marketplace items...
          </p>
        ) : error ? (
          <p className="py-16 text-center text-[13px] text-red-500 font-medium">
            {error}
          </p>
        ) : filteredItems.length > 0 ? (
          <>
            <AssetGrid
              items={pagination.items}
              columns={3}
              renderItem={(item) => (
                <Link key={item.id} to={`/marketplace/${item.id}`} className="block h-full">
                  <AssetCard
                    asset={{
                      ...item,
                      category: item.category,
                      subtitle: item.ref,
                      price: item.currPrice,
                      priceLabel: 'Acquisition Value',
                      aspect: 'marketplace',
                      showWishlist: true,
                      actionLabel: <>ACQUIRE INSTANTLY &rarr;</>,
                    }}
                  />
                </Link>
              )}
            />
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <p className="py-16 text-center text-[13px] text-gray-500 font-medium">
            No items found matching your filters.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
