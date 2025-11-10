import ResellerImg from "../../assets/resellers.svg";
import ResellerTitleImg from "../../assets/title_resellers.svg";
import {
  SoApp,
  SoBell,
  SoMailReceive,
  SoReceiptItem,
  SoSend,
} from "solom-icon";
import { useTranslation } from "react-i18next";

const resellerIcons = [SoMailReceive, SoSend, SoReceiptItem, SoBell, SoApp];

const ResellerSection = () => {
  const { t, i18n } = useTranslation("home");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  return (
    <section id="resellers" dir={dir}>
      <div className="mt-16 h-auto pb-20">
        <div
          className={`flex ${
            currentLng === "ar" ? "flex-row-reverse" : "flex-row"
          } justify-between items-center gap-5 container max-sm:flex-col max-sm:space-x-0`}
        >
          <div className="flex flex-col justify-between items-start flex-shrink-0 w-1/2 max-sm:w-10/12 space-y-5 max-sm:items-center max-sm:space-y-3">
            <img
              className="w-44"
              src={ResellerTitleImg}
              alt={t("resellers.titleImageAlt")}
              loading="lazy"
            />
            <div className="space-y-2">
              <h2
                className={`text-primary text-xl font-bold max-sm:text-lg ${
                  currentLng === "ar" ? "text-right" : "text-left"
                } max-sm:text-center`}
              >
                {t("resellers.title")}
              </h2>
              <p
                className={`text-[#525252] text-base font-medium max-sm:text-base ${
                  currentLng === "ar" ? "text-right" : "text-left"
                } max-sm:text-center`}
              >
                {t("resellers.description")}
              </p>
              <div className="flex flex-col items-start justify-between space-y-3">
                {(
                  t("resellers.features", { returnObjects: true }) as string[]
                ).map((feature: string, index: number) => {
                  const Icon = resellerIcons[index];
                  return (
                    <div
                      key={index}
                      className={`flex ${
                        currentLng === "ar" ? "flex-row" : "flex-row"
                      } items-center justify-between gap-3 mt-5`}
                    >
                      <div className="bg-accent rounded-lg p-1">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <p
                        className={`text-base font-semibold text-primary ${
                          currentLng === "ar" ? "text-right" : "text-left"
                        }`}
                      >
                        {feature}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-1/2 max-sm:mt-10 max-sm:w-full">
            <img
              className="image-float duration-300"
              src={ResellerImg}
              alt={t("resellers.imageAlt")}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResellerSection;
