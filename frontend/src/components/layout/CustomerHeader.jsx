import React from 'react';
import { Link } from 'react-router-dom';
import { Package, LogOut, Menu, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const CustomerHeader = ({ title, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="border-b border-orange-300 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 sticky top-0 z-30 shrink-0">
      <div className="px-4 sm:px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Hamburger for mobile */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg bg-orange-700 hover:bg-orange-800 text-white transition-colors"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Brand icon */}
          <div className="hidden md:flex p-1.5 rounded-lg bg-orange-500 border border-orange-500">
            <Package className="h-4 w-4 text-white" />
          </div>

          <span className="font-bold text-white hidden sm:block text-[14px]">RentAll Platform</span>

          <span className="hidden sm:inline-flex items-center justify-center px-2 py-[3px] rounded bg-black/20 text-[10px] font-bold text-white/90 tracking-wide uppercase">
            Customer
          </span>

          <span className="font-medium text-white sm:ml-1.5 sm:border-l sm:border-orange-500 sm:pl-3 text-[14px]">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Cart icon with badge */}
          <Link
            to="/cart"
            className="relative p-2 rounded-lg bg-white/10 border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/30 text-white/80 hover:text-orange-200 transition-all duration-200 active:scale-95"
            title="Shopping Cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold shadow-lg animate-[scale-in_0.2s_ease-out]">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          <span className="text-[13px] font-medium text-orange-100 hidden sm:block">{user?.name}</span>
          <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-white/80 hover:text-red-300 text-xs font-medium transition-all duration-200 active:scale-95 shadow-md shadow-black/25"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;

