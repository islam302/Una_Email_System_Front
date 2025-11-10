import AboutImg from "../../assets/about.svg";
import AboutTitleImg from "../../assets/title_about.svg";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t, i18n } = useTranslation("home");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  return (
    <section id="about" dir={dir}>
      <div className="h-auto pb-5">
        <div
          className={`flex ${
            currentLng === "ar" ? "flex-row" : "flex-row"
          } justify-between items-center gap-20 container max-sm:flex-col`}
        >
          <div className="flex flex-col justify-between items-start flex-shrink-0 w-1/2 max-sm:w-10/12 space-y-5 max-sm:items-center max-sm:space-y-3">
            <img
              className="w-52 max-md:w-32"
              src={AboutTitleImg}
              alt={t("about.titleImageAlt")}
              loading="lazy"
            />
            <div className="space-y-2">
              <p
                className={`text-[#525252] text-lg font-medium max-sm:text-lg ${
                  currentLng === "ar" ? "text-right" : "text-left"
                } max-sm:text-center`}
                dangerouslySetInnerHTML={{ __html: t("about.description") }}
              />
            </div>
          </div>
          <div className="flex-shrink-0 w-1/2 max-sm:mt-10 max-sm:w-full">
            <img
              className="duration-300"
              src={AboutImg}
              alt={t("about.imageAlt")}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
