import ServiceTitleImg from "../../assets/title_services.svg";
import { SoCatalogue, SoMail, SoSupport } from "solom-icon";
import { useTranslation } from "react-i18next";

const servicesIcons = [SoMail, SoCatalogue, SoSupport];

const ServiceSection = () => {
  const { t, i18n } = useTranslation("home");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  return (
    <section id="services" dir={dir}>
      <div className="mt-20 h-auto pb-5">
        <div className="container flex flex-col items-center gap-10">
          <div className="flex flex-col items-center space-y-3">
            <img
              className="w-52"
              src={ServiceTitleImg}
              alt={t("services.titleImageAlt")}
              loading="lazy"
            />
            <p className="text-[#525252] text-center text-base font-medium max-sm:text-sm max-w-3xl">
              {t("services.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {(
              t("services.items", { returnObjects: true }) as Array<{
                title: string;
                description: string;
              }>
            ).map(
              (
                service: { title: string; description: string },
                index: number
              ) => {
                const Icon = servicesIcons[index];
                return (
                  <div
                    key={index}
                    className="border border-accent rounded-lg shadow-md p-5 flex flex-col items-start justify-between h-full"
                  >
                    <div className="bg-accent rounded-lg p-2">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <h4 className="text-xl text-primary font-bold mt-3">
                      {service.title}
                    </h4>
                    <p
                      className={`text-sm text-[#727272] line-clamp-6 mt-2 ${
                        currentLng === "ar" ? "text-right" : "text-left"
                      }`}
                    >
                      {service.description}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
