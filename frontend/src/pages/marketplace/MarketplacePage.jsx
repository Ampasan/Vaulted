import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import SearchBar from '../../components/ui/SearchBar';
import Tabs from '../../components/ui/Tabs';
import AssetGrid from '../../components/features/asset/AssetGrid';
import AssetCard from '../../components/features/asset/AssetCard';

const marketplaceData = [
  { id: 1, image: 'https://picsum.photos/600/800?random=11', featured: true, maker: 'PATEK', title: 'Cosmograph Daytona 1969', ref: 'Ref. 6263', prevPrice: 'CHF 388,000', currPrice: 'CHF 458,000' },
  { id: 2, image: 'https://picsum.photos/600/800?random=12', featured: false, maker: 'FORMATIGN', title: 'Le Rêve Lithograph 1932', ref: 'Print 4/12', prevPrice: 'CHF 95,000', currPrice: 'CHF 120,000' },
  { id: 3, image: 'https://picsum.photos/600/800?random=13', featured: false, maker: 'FERRARI', title: 'F3 Carrera GT 1973', ref: 'Chassis 7087267', prevPrice: 'CHF 720,000', currPrice: 'CHF 850,000' },
  { id: 4, image: 'https://picsum.photos/600/800?random=14', featured: false, maker: 'ROLEX', title: 'Submariner \'Comex\' 1680', ref: 'Ref. 1680 - Comex 1970', prevPrice: 'CHF 145,000', currPrice: 'CHF 165,000' },
  { id: 5, image: 'https://picsum.photos/600/800?random=15', featured: false, maker: 'BASQUIAT', title: 'Untitled (Skull) 1981', ref: 'Acrylic on canvas - 40x30in', prevPrice: 'CHF 4,200,000', currPrice: 'CHF 5,100,000' },
  { id: 6, image: 'https://picsum.photos/600/800?random=16', featured: false, maker: 'LAMBORGHINI', title: 'Miura P400 SV 1972', ref: '3.9L V12 - Matching Numbers', prevPrice: 'CHF 2,100,000', currPrice: 'CHF 2,450,000' }
];

const marketplaceTabs = [
  { id: 'all', label: 'All Categories' },
  { id: 'horology', label: 'Horology' },
  { id: 'fine-art', label: 'Fine Art' },
  { id: 'automotive', label: 'Automotive' },
];

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col w-full bg-cream text-ink">
      <Navbar />
      
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

         <div className="mb-12">
           <Tabs 
             tabs={marketplaceTabs} 
             activeTab={activeTab} 
             onTabChange={setActiveTab} 
           />
         </div>

         <AssetGrid 
           items={marketplaceData} 
           columns={3} 
           renderItem={(item) => (
             <AssetCard
               asset={{
                 ...item,
                 category: item.maker,
                 subtitle: item.ref,
                 price: item.currPrice,
                 priceLabel: 'Acquisition Value',
                 aspect: 'marketplace',
                 showWishlist: true,
                 actionLabel: <>ACQUIRE INSTANTLY &rarr;</>,
               }}
             />
           )} 
         />
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
