import "./Sidebar.style.css";
import Modal from "../elements/Modal";
import { useState, useEffect } from "react";
import LogoutImg from "../../assets/about.svg";
import { Link, useLocation } from "react-router-dom";
import {
  SoArrowDown,
  SoArrowLeft,
  SoArrowUp,
  SoCatalogue,
  SoCog6,
  SoEditTask,
  SoHome,
  SoMail,
  SoNote2,
  SoSend,
  SoUser,
  SoUserGroup2,
  SoUserList,
  SoUserMultiple,
  SoWallet,
  SoXmarkCircle,
} from "solom-icon";
import { useSelector } from "react-redux";
import { clearToken, tokenSelector } from "@/app/functions/token";
import { useAppDispatch } from "@/app/store";
import { useTranslation } from "@/i18n/hooks";
import { cn } from "@/lib/utils";

const DashboardSidebar = () => {
  const { t, i18n } = useTranslation("sidebar");

  const currentLanguage = i18n.language;

  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [openExpandable, setOpenExpandable] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { access, role } = useSelector(tokenSelector);
  const dispatch = useAppDispatch();

  const isAdmin = !!access && !!(role === "admin");

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleResize = () => {
    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
    if (isSmallScreen) {
      setCollapsed(true);
      document.body.classList.add("collapsed");
    } else {
      setCollapsed(false);
      document.body.classList.remove("collapsed");
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleExpandClick = () => {
    setCollapsed(!collapsed);
    document.body.classList.toggle("collapsed", !collapsed);
  };

  const handleLinkClick = (href: string, isLink?: boolean) => {
    if (href === "/auth/login") {
      openModal();
      return;
    }

    setActiveLink(href);

    if (isLink === false) {
      setOpenExpandable(openExpandable === href ? null : href);
    }
  };

  const handleLogout = () => {
    dispatch(clearToken());
  };

  const globalLinks = [
    {
      href: "/dashboard/home",
      icon: <SoHome />,
      label: "dashboard_home",
      isLink: true, // Direct link
    },
    {
      href: "#send",
      icon: <SoSend />,
      label: "send_email",
      isLink: false, // Expandable
      subLinks: [
        {
          href: "/dashboard/send/user",
          label: "send_to_user",
          icon: <SoUser />,
          isLink: true, // Direct link
        },
        {
          href: "/dashboard/send/list",
          label: "send_to_list",
          icon: <SoUserList />,
          isLink: true, // Direct link
        },
        {
          href: "/dashboard/send/group",
          label: "send_to_group",
          icon: <SoUserGroup2 />,
          isLink: true, // Direct link
        },
      ],
    },
    {
      href: "/dashboard/recipient/",
      icon: <SoUserGroup2 />,
      label: "recipient_list",
      isLink: true, // Expandable
    },
    {
      href: "/dashboard/groups/",
      icon: <SoUserList />,
      label: "group_list",
      isLink: false, // Expandable
    },
    {
      href: "/dashboard/services/templates",
      label: "templates",
      icon: <SoCatalogue />,
      isLink: true, // Direct link
    },
    ...(isAdmin
      ? [
          {
            href: "#admin",
            icon: <SoCog6 />,
            label: "system_management",
            isLink: false, // Expandable
            subLinks: [
              {
                href: "/dashboard/themes/",
                label: "themes",
                icon: <SoEditTask />,
                isLink: true, // Direct link
              },
              {
                href: "/dashboard/users/",
                label: "user_list",
                icon: <SoUserMultiple />,
                isLink: true, // Direct link
              },
              {
                href: "/dashboard/users/amount",
                label: "balance_log",
                icon: <SoWallet />,
                isLink: true, // Direct link
              },
              {
                href: "/dashboard/logs/email",
                label: "email_logs",
                icon: <SoNote2 />,
                isLink: true, // Direct link
              },
            ],
          },
        ]
      : [
          {
            href: "/dashboard/logs/email",
            label: "email_logs",
            icon: <SoNote2 />,
            isLink: true, // Direct link
          },
        ]),
  ];

  return (
    <>
      <nav
        className={cn(
          "w-full sidebar shadow-md",
          collapsed ? "collapsed" : "",
          currentLanguage === "en"
            ? "rounded-tr-md rounded-br-lg"
            : "rounded-tl-md rounded-bl-lg"
        )}
      >
        <div className="sidebar-top-wrapper">
          <div className="sidebar-top">
            <Link
              to="/dashboard/home"
              className="flex items-center justify-center mt-10"
            >
              <SoMail
                className={`text-white w-${collapsed ? "16" : "24"} h-${
                  collapsed ? "16" : "24"
                }`}
              />
            </Link>
          </div>
          <button
            className={cn(
              "expand-btn",
              currentLanguage === "en" ? "right-[-1rem]" : "left-[-1rem]"
            )}
            type="button"
            onClick={handleExpandClick}
          >
            <SoArrowLeft className="text-white w-6 h-6" />
          </button>
        </div>
        <div className="sidebar-links-wrapper">
          <div className="sidebar-links">
            {globalLinks.map(
              ({ href, icon, label, isLink = true, subLinks }, index) => (
                <ul key={index}>
                  <li className="mb-2">
                    <Link
                      to={href}
                      title={t(label)}
                      className={`tooltip ${
                        activeLink === href ? "active" : ""
                      }`}
                      onClick={(e) => {
                        if (href === "/auth/login") {
                          e.preventDefault();
                          handleLinkClick(href, isLink);
                        } else {
                          handleLinkClick(href, isLink);
                        }
                      }}
                    >
                      <div className="flex flex-row items-center gap-3 SoIcon">
                        {icon}
                        <span
                          className={`link duration-300 hide ${
                            activeLink === href ? "active" : ""
                          }`}
                        >
                          {t(label)}
                        </span>
                      </div>
                      {!isLink && subLinks && (
                        <button
                          type="button"
                          className="expandC-btn"
                          onClick={() => handleLinkClick(href, isLink)}
                        >
                          {openExpandable === href ? (
                            <SoArrowUp className="w-5 h-5" />
                          ) : (
                            <SoArrowDown className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </Link>
                    {!isLink && subLinks && openExpandable === href && (
                      <ul className="sub-links gap-y-0">
                        {subLinks.map((subLink, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subLink.href}
                              title={t(subLink.label)}
                              className={`tooltip SoIcon ${
                                activeLink === subLink.href ? "active" : ""
                              }`}
                              onClick={() =>
                                handleLinkClick(
                                  subLink.href,
                                  subLink.isLink ?? true
                                )
                              }
                            >
                              {subLink.icon}
                              <span
                                className={`link sub hide ${
                                  activeLink === subLink.href ? "active" : ""
                                }`}
                              >
                                {t(subLink.label)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                </ul>
              )
            )}
          </div>
        </div>
      </nav>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <div className="absolute top-[-20px] left-0">
          <div className="bg-[#E8F0F7] rounded-full p-1">
            <SoXmarkCircle
              className="w-6 h-6 cursor-pointer text-red-600"
              onClick={closeModal}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-5 pt-10 px-5">
          <img src={LogoutImg} alt="Logout" />
          <h3 className="text-xl text-black font-medium">
            هل انت متأكد من تسجيل خروجك؟
          </h3>
          <div
            onClick={() => handleLogout()}
            className="w-full flex flex-row items-center justify-between space-x-5"
          >
            <button className="w-1/2 py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-500 duration-300">
              نعم
            </button>
            <button
              className="w-1/2 py-2 px-4 bg-transparent border border-primary text-primary font-medium rounded-lg hover:bg-accent hover:text-white duration-300"
              onClick={closeModal}
            >
              لا
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DashboardSidebar;
