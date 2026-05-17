import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart, Settings, LogOut, Tag, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function AdminLayout() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [sidebarOpen]);

  // Close drawer on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <Tag size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const SidebarContent = () => (
    <>
      {/* Brand + Close Button (mobile only) */}
      <div className="h-16 md:h-20 flex items-center justify-between px-5 md:px-8 border-b border-gray-100 flex-shrink-0">
        <Link to="/" className="text-lg md:text-xl font-bold tracking-tighter uppercase leading-none">
          ÉLÉGANCE <span className="font-light text-gray-400">ADMIN</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-gray-400 hover:text-black transition-colors p-1"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 md:px-4 flex flex-col space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-4">Menu</div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 md:p-4 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black transition-colors rounded-md text-sm font-medium"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Desktop Sidebar (always visible ≥ md) ── */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col fixed h-full z-20">
        <SidebarContent />
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer Panel ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white border-r border-gray-200 z-40 flex flex-col md:hidden transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen w-full min-w-0">
        {/* Mobile Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-black transition-colors p-1 -ml-1"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="text-base font-bold tracking-tighter uppercase leading-none">
            ÉLÉGANCE <span className="font-light text-gray-400">ADMIN</span>
          </Link>
          <div className="h-7 w-7 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
        </header>

        {/* Desktop Header */}
        <header className="h-20 bg-white border-b border-gray-200 hidden md:flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-light tracking-widest uppercase">Admin Workspace</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
