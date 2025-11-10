import LogoImg from "../../assets/logo.svg";
import VisaIcon from "../../assets/visa.svg";
import KlarnaIcon from "../../assets/klarna.svg";
import JoudpayIcon from "../../assets/joudpay.svg";
import MastercardIcon from "../../assets/mastercard.svg";
import Waves from "../../assets/waves.svg";
import {
  SoFacebook,
  SoInstagram,
  SoLinkedIn,
  SoLocation2,
  SoMail,
  SoTwitter,
  SoYouTube,
} from "solom-icon";
import { useTranslation } from "@/i18n/hooks";

const paymentIconsMap = {
  visa: VisaIcon,
  mastercard: MastercardIcon,
  klarna: KlarnaIcon,
  joudpay: JoudpayIcon,
};

const Footer = () => {
  const { t, i18n } = useTranslation("layout");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const fallbackPaymentIcons = [
    { src: "visa", alt: currentLng === "ar" ? "فيزا" : "Visa" },
    {
      src: "mastercard",
      alt: currentLng === "ar" ? "ماستركارد" : "Mastercard",
    },
    { src: "klarna", alt: currentLng === "ar" ? "كلارنا" : "Klarna" },
    { src: "joudpay", alt: currentLng === "ar" ? "جودباي" : "Joudpay" },
  ];

  const paymentIcons = Array.isArray(t("paymentIcons", { returnObjects: true }))
    ? t("paymentIcons", { returnObjects: true })
    : fallbackPaymentIcons;

  return (
    <footer className="bg-[#be27ce] pb-5 relative overflow-hidden" dir={dir}>
      <div className="w-full h-auto absolute flex flex-col items-center z-10">
        <img
          className="w-full"
          src={Waves}
          alt={t("wavesAlt")}
          loading="lazy"
        />
        <img
          className="w-full min-sm:hidden"
          src={Waves}
          alt={t("wavesAlt")}
          loading="lazy"
        />
        <img
          className="w-full min-sm:hidden"
          src={Waves}
          alt={t("wavesAlt")}
          loading="lazy"
        />
        <img
          className="w-full min-sm:hidden"
          src={Waves}
          alt={t("wavesAlt")}
          loading="lazy"
        />
        <img
          className="w-full min-sm:hidden"
          src={Waves}
          alt={t("wavesAlt")}
          loading="lazy"
        />
      </div>
      <div className="container relative z-50">
        <div
          className={`flex ${
            currentLng === "ar" ? "flex-row-reverse" : "flex-row"
          } justify-between gap-10 pt-10 max-sm:flex-col max-sm:justify-center max-sm:gap-0`}
        >
          <div className="flex-shrink-0 w-1/3 space-y-10 max-sm:w-full max-sm:flex max-sm:flex-col max-sm:items-center">
            <div
              className={`flex ${
                currentLng === "ar" ? "flex-row-reverse" : "flex-row"
              } items-center gap-2`}
            >
              <img className="w-20" src={LogoImg} alt={t("logoAlt")} />
              <h3 className="text-white text-3xl font-semibold uppercase">
                {t("footer.brandName")}
              </h3>
            </div>
            <div
              className={`flex ${
                currentLng === "ar" ? "flex-row-reverse" : "flex-row"
              } items-center justify-start gap-3`}
            >
              {(
                paymentIcons as Array<{
                  src: keyof typeof paymentIconsMap;
                  alt: string;
                }>
              ).map((icon, index) => {
                const IconComponent = paymentIconsMap[icon.src];
                return (
                  <img
                    key={index}
                    className={`w-20 max-sm:w-16 ${
                      icon.src === "klarna" || icon.src === "joudpay"
                        ? "hidden"
                        : ""
                    }`}
                    src={IconComponent}
                    alt={icon.alt}
                    loading="lazy"
                  />
                );
              })}
            </div>
          </div>
          <div className="flex-shrink-0 w-1/3 space-y-10 mt-10 max-sm:w-full">
            <div className="flex flex-col items-start justify-center gap-3">
              <div
                className={`flex ${
                  currentLng === "ar" ? "flex-row-reverse" : "flex-row"
                } items-center justify-center gap-3 text-base max-sm:text-sm text-black/70`}
              >
                <SoLocation2 className="w-6 h-6 text-white" />
                <p
                  className={`text-white text-base ${
                    currentLng === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  {t("footer.contactInfo.address")}
                </p>
              </div>
              <div
                className={`flex ${
                  currentLng === "ar" ? "flex-row-reverse" : "flex-row"
                } items-center justify-center gap-3 text-base max-sm:text-sm text-black/70`}
              >
                <SoMail className="w-6 h-6 text-white" />
                <p
                  className={`text-white text-base ${
                    currentLng === "ar" ? "text-right" : "text-left"
                  }`}
                >
                  info@go-tomail.com
                </p>
              </div>
            </div>
            <div
              className={`flex ${
                currentLng === "ar" ? "flex-row-reverse" : "flex-row"
              } max-sm:justify-center items-center space-x-5 hidden`}
            >
              <div className="bg-white rounded-lg w-9 p-2">
                <SoFacebook className="text-primary w-full h-full" />
              </div>
              <div className="bg-white rounded-lg w-9 p-2">
                <SoTwitter className="text-primary w-full h-full" />
              </div>
              <div className="bg-white rounded-lg w-9 p-2">
                <SoInstagram className="text-primary w-full h-full" />
              </div>
              <div className="bg-white rounded-lg w-9 p-2">
                <SoLinkedIn className="text-primary w-full h-full" />
              </div>
              <div className="bg-white rounded-lg w-9 p-2">
                <SoYouTube className="text-primary w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-white mt-6 mb-5" />
      <p
        className="text-center text-sm text-white"
        dangerouslySetInnerHTML={{ __html: t("footer.copyright") }}
      />
    </footer>
  );
};

export default Footer;
