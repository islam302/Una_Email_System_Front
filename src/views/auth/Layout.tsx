import { Outlet } from "react-router-dom";
import AuthNavbar from "../../components/auth-navbar";

const AuthLayout = () => {
  return (
    <div className="root-layout">
      <AuthNavbar />
      <div className="flex flex-row justify-between h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
