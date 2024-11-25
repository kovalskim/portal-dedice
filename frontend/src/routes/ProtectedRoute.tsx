import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@frontend/context/auth';
import { Routes } from '@frontend/routes/routes.ts';
import { useProtectedRouteStore } from '@frontend/routes/useProtectedRouteStore.ts';

export const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { setBacklink } = useProtectedRouteStore();

  if (!user) {
    const path = `${location.pathname}${location.search}`;
    //localStorage.setItem(BACKLINK_KEY, path);
    setBacklink(path);
    return <Navigate to={Routes.logIn} replace />;
  }

  return <Outlet />;
};
