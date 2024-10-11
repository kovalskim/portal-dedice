import { Route, Routes as RouterRoutes } from 'react-router-dom';

import { MainLayout } from './components';
import { HomePage, NotFoundPage, SignInPage, SignUpPage } from './pages';
import { route } from './route';

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route element={<MainLayout />}>
        <Route path={route.home()} element={<HomePage />} />
        <Route path={route.signIn()} element={<SignInPage />} />
        <Route path={route.signUp()} element={<SignUpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </RouterRoutes>
  );
};
