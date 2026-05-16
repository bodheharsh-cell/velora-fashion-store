import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import Collections from './pages/Collections';
import About from './pages/About';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import { ShopProvider } from './context/ShopContext';

function App() {
  return (
    <ShopProvider>
      <Router>
        <Toaster 
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#000',
              color: '#fff',
              borderRadius: '0px',
              fontSize: '12px',
              padding: '16px 24px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            },
          }}
        />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="collections" element={<Collections />} />
            <Route path="about" element={<About />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </ShopProvider>
  );
}

export default App;