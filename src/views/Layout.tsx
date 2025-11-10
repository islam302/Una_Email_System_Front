import { Outlet } from "react-router-dom";
import Navbar from "../components/website-navbar";
import Footer from "../components/website-footer";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

const RootLayout = () => {
  const [dir, setDir] = useState<"ltr" | "rtl">(
    i18n.language === "en" ? "ltr" : "rtl"
  );

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
    <div className="root-layout" dir={dir}>
      <Navbar />
      <main className="w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
