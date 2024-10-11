import { Route, Routes as RouterRoutes } from 'react-router-dom';

import { MainLayout } from './components';
import { HomePage, NotFoundPage, SignInPage, SignUpPage } from './pages';
import { Routes } from './routes';

export const Router = () => {
  return (
    <RouterRoutes>
      <Route element={<MainLayout />}>
        <Route path={Routes.home} element={<HomePage />} />
        <Route path={Routes.signIn} element={<SignInPage />} />
        <Route path={Routes.signUp} element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </RouterRoutes>
  );
};
