/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import {
  Navigate,
  Route,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";

// const HomePage = lazy(() => import("../views"));
const RootLayout = lazy(() => import("../views/Layout"));
const NotFoundPage = lazy(() => import("../views/errors/404-NotFound"));
const LoginPage = lazy(() => import("../views/auth/pages/Login"));
const AuthLayout = lazy(() => import("../views/auth/Layout"));
const DashboardPage = lazy(() => import("../views/dashboard"));
const DashboardLayout = lazy(() => import("../views/dashboard/Layout"));
const PagesLayout = lazy(() => import("../views/dashboard/pages/Layout"));
const ForbiddenPage = lazy(() => import("../views/errors/403-Forbidden"));
const ErrorHandler = lazy(() => import("../views/errors/500-Server"));
const RedirectPage = lazy(() => import("../views/middlewares/307-Redirect"));
const ForgetPasswordPage = lazy(
  () => import("../views/auth/pages/ForgetPassword")
);
const ResetPasswordPage = lazy(
  () => import("../views/auth/pages/ResetPassword")
);
const SuccessPage = lazy(() => import("../views/events/Success"));
const FailedPage = lazy(() => import("../views/events/Failed"));
const SendEmailPage = lazy(() => import("../views/dashboard/pages/SendEmail"));
const RecipientListPage = lazy(
  () => import("../views/dashboard/pages/Recipient/ListRecipient/RecipientList")
);
const EmailTemplatePage = lazy(
  () => import("../views/dashboard/pages/Services/EmailTemplate")
);
const SendGroupPage = lazy(
  () => import("../views/dashboard/pages/SendEmail/SendforGroup")
);
const SendListPage = lazy(
  () => import("../views/dashboard/pages/SendEmail/SendforList")
);
const UsersListPage = lazy(
  () => import("../views/dashboard/pages/Users/UsersList")
);
const SingleRecipientListPage = lazy(
  () =>
    import(
      "../views/dashboard/pages/Recipient/SingleRecipient/SingleRecipientList"
    )
);
const GroupListPage = lazy(
  () => import("../views/dashboard/pages/Groups/GroupList")
);
const SingleGroupListPage = lazy(
  () => import("../views/dashboard/pages/Groups/SingleGroupList")
);
const AmountLogPage = lazy(
  () => import("../views/dashboard/pages/Users/AmountLog")
);
const EmailDataPage = lazy(
  () => import("../views/dashboard/pages/Log/EmailData")
);
const SingleEmailLogPage = lazy(
  () => import("../views/dashboard/pages/Log/SingleEmailData")
);

import {
  AuthenticatedRoute,
  GuestRoute,
  SuperAuthenticatedRoute,
} from "../views/auth/ProtectedRoute";
import { ThemesControlPage } from "@/views/dashboard/pages/Themes";

const routers = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />} errorElement={<ErrorHandler />}>
        <Route index element={<Navigate to={"/auth/login"} />} />
      </Route>
      <Route
        path="/auth"
        element={<AuthLayout />}
        errorElement={<ErrorHandler />}
      >
        <Route index element={<Navigate to={"/login"} />} />
        <Route
          path="login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="forget-password"
          element={
            <GuestRoute>
              <ForgetPasswordPage />
            </GuestRoute>
          }
        />
        <Route
          path="reset-password"
          element={
            <GuestRoute>
              <ResetPasswordPage />
            </GuestRoute>
          }
        />
      </Route>
      <Route
        path="/dashboard"
        element={
          <AuthenticatedRoute>
            <DashboardLayout />
          </AuthenticatedRoute>
        }
        errorElement={<ErrorHandler />}
      >
        <Route index element={<Navigate to={"/dashboard/home"} />} />
        <Route path="home" element={<DashboardPage />} />
        <Route path="themes" element={<ThemesControlPage />} />
        <Route path="send" element={<PagesLayout />}>
          <Route index element={<Navigate to={"user"} replace />} />
          <Route path="user" element={<SendEmailPage />} />
          <Route path="list" element={<SendListPage />} />
          <Route path="group" element={<SendGroupPage />} />
        </Route>
        <Route
          path="recipient/"
          element={<PagesLayout />}
          errorElement={<ErrorHandler />}
        >
          <Route index element={<RecipientListPage />} />
          <Route path=":id" element={<SingleRecipientListPage />} />
        </Route>
        <Route
          path="groups/"
          element={<PagesLayout />}
          errorElement={<ErrorHandler />}
        >
          <Route index element={<GroupListPage />} />
          <Route path=":id" element={<SingleGroupListPage />} />
        </Route>
        <Route
          path="users/"
          element={
            <SuperAuthenticatedRoute>
              <PagesLayout />
            </SuperAuthenticatedRoute>
          }
          errorElement={<ErrorHandler />}
        >
          <Route index element={<UsersListPage />} />
          <Route path="amount" element={<AmountLogPage />} />
        </Route>
        <Route
          path="logs/"
          element={<PagesLayout />}
          errorElement={<ErrorHandler />}
        >
          <Route
            index
            element={<Navigate to="/dashboard/logs/email" replace />}
          />
          <Route path="email" element={<EmailDataPage />} />
          <Route path="email/:id" element={<SingleEmailLogPage />} />
        </Route>
        <Route
          path="services/"
          element={<PagesLayout />}
          errorElement={<ErrorHandler />}
        >
          <Route index element={<Navigate to={"/templates"} />} />
          <Route path="templates" element={<EmailTemplatePage />} />
        </Route>
      </Route>
      {/* Payment Response */}
      <Route path="/payment/success" element={<SuccessPage />} />
      <Route path="/payment/failed" element={<FailedPage />} />
      {/* 307 Redirect */}
      <Route path="/307" element={<RedirectPage />} />
      {/* 403 Forbidden */}
      <Route path="/403" element={<ForbiddenPage />} />
      {/* Page Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

export default routers;
