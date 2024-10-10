import { Route, Routes as RouterRoutes } from 'react-router-dom';

import { SignInPage } from '@frontend/modules/auth/pages/SignInPage';
import { SignUpPage } from '@frontend/modules/auth/pages/SignUpPage';
import { HomePage } from '@frontend/modules/home/pages/HomePage';
import { NotFoundPage } from '@frontend/shared/navigation/pages/NotFoundPage';

import { route } from './route';

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path={route.home()} element={<HomePage />} />
      <Route path={route.signIn()} element={<SignInPage />} />
      <Route path={route.signUp()} element={<SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </RouterRoutes>
  );
};
