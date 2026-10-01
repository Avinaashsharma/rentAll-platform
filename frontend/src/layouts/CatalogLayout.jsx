import React from 'react';
import { useAuth } from '../context/AuthContext';
import PublicLayout from './PublicLayout';
import CustomerLayout from './CustomerLayout';
import Spinner from '../components/ui/Spinner';

/**
 * Layout wrapper for catalog routes that adapts to auth state:
 * - Guest → PublicLayout (public navbar + footer)
 * - Authenticated → CustomerLayout (sidebar + header)
 *
 * Both layouts render <Outlet />, so child routes work identically.
 */
const CatalogLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <CustomerLayout /> : <PublicLayout />;
};

export default CatalogLayout;
