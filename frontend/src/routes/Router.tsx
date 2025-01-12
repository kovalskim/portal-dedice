import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { App } from '@frontend/App.tsx';
import { MainLayout } from '@frontend/components/layouts/MainLayout';
import { EmailConfirmationPage } from '@frontend/pages/authPages/EmailConfirmationPage';
import { EmailVerificationPage } from '@frontend/pages/authPages/EmailVerificationPage';
import { ForgottenPasswordPage } from '@frontend/pages/authPages/ForgottenPasswordPage.tsx';
import { LogInPage } from '@frontend/pages/authPages/LogInPage';
import { NewPasswordPage } from '@frontend/pages/authPages/NewPasswordPage.tsx';
import { SignUpPage } from '@frontend/pages/authPages/SignUpPage';
import { BlogDetailPage } from '@frontend/pages/blog/detail/BlogDetailPage';
import { BlogEditorPage } from '@frontend/pages/blog/editor/BlogEditorPage';
import { BlogPage } from '@frontend/pages/blog/overview/BlogPage';
import { EducatorPage } from '@frontend/pages/educator/EducatorPages.tsx';
import { ErrorPage } from '@frontend/pages/errorPages/ErrorPage.tsx';
import { NotFoundPage } from '@frontend/pages/errorPages/NotFoundPage';
import { HomePage } from '@frontend/pages/home/HomePage';
import { NotaryPaymentCalculationPage } from '@frontend/pages/notaryPaymentCalculation/NotaryPaymentCalculationPage.tsx';
import { AssetsPage } from '@frontend/pages/proceeding/assets/AssetsPage';
import { ProceedingChat } from '@frontend/pages/proceeding/chat/ProceedingChat.tsx';
import { FilesPage } from '@frontend/pages/proceeding/files/FilesPage.tsx';
import { ProceedingOverviewPage } from '@frontend/pages/proceeding/overview/ProceedingOverviewPage';
import { ProceedingParticipants } from '@frontend/pages/proceeding/participants/ProceedingParticipants';
import { ProceedingLayout } from '@frontend/pages/proceeding/ProceedingLayout';
import { ProfilePage } from '@frontend/pages/profile/ProfilePage.tsx';
import { UserDashboard } from '@frontend/pages/userDashboard/UserDashboard';
import { UsersPage } from '@frontend/pages/users/UsersPage.tsx';
import { ProtectedRoute } from '@frontend/routes/ProtectedRoute.tsx';
import { Routes } from '@frontend/routes/routes.ts';

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
              path={Routes.notaryPaymentCalculation}
              element={<NotaryPaymentCalculationPage />}
            />

            <Route path={Routes.blog} element={<BlogPage />} />
            <Route path={`${Routes.blog}/:id`} element={<BlogDetailPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path={`${Routes.blog}/new`} element={<BlogEditorPage />} />
              <Route
                path={`${Routes.blog}/edit/:id`}
                element={<BlogEditorPage />}
              />
            </Route>
            <Route
              path={Routes.forgottenPassword}
              element={<ForgottenPasswordPage />}
            />
            <Route path={Routes.newPassword} element={<NewPasswordPage />} />
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
                  element={<ProceedingOverviewPage />}
                />
                <Route
                  path={Routes.proceedingParticipants}
                  element={<ProceedingParticipants />}
                />
                <Route
                  path={Routes.proceedingChat}
                  element={<ProceedingChat />}
                />
                <Route path={Routes.proceedingFiles} element={<FilesPage />} />
                <Route
                  path={Routes.proceedingAssets}
                  element={<AssetsPage />}
                />
                <Route
                  path={Routes.proceedingSettings}
                  element={<NotFoundPage />}
                />
              </Route>

              <Route path={Routes.users} element={<UsersPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Route>,
    ),
  );
};
