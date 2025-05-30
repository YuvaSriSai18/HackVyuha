import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Layout components
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PaperUpload from './pages/PaperUpload';
import PaperView from './pages/PaperView';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ConnectWallet from './pages/ConnectWallet';
import EditProfile from './pages/EditProfile';
import InterestedReviewer from './pages/InterestedReviewer';
import Admin from './pages/Admin';
import VerifyEmail from './pages/VerifyEmail';



// Protected route
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="connect-wallet" element={<ConnectWallet />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="paper/upload" element={<PaperUpload />} />
              <Route path="paper/:id" element={<PaperView />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/edit" element={<EditProfile />} />
              <Route path="/interested-reviewer" element={<InterestedReviewer />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/verifyemail" element={<VerifyEmail />} />
              
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </GoogleOAuthProvider>
  );
}

export default App;
