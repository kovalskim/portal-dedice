import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { App } from '@frontend/App.tsx';
import { MainLayout } from '@frontend/components';
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
} from '@frontend/pages';
import { ForgottenPasswordPage } from '@frontend/pages/authPages/ForgottenPasswordPage.tsx';
import { NewPasswordPage } from '@frontend/pages/authPages/NewPasswordPage.tsx';
import { EducatorPage } from '@frontend/pages/educator/EducatorPages.tsx';
import { ErrorPage } from '@frontend/pages/errorPages/ErrorPage.tsx';
import { ProceedingChat } from '@frontend/pages/proceeding/chat/ProceedingChat.tsx';
import { ProceedingsParticipants } from '@frontend/pages/proceeding/participants/ProceedingsParticipants.tsx';
import { ProfilePage } from '@frontend/pages/profile/ProfilePage.tsx';
import { ProtectedRoute } from '@frontend/routes/ProtectedRoute.tsx';
import { Routes } from '@frontend/routes/routes.ts';

export const getRouter = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<App />}>
        <Route element={<MainLayout />}>
          <Route errorElement={<ErrorPage />}>
            <Route path={Routes.home} element={<HomePage />} />
            <Route path={Routes.signUp} element={<SignUpPage />} />
            <Route
              path={Routes.emailConfirmation}
              element={<EmailConfirmationPage />}
            />
            <Route
              path={Routes.emailVerification}
              element={<EmailVerificationPage />}
            />
            <Route
              path={Routes.forgottenPassword}
              element={<ForgottenPasswordPage />}
            />
            <Route path={Routes.logIn} element={<LogInPage />} />
            <Route path={Routes.newPassword} element={<NewPasswordPage />} />

            <Route path={Routes.educator} element={<EducatorPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path={Routes.profile} element={<ProfilePage />} />
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
                <Route
                  path={Routes.proceedingFiles}
                  element={<NotFoundPage />}
                />
                <Route
                  path={Routes.proceedingAssets}
                  element={<NotFoundPage />}
                />
                <Route
                  path={Routes.proceedingSettings}
                  element={<NotFoundPage />}
                />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Route>,
    ),
  );
};
