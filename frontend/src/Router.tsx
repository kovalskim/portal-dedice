import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { ErrorPage } from './pages/errorPages/ErrorPage';
import { ProceedingsParticipants } from './pages/proceedings/participants/ProceedingsParticipants';
import { App } from './App';
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

export const getRouter = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<App />}>
        <Route element={<MainLayout />}>
          <Route errorElement={<ErrorPage />}>
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
              <Route
                path={Routes.proceedingsFiles}
                element={<NotFoundPage />}
              />
              <Route path={Routes.proceedingsChat} element={<NotFoundPage />} />
              <Route
                path={Routes.proceedingsAssets}
                element={<NotFoundPage />}
              />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Route>,
    ),
  );
};
