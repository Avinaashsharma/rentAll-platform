import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const {
    cart,
    isLoading,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [updatingItems, setUpdatingItems] = useState({});
  const [isClearing, setIsClearing] = useState(false);

  const items = cart?.items ?? [];

  const subtotal = items.reduce((sum, entry) => {
    const rate = entry.item?.dailyRate ?? 0;
    return sum + rate * entry.quantity;
  }, 0);

  const totalDeposit = items.reduce((sum, entry) => {
    const deposit = entry.item?.securityDeposit ?? 0;
    return sum + deposit * entry.quantity;
  }, 0);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1 || newQty > 10) return;
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));
    try {
      await updateQuantity(itemId, newQty);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quantity.');
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemove = async (itemId, itemName) => {
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));
    try {
      await removeItem(itemId);
      toast.success(`${itemName} removed from cart.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item.');
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    try {
      await clearCart();
      toast.success('Cart cleared.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear cart.');
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="py-6 px-2 sm:py-8 sm:px-4 lg:px-6 max-w-[1600px] mx-auto w-full">

      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-slate-800/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl tracking-tight drop-shadow-sm pb-1">
              <span className="font-extrabold text-slate-100">Shopping</span>{' '}
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Cart
              </span>
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-[15px] mt-1 sm:mt-2 max-w-xl leading-relaxed">
              {itemCount === 0
                ? 'Your cart is empty'
                : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`}
            </p>
          </div>
          <Link
            to="/catalog"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-100 transition-colors bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-700/50 hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Browsing
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 mb-5">
            <ShoppingCart className="h-12 w-12 text-slate-600" />
          </div>
          <p className="text-slate-300 font-bold text-lg mb-1">Your cart is empty</p>
          <p className="text-slate-500 text-sm mb-6 max-w-sm">
            Browse our catalog and add equipment to your cart to get started.
          </p>
          <Link to="/catalog">
            <Button variant="primary" size="lg">
              Browse Catalog
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <Button
                variant="danger"
                size="sm"
                onClick={handleClear}
                isLoading={isClearing}
                className="gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Cart
              </Button>
            </div>

            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-4">
              {items.map((entry) => {
                const item = entry.item;
                if (!item) return null;

                const isUpdating = updatingItems[item._id];
                const isUnavailable = item.status !== 'available';

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`bg-slate-900 border rounded-xl overflow-hidden shadow-sm transition-all ${isUnavailable ? 'border-red-500/30 opacity-75' : 'border-slate-800 hover:border-orange-700/50'}`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <Link
                        to={`/catalog/${item._id}`}
                        className="aspect-[3/2] sm:w-40 md:w-48 sm:aspect-auto shrink-0 overflow-hidden"
                      >
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0].url}
                            alt={item.name}
                            className="w-full h-full object-fill hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800/50 min-h-[80px] sm:min-h-[120px]">
                            <Package className="h-8 w-8 sm:h-10 sm:w-10 text-slate-600" />
                          </div>
                        )}
                      </Link>

                      {/* Details */}
                      <div className="flex-1 p-2 sm:p-4 flex flex-col min-w-0">
                        <div className="flex items-start justify-between gap-1 sm:gap-3">
                          <div className="min-w-0 flex-1">
                            {/* Category */}
                            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[7px] sm:text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 text-orange-600 border border-orange-500/20 mb-1">
                              {item.category?.replace(/-/g, ' ')}
                            </span>
                            {/* Name */}
                            <Link to={`/catalog/${item._id}`}>
                              <h3 className="font-bold text-slate-100 text-[11px] sm:text-base leading-snug line-clamp-2 hover:text-orange-500 transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => handleRemove(item._id, item.name)}
                            disabled={isUpdating}
                            className="p-1 sm:p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                            title="Remove from cart"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>

                        {/* Unavailable Warning */}
                        {isUnavailable && (
                          <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 text-red-400 text-[10px] sm:text-xs font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5">
                            <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                            <span className="hidden sm:inline">This item is no longer available</span>
                            <span className="sm:hidden">Unavailable</span>
                          </div>
                        )}

                        {/* Price + Quantity Controls */}
                        <div className="mt-auto pt-2 sm:pt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3">
                          {/* Pricing */}
                          <div className="flex items-baseline gap-2 sm:gap-3">
                            <div>
                              <p className="text-[7px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                Daily Rate
                              </p>
                              <p className="text-xs sm:text-lg font-black text-orange-500">
                                ₹{item.dailyRate}
                                <span className="text-[8px] sm:text-[10px] font-semibold text-slate-400 ml-0.5">/day</span>
                              </p>
                            </div>
                            <div className="w-[1px] h-5 sm:h-8 bg-slate-800" />
                            <div>
                              <p className="text-[7px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                Subtotal
                              </p>
                              <p className="text-xs sm:text-lg font-black text-slate-200">
                                ₹{(item.dailyRate * entry.quantity).toLocaleString('en-IN')}
                                <span className="text-[8px] sm:text-[10px] font-semibold text-slate-400 ml-0.5">/day</span>
                              </p>
                            </div>
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <button
                              onClick={() => handleQuantityChange(item._id, entry.quantity - 1)}
                              disabled={isUpdating || entry.quantity <= 1}
                              className="p-1 sm:p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                              <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </button>
                            <span className="w-6 sm:w-10 text-center font-bold text-slate-100 text-xs sm:text-base tabular-nums">
                              {isUpdating ? (
                                <Spinner size="sm" className="mx-auto" />
                              ) : (
                                entry.quantity
                              )}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item._id, entry.quantity + 1)}
                              disabled={isUpdating || entry.quantity >= 10}
                              className="p-1 sm:p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                              <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </div>
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl p-3 sm:p-5 sticky top-20"
            >
              <h2 className="text-base sm:text-lg font-bold text-slate-100 mb-3 sm:mb-5 pb-2 sm:pb-3 border-b border-slate-800">
                Order Summary
              </h2>

              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-5">
                {items.map((entry) => {
                  const item = entry.item;
                  if (!item) return null;
                  return (
                    <div key={item._id} className="flex justify-between text-[11px] sm:text-sm">
                      <span className="text-slate-400 truncate pr-2 flex-1">
                        {item.name} × {entry.quantity}
                      </span>
                      <span className="text-slate-200 font-semibold whitespace-nowrap">
                        ₹{(item.dailyRate * entry.quantity).toLocaleString('en-IN')}/day
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-800 pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-[11px] sm:text-sm">
                  <span className="text-slate-400">Daily Rental Total</span>
                  <span className="text-slate-200 font-bold">₹{subtotal.toLocaleString('en-IN')}/day</span>
                </div>
                <div className="flex justify-between text-[11px] sm:text-sm">
                  <span className="text-slate-400">Total Deposit</span>
                  <span className="text-slate-200 font-bold">₹{totalDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[11px] sm:text-sm">
                  <span className="text-slate-400">Items</span>
                  <span className="text-slate-200 font-bold">{itemCount}</span>
                </div>
              </div>

              <div className="border-t border-slate-800 mt-3 sm:mt-4 pt-3 sm:pt-4">
                <div className="flex justify-between mb-3 sm:mb-5">
                  <span className="text-[13px] sm:text-base font-bold text-slate-100">Estimated Total</span>
                  <span className="text-base sm:text-xl font-black text-orange-500">
                    ₹{subtotal.toLocaleString('en-IN')}
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-400 ml-0.5">/day</span>
                  </span>
                </div>

                <p className="text-[10px] sm:text-[11px] text-slate-500 text-center leading-relaxed">
                  Final total will be calculated based on your rental period at booking time.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-300/20 pt-8 sm:pt-12 pb-6 sm:pb-8 mt-10 sm:mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-10 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <span className="font-black text-slate-100 text-sm sm:text-lg tracking-tight">RentAll Platform</span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Your trusted partner for professional rentals. Quality gear, reliable service, every time.
            </p>
          </div>
          <div>
            <h4 className="text-slate-200 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">Support</h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-500">
              <li className="flex items-start gap-1.5 sm:gap-2"><span>📧</span> 73aveen@gmail.com</li>
              <li className="flex items-start gap-1.5 sm:gap-2"><span>📞</span> +91 9xxxxxxx</li>
              <li className="flex items-start gap-1.5 sm:gap-2"><span>📍</span> indore, MP,  India</li>
              <li className="flex items-start gap-1.5 sm:gap-2"><span>🕐</span> Mon–Sat, 9 AM – 6 PM</li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-200 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {[
                { label: 'Browse Catalog', path: '/catalog' },
                { label: 'My Rentals', path: '/my-rentals' },
                { label: 'Dashboard', path: '/dashboard' }
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.path}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group inline-flex items-center text-slate-500 hover:text-orange-400 text-xs sm:text-sm font-medium transition-colors duration-200 text-left"
                  >
                    <span className="group-hover:translate-x-1 transition-all duration-200 underline underline-offset-[3px] decoration-slate-500/60 group-hover:decoration-orange-400/80">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-slate-200 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">Legal</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {[
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms & Conditions', path: '/terms' },
                { label: 'Refund Policy', path: '/refund' },
                { label: 'Cookie Policy', path: '/cookie' }
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.path}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group inline-flex items-center text-slate-500 hover:text-orange-400 text-xs sm:text-sm font-medium transition-colors duration-200 text-left"
                  >
                    <span className="group-hover:translate-x-1 transition-all duration-200 underline underline-offset-[3px] decoration-slate-500/60 group-hover:decoration-orange-400/80">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-300/20 pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-600 text-center sm:text-left">
          <span>© {new Date().getFullYear()} RentAll Platform. All rights reserved.</span>
          <span className="flex items-center justify-center gap-1">Built with <span className="text-orange-500">♥</span> for professionals</span>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
