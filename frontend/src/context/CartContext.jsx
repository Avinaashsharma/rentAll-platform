import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as cartApi from '../services/cartService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  const computeItemCount = (cartData) => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((sum, entry) => sum + entry.quantity, 0);
  };

  const updateCartState = (cartData) => {
    setCart(cartData);
    setItemCount(computeItemCount(cartData));
  };

  // Fetch cart on login / mount
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      updateCartState(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await cartApi.getCart();
      updateCartState(res.data.data.cart);
    } catch {
      updateCartState(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (itemId, quantity = 1) => {
    const res = await cartApi.addCartItem(itemId, quantity);
    updateCartState(res.data.data.cart);
    return res.data.data.cart;
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await cartApi.updateCartItemQuantity(itemId, quantity);
    updateCartState(res.data.data.cart);
    return res.data.data.cart;
  };

  const removeItem = async (itemId) => {
    const res = await cartApi.removeCartItem(itemId);
    updateCartState(res.data.data.cart);
    return res.data.data.cart;
  };

  const clearCart = async () => {
    const res = await cartApi.clearCart();
    updateCartState(res.data.data.cart);
    return res.data.data.cart;
  };

  const isInCart = (itemId) => {
    return cart?.items?.some(
      (entry) => entry.item?._id === itemId || entry.item === itemId
    ) ?? false;
  };

  const value = {
    cart,
    isLoading,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    fetchCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// oxlint-disable-next-line react/only-export-components -- useCart is intentionally co-located with its context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
