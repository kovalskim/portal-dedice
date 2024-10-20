import { Route, Routes as RouterRoutes } from 'react-router-dom';

import { ProceedingsParticipants } from './pages/proceedings/participants/ProceedingsParticipants';
import { MainLayout } from './components';
import {
  EmailConfirmationPage,
  EmailVerificationPage,
  HomePage,
  NotFoundPage,
  ProceedingsLayout,
  ProceedingsOverview,
  SignInPage,
  SignUpPage,
} from './pages';
import { Routes } from './routes';

export const Router = () => {
  return (
    <RouterRoutes>
      <Route element={<MainLayout />}>
        <Route path={Routes.home} element={<HomePage />} />
        <Route path={Routes.signIn} element={<SignInPage />} />
        <Route path={Routes.signUp} element={<SignUpPage />} />
        <Route
          path={Routes.emailConfirmation}
          element={<EmailConfirmationPage />}
        />
        <Route
          path={Routes.emailVerification}
          element={<EmailVerificationPage />}
        />
        <Route element={<ProceedingsLayout />}>
          <Route
            path={Routes.proceedingsOverview}
            element={<ProceedingsOverview />}
          />
          <Route
            path={Routes.proceedingsParticipants}
            element={<ProceedingsParticipants />}
          />
          <Route path={Routes.proceedingsFiles} element={<NotFoundPage />} />
          <Route path={Routes.proceedingsChat} element={<NotFoundPage />} />
          <Route path={Routes.proceedingsAssets} element={<NotFoundPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </RouterRoutes>
  );
};
