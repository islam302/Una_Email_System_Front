import { SoMailAdd } from "solom-icon";
import "./Navbar.style.css";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo_icon.svg";
import { useTranslation } from "@/i18n/hooks";

const AuthNavbar = () => {
  const { t, i18n } = useTranslation("layout");
  const currentLng = i18n.language;

  const dir = currentLng === "ar" ? "rtl" : "ltr";

  return (
    <header
      dir={dir}
      className={`headerAuth bg-white duration-200`}
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        height: "78px",
      }}
    >
      <div className={`menu__wrapper duration-200 text-primary`}>
        <div className="menu__bar">
          <Link
            onClick={() => scroll(0, 0)}
            to="/"
            title={"Email Sender"}
            aria-label="home"
            className="text-xl font-semibold uppercase"
          >
            <img className="w-12" src={Logo} alt="Logo" />
          </Link>
        </div>
        <div className="action-buttons hide">
          <Link
            to="/auth/login"
            className="flex items-center justify-center gap-2 bg-transparent hover:bg-primary border-2 border-primary text-primary hover:text-white px-6 py-3 rounded-lg transition-colors"
          >
            <span>{t("navbar.startNow")}</span>
            <SoMailAdd className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AuthNavbar;
