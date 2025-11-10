import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "../../components/dashboard-sidebar";
import DashboardNavbar from "../../components/dashboard-navbar";
import { useEffect, useState } from "react";
import i18n from "@/i18n";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const [dir, setDir] = useState<"ltr" | "rtl">(
    i18n.language === "en" ? "ltr" : "rtl"
  );

  const nav = useLocation();
  const location =
    nav.pathname.startsWith("/dashboard/logs/email/") ||
    nav.pathname.startsWith("/dashboard/users/");

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setDir(lng.startsWith("ar") ? "rtl" : "ltr");
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  return (
    <div className="root-layout bg-[#E8F0F714]" dir={dir}>
      <div className="flex flex-row w-full h-full">
        <DashboardSidebar />
        <div
          className={`container mx-0 px-0 w-full max-w-full ${
            location && "overflow-x-auto"
          }`}
        >
          <DashboardNavbar />
          <div
            className={cn(
              "container mx-0 px-0 w-full max-w-full",
              dir === "rtl"
                ? "pl-12 mr-[2%] max-sm:pr-2"
                : "pr-12 ml-[2%] max-sm:pl-2"
            )}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
