import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Marketplace from './pages/Marketplace';
import AuctionsPage from './pages/auctions/AuctionsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/auctions" element={<AuctionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
