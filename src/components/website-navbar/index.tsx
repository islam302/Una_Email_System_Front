/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "universal-cookie";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileBtn from "../dashboard-navbar/ProfileBtn";
import {
  SoArrowDown,
  SoMailAdd,
  SoXmarkCircle,
  SoLanguageCircle,
} from "solom-icon";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import Logo from "../../assets/logo_icon.svg";
import { useTranslation } from "@/i18n/hooks";

const Navbar = () => {
  const { t, i18n } = useTranslation("layout");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const [showMenu, setShowMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const location = useLocation();

  const cookie = new Cookies();
  const token = cookie.get("userLoggedES");
  const isLoggedIn = token ? false : true;

  const fallbackLinks = [
    { to: "landing", text: currentLng === "ar" ? "الرئيسية" : "Home" },
    { to: "about", text: currentLng === "ar" ? "من نحن" : "About Us" },
    { to: "services", text: currentLng === "ar" ? "الخدمات" : "Services" },
    { to: "contact", text: currentLng === "ar" ? "اتصل بنا" : "Contact Us" },
  ];

  useEffect(() => {
    setShowMenu(false);
    setIsMenuOpen(false);
    document.body.classList.remove("menu-open");
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setScrolling(currentScrollPos > 50);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const toggleMenu = () => {
    setShowMenu((prev) => {
      document.body.classList.toggle("menu-open", !prev);
      return !prev;
    });
  };

  const handleNavLinkClick = () => {
    setShowMenu(false);
    setIsMenuOpen(false);
    document.body.classList.remove("menu-open");
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    setIsMenuOpen(false);
    setShowMenu(false);
    document.body.classList.remove("menu-open");
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const menu = document.querySelector(".mobile-menu");
      const langMenu = document.querySelector(".lang-menu");
      if (
        menu &&
        !menu.contains(event.target) &&
        langMenu &&
        !langMenu.contains(event.target)
      ) {
        setShowMenu(false);
        setIsMenuOpen(false);
        document.body.classList.remove("menu-open");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu, isMenuOpen]);

  return (
    <header
      className={`fixed top-0 w-full z-[9999] transition-all duration-200 ${
        scrolling ? "bg-white shadow-md" : "bg-transparent"
      }`}
      style={{ height: "78px" }}
      dir={dir}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div
          className={`flex ${
            currentLng === "ar" ? "flex-row" : "flex-row"
          } justify-between items-center h-full`}
        >
          <ScrollLink
            onClick={() => scroll.scrollToTop()}
            to="/"
            className="cursor-pointer"
            aria-label={t("homeAriaLabel")}
          >
            <img className="w-12" src={Logo} alt={t("logoAlt")} />
          </ScrollLink>
          <nav className="hidden md:block">
            <ul
              className={`flex ${
                currentLng === "ar" ? "flex-row" : "flex-row"
              } gap-5`}
            >
              {fallbackLinks.map((link) => (
                <li key={link.to}>
                  <ScrollLink
                    className={`text-base font-medium hover:border-b-2 border-primary transition-colors cursor-pointer pb-1 duration-300 hover:ease-in ${
                      scrolling ? "text-gray-800" : "text-primary"
                    }`}
                    activeClass="text-primary border-b-2 border-primary"
                    to={link.to}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                  >
                    {link.text}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </nav>
          <div
            className={`hidden md:flex ${
              currentLng === "ar" ? "flex-row" : "flex-row"
            } items-center gap-3`}
          >
            <div className="relative">
              <div
                className="bg-accent rounded-full p-2 cursor-pointer hover:bg-accent transition-colors"
                title={t("changeLanguage", { defaultValue: "Change Language" })}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <SoLanguageCircle className="text-primary w-6 h-6" />
              </div>
              {isMenuOpen && (
                <div
                  className={`absolute top-10 ${
                    currentLng === "ar" ? "right-0" : "left-0"
                  } bg-white shadow-md rounded-md p-2 z-10 lang-menu`}
                >
                  <ul className="text-sm">
                    <li
                      className="p-2 cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => changeLanguage("en")}
                    >
                      English
                    </li>
                    <li
                      className="p-2 cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => changeLanguage("ar")}
                    >
                      العربية
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {isLoggedIn ? (
              <Link
                to="/auth/login"
                className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                <span>{t("navbar.startNow")}</span>
                <SoMailAdd className="w-5 h-5" />
              </Link>
            ) : (
              <ProfileBtn />
            )}
          </div>
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg bg-primary text-white"
            aria-label={t("menuAriaLabel")}
          >
            {showMenu ? (
              <SoXmarkCircle className="w-6 h-6" />
            ) : (
              <SoArrowDown className="w-6 h-6" />
            )}
          </button>
          {showMenu && (
            <div className="fixed inset-0 bg-black/50 md:hidden z-50 mobile-menu">
              <div
                className={`absolute ${
                  currentLng === "ar" ? "right-0" : "left-0"
                } top-0 w-3/4 h-full bg-white p-6`}
              >
                <nav>
                  <ul className="space-y-6">
                    {fallbackLinks.map((link) => (
                      <li key={link.to}>
                        <ScrollLink
                          className={`block text-gray-800 hover:text-primary text-lg ${
                            currentLng === "ar" ? "text-right" : "text-left"
                          }`}
                          to={link.to}
                          smooth={true}
                          duration={500}
                          onClick={handleNavLinkClick}
                        >
                          {link.text}
                        </ScrollLink>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-12">
                    {isLoggedIn ? (
                      <Link
                        to="/auth/login"
                        className={`flex items-center justify-center gap-2 bg-transparent hover:bg-primary border-2 border-primary text-primary hover:text-white px-6 py-3 rounded-lg transition-colors`}
                        onClick={handleNavLinkClick}
                      >
                        <span>{t("startNow")}</span>
                        <SoMailAdd className="w-5 h-5" />
                      </Link>
                    ) : (
                      <ProfileBtn />
                    )}
                    <div className="mt-4 relative">
                      <div
                        className="bg-accent rounded-full p-2 cursor-pointer hover:bg-accent transition-colors mx-auto w-fit"
                        title={t("changeLanguage", {
                          defaultValue: "Change Language",
                        })}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                      >
                        <SoLanguageCircle className="text-primary w-6 h-6" />
                      </div>
                      {isMenuOpen && (
                        <div
                          className={`absolute ${
                            currentLng === "ar" ? "right-0" : "left-0"
                          } top-10 bg-white shadow-md rounded-md p-2 z-10 lang-menu`}
                        >
                          <ul className="text-sm">
                            <li
                              className="p-2 cursor-pointer hover:bg-gray-100 rounded"
                              onClick={() => changeLanguage("en")}
                            >
                              English
                            </li>
                            <li
                              className="p-2 cursor-pointer hover:bg-gray-100 rounded"
                              onClick={() => changeLanguage("ar")}
                            >
                              العربية
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
