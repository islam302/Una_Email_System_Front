import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

interface IProps {
  isAllowed: boolean;
  redirectPath: string;
  children: ReactNode;
  data?: unknown;
}

const ProtectedRoute = ({
  isAllowed,
  redirectPath,
  children,
  data,
}: IProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} state={data} replace />;
  }
  return <>{children}</>;
};

export const SuperAuthenticatedRoute = ({
  children,
}: {
  children: ReactNode;
}) => {
  const role = new Cookies().get("elNamerEmailSender");

  const isLoggedIn =
    !!role &&
    !!(role === "$2a$08$reWdPwXPPmJ055PbpEZIkucsxwxC63QOAgl9kt5vL/GL7xvi4L5Gu");

  return (
    <ProtectedRoute isAllowed={isLoggedIn} redirectPath="/auth/login">
      {children}
    </ProtectedRoute>
  );
};

export const AuthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const role = new Cookies().get("elNamerEmailSender");

  const isLoggedIn =
    !!role &&
    !!(
      role === "$2a$08$5xDzi.dDP3yNLJ5cVKOim.J7YcmaTIhEaq.yOe9Upc5qSRGLefLxG" ||
      role === "$2a$08$reWdPwXPPmJ055PbpEZIkucsxwxC63QOAgl9kt5vL/GL7xvi4L5Gu"
    );

  return (
    <ProtectedRoute isAllowed={isLoggedIn} redirectPath="/auth/login">
      {children}
    </ProtectedRoute>
  );
};

export const GuestRoute = ({ children }: { children: ReactNode }) => {
  const role = new Cookies().get("elNamerEmailSender");

  return (
    <ProtectedRoute isAllowed={!role} redirectPath="/dashboard/home">
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
