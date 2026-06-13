import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Marketplace from './pages/marketplace/MarketplacePage';
import AuctionsPage from './pages/auctions/AuctionsPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import MakeAssetPage from './pages/MakeAssetPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/auctions" element={<AuctionsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/asset" element={<MakeAssetPage />} />
      </Routes>
    </Router>
  );
}

export default App;
