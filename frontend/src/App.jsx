import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Marketplace from './pages/marketplace/MarketplacePage';
import MarketplaceDetailPage from './pages/marketplace/MarketplaceDetailPage';
import AuctionsPage from './pages/auctions/AuctionsPage';
import AuctionDetailPage from './pages/auctions/AuctionDetailPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import MakeAssetPage from './pages/MakeAssetPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import PortfolioPage from './pages/PortfolioPage';
import NotificationsPage from './pages/NotificationsPage';
import SettlementPage from './pages/SettlementPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<MarketplaceDetailPage />} />
        <Route path="/auctions" element={<AuctionsPage />} />
        <Route path="/auctions/:id" element={<AuctionDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/asset" element={<MakeAssetPage />} />
        <Route path="/transactions" element={<TransactionHistoryPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settlement" element={<SettlementPage />} />
      </Routes>
    </Router>
  );
}

export default App;
