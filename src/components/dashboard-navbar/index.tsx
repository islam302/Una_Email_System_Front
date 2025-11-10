import "./Navbar.style.css";
import { Link, useLocation } from "react-router-dom";
import {
  SoArrowLeft,
  SoBell,
  SoBubbleChat,
  SoCalendar,
  SoClock2,
  SoLanguageCircle,
  SoSquareArrowDownRight,
  SoUser,
  SoWallet,
} from "solom-icon";
import { useSelector } from "react-redux";
import { clearToken, tokenSelector } from "../../app/functions/token";
import { toast } from "react-fox-toast";
import Cookies from "universal-cookie";
import { routeMap } from "../../data/routesMap";
import { useEffect, useState } from "react";
import ConfirmLogoutModal from "../ui/ConfirmLogoutModal";
import { useAppDispatch } from "@/app/store";
import { useTranslation } from "@/i18n/hooks";
import { cn } from "@/lib/utils";

function isValidRoute(path: string): path is keyof typeof routeMap {
  return path in routeMap;
}

const DashboardNavbar = () => {
  const { t, i18n } = useTranslation("navbar");

  const currentLanguage = i18n.language;

  const cookie = new Cookies();
  const location = useLocation();
  const { username } = useSelector(tokenSelector);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathParts = location.pathname.split("/").filter(Boolean);
  const dispatch = useAppDispatch();

  const breadcrumbs = pathParts.map((_part, index) => {
    const path = `/${pathParts.slice(0, index + 1).join("/")}`;

    if (!isValidRoute(path)) {
      return null;
    }

    const route = routeMap[path];

    return (
      <div key={path} className="flex items-center gap-1">
        {index > 0 && (
          <SoArrowLeft
            className={cn(
              "text-white w-4 h-4",
              currentLanguage === "en" ? "rotate-180" : ""
            )}
          />
        )}
        <route.icon className="text-white w-5 h-5 max-sm:w-4 max-sm:h-4" />
        <Link
          to={route.path}
          className="text-base text-white font-medium max-sm:text-sm"
        >
          {t(route.label)}
        </Link>
      </div>
    );
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(currentLanguage, {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLanguage, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGreetingMessage = (date: Date) => {
    const hour = date.getHours();
    if (hour < 12) {
      return t("msg.morning");
    } else if (hour < 18) {
      return t("msg.nice");
    } else {
      return t("msg.evening");
    }
  };

  const handleLogout = () => {
    dispatch(clearToken());
    cookie.remove("userLoggedES");
    cookie.remove("elNamerEmailSender");

    toast.success(t("msg.logout"));
    setTimeout(() => {
      window.location.replace("/");
    }, 50);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    setIsMenuOpen(false);
  };

  return (
    <nav className="my-[1.65rem] w-full space-y-6">
      <div
        className={cn(
          "flex flex-row items-center justify-between  max-sm:w-full",
          currentLanguage === "en" ? "ml-[3%] pr-4" : "mr-[3%] pl-4"
        )}
      >
        <div className="flex flex-row items-center justify-between gap-5 max-sm:flex-col max-sm:gap-0 max-sm:w-full">
          <div className="flex flex-row items-center justify-center gap-2 max-sm:gap-1 max-sm:w-full max-sm:justify-start">
            <div className="bg-accent rounded-full p-1">
              <SoUser className="text-primary w-5 h-5 max-sm:w-4 max-sm:h-4" />
            </div>
            <h3 className="text-sm text-primary font-medium max-sm:text-xs">
              {getGreetingMessage(currentTime)}, {username}
            </h3>
          </div>
          <div className="hidden flex-row items-center justify-center gap-2 max-sm:gap-1 max-sm:w-full max-sm:justify-start">
            <div className="bg-accent rounded-full p-1">
              <SoWallet className="text-primary w-5 h-5 max-sm:w-4 max-sm:h-4" />
            </div>
            <h3 className="text-sm text-primary font-medium max-sm:text-xs">
              {/* Credit: {user.balance} */}
            </h3>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center max-sm:w-1/3">
          <div className="flex flex-row items-center justify-between gap-5 max-sm:gap-0">
            <div className="relative">
              <div
                className="bg-accent rounded-full p-2 cursor-pointer"
                title="Change Language"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <SoLanguageCircle className="text-primary w-6 h-6" />
              </div>
              {isMenuOpen && (
                <div className="absolute top-10 right-0 bg-white shadow-md rounded-md p-2 z-10">
                  <ul>
                    <li
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => changeLanguage("en")}
                    >
                      English
                    </li>
                    <li
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => changeLanguage("ar")}
                    >
                      العربية
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div
              className="bg-accent rounded-full p-2 cursor-pointer hidden"
              title="Notifications"
            >
              <SoBell className="text-primary w-6 h-6" />
            </div>
            <div
              className="bg-accent rounded-full p-2 cursor-pointer hidden"
              title="Support"
            >
              <SoBubbleChat className="text-primary w-6 h-6" />
            </div>
            <div
              className="bg-accent rounded-full p-2 cursor-pointer"
              title="Logout"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <SoSquareArrowDownRight className="text-primary w-6 h-6 max-sm:w-5 max-sm:h-5" />
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "bg-primary flex flex-row items-center justify-between py-4",
          currentLanguage === "en" ? "pr-4" : "pl-4"
        )}
      >
        <div
          className={cn(
            "flex flex-row items-center justify-between gap-1",
            currentLanguage === "en" ? "ml-[3%]" : "mr-[3%]"
          )}
        >
          {breadcrumbs}
        </div>
        <div className="flex flex-row items-center justify-center gap-3 max-sm:hidden">
          <div className="flex flex-row items-center justify-center gap-2">
            <SoCalendar className="text-white w-5 h-5" />
            <h3 className="text-base text-white font-medium">
              {t("date")}: {formatDate(currentTime)}
            </h3>
          </div>
          <div className="hidden flex-row items-center justify-center gap-2">
            <SoClock2 className="text-white w-5 h-5" />
            <h3 className="text-base text-white font-medium">
              {t("time")}: {formatTime(currentTime)}
            </h3>
          </div>
        </div>
      </div>
      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default DashboardNavbar;
