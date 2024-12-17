import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@frontend/context/auth/auth-core';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { Routes } from '@frontend/routes/routes.ts';
import { useProtectedRouteStore } from '@frontend/routes/useProtectedRouteStore.ts';

export const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();
  const showToast = useCustomToast();
  const { setBacklink } = useProtectedRouteStore();

  useEffect(() => {
    if (!user) {
      showToast({
        title: 'Vyžadováno přihlášení (registrace)',
        description: 'Pro pokračování na požadovanou stránku se přihlaste.',
        status: 'warning',
      });
      const path = `${location.pathname}${location.search}`;
      setBacklink(path);
    }
  }, [user, location, setBacklink, showToast]);

  if (!user) {
    return <Navigate to={Routes.logIn} replace />;
  }

  return <Outlet />;
};
