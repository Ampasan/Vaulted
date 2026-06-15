import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import useAuth from './hooks/useAuth';
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

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex w-full bg-cream text-ink min-h-screen justify-center items-center font-mono uppercase tracking-[0.2em] text-xs">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex w-full bg-cream text-ink min-h-screen justify-center items-center font-mono uppercase tracking-[0.2em] text-xs">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/marketplace" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/auth"
                element={
                  <GuestRoute>
                    <AuthPage />
                  </GuestRoute>
                }
              />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/:id" element={<MarketplaceDetailPage />} />
              <Route path="/auctions" element={<AuctionsPage />} />
              <Route path="/auctions/:id" element={<AuctionDetailPage />} />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/asset"
                element={
                  <ProtectedRoute>
                    <MakeAssetPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <TransactionHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <ProtectedRoute>
                    <PortfolioPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settlement"
                element={
                  <ProtectedRoute>
                    <SettlementPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
