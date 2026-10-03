import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore API errors during logout; always clear local state
    } finally {
      setUser(null);
    }
  }, []);

  // Restore session on first mount by calling /me
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const data = await getMe();
        if (!cancelled) setUser(data.data.user);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    restoreSession();

    // StrictMode double-mount: prevent the first (stale) call from
    // updating state after React unmounts and remounts the component.
    return () => { cancelled = true; };
  }, []);

  // Listen for forced session expiry from Axios interceptor
  useEffect(() => {
    const handleSessionExpired = () => setUser(null);
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  const value = {
    user,
    setUser,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isCustomer: user?.role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// oxlint-disable-next-line react/only-export-components -- useAuth is intentionally co-located with its context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
