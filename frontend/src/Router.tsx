import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { ForgottenPasswordPage } from '@frontend/pages/authPages/ForgottenPasswordPage.tsx';
import { NewPasswordPage } from '@frontend/pages/authPages/NewPasswordPage.tsx';
import { EducatorPage } from '@frontend/pages/educator/EducatorPages.tsx';
import { ProceedingsParticipants } from '@frontend/pages/proceeding/participants/ProceedingsParticipants';
import { ProfilePage } from '@frontend/pages/profile/ProfilePage.tsx';

import { ErrorPage } from './pages/errorPages/ErrorPage';
import { ProceedingChat } from './pages/proceeding/chat/ProceedingChat';
import { App } from './App';
import { MainLayout } from './components';
import {
  EmailConfirmationPage,
  EmailVerificationPage,
  HomePage,
  LogInPage,
  NotFoundPage,
  ProceedingLayout,
  ProceedingsOverviewPage,
  SignUpPage,
  UserDashboard,
} from './pages';
import { Routes } from './routes';

export const getRouter = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<App />}>
        <Route element={<MainLayout />}>
          <Route errorElement={<ErrorPage />}>
            <Route path={Routes.home} element={<HomePage />} />
            <Route path={Routes.logIn} element={<LogInPage />} />
            <Route path={Routes.educator} element={<EducatorPage />} />
            <Route
              path={Routes.forgottenPassword}
              element={<ForgottenPasswordPage />}
            />
            <Route path={Routes.newPassword} element={<NewPasswordPage />} />
            <Route path={Routes.signUp} element={<SignUpPage />} />
            <Route path={Routes.profile} element={<ProfilePage />} />
            <Route
              path={Routes.emailConfirmation}
              element={<EmailConfirmationPage />}
            />
            <Route
              path={Routes.emailVerification}
              element={<EmailVerificationPage />}
            />
            <Route path={Routes.proceedings} element={<UserDashboard />} />
            <Route element={<ProceedingLayout />}>
              <Route
                path={Routes.proceedingOverview}
                element={<ProceedingsOverviewPage />}
              />
              <Route
                path={Routes.proceedingParticipants}
                element={<ProceedingsParticipants />}
              />
              <Route
                path={Routes.proceedingChat}
                element={<ProceedingChat />}
              />
              <Route path={Routes.proceedingFiles} element={<NotFoundPage />} />
              <Route
                path={Routes.proceedingAssets}
                element={<NotFoundPage />}
              />
              <Route
                path={Routes.proceedingSettings}
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
