import { useState } from "react";
import LandingImg from "../../assets/dashboard.svg";
import Button from "../../components/elements/Button";
import { Link as ScrollLink } from "react-scroll";
import { useTranslation } from "react-i18next";
import { Input } from "rsuite";

const LandingSection = () => {
  const { t, i18n } = useTranslation("home");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  // State for editable text fields
  const [title, setTitle] = useState(t("landing.title"));
  const [highlightedTitle, setHighlightedTitle] = useState(
    t("landing.highlightedTitle")
  );
  const [description, setDescription] = useState(t("landing.description"));

  // Handlers for saving changes
  const handleSaveTitle = () => {
    console.log("Saved title:", title);
  };
  const handleSaveHighlightedTitle = () => {
    console.log("Saved highlightedTitle:", highlightedTitle);
  };
  const handleSaveDescription = () => {
    console.log("Saved description:", description);
  };

  return (
    <section id="landing" dir={dir}>
      <div className="mt-12 h-auto pb-5 max-sm:mt-28">
        <div
          className={`flex ${
            currentLng === "ar" ? "flex-row" : "flex-row"
          } justify-between items-center space-x-7 container max-sm:flex-col max-sm:space-x-0`}
        >
          <div className="flex flex-col justify-between items-start flex-shrink-0 w-1/2 max-sm:w-10/12 space-y-8 max-sm:items-center max-sm:space-y-3">
            <h2
              className={`text-[#2B2B2B] text-4xl font-bold max-sm:text-3xl w-full ${
                currentLng === "ar" ? "text-right" : "text-left"
              } max-sm:text-center leading-[1.4]`}
            >
              <Input
                value={title}
                onChange={(value) => setTitle(value)}
                onBlur={handleSaveTitle}
                placeholder={t("landing.titlePlaceholder") || "Enter title..."}
                style={{ width: "100%" }}
              />{" "}
              <span className="text-primary">
                <Input
                  value={highlightedTitle}
                  onChange={(value) => setHighlightedTitle(value)}
                  onBlur={handleSaveHighlightedTitle}
                  placeholder={
                    t("landing.highlightedTitlePlaceholder") ||
                    "Enter highlighted title..."
                  }
                  style={{ display: "inline-block", width: "auto" }}
                />
              </span>
            </h2>
            <p
              className={`text-[#525252] text-lg font-medium max-sm:text-lg w-full ${
                currentLng === "ar" ? "text-right" : "text-left"
              } max-sm:text-center`}
            >
              <Input
                value={description}
                onChange={(value) => setDescription(value)}
                onBlur={handleSaveDescription}
                placeholder={
                  t("landing.descriptionPlaceholder") || "Enter description..."
                }
                style={{ display: "inline-block", width: "100%" }}
              />
            </p>
            <div className="flex flex-row items-center gap-3 max-sm:flex-col max-sm:space-y-3">
              <ScrollLink
                to="services"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                <Button className="px-6 border-2 border-primary">
                  {t("landing.buttons.discoverServices")}
                </Button>
              </ScrollLink>
              <ScrollLink
                to="prices"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                <Button className="px-6 border-2 border-primary bg-transparent text-primary dark:text-primary hover:text-white dark:hover:text-white hover:bg-primary font-medium">
                  {t("landing.buttons.pricingPlans")}
                </Button>
              </ScrollLink>
            </div>
          </div>
          <div className="flex-shrink-0 w-3/5 max-sm:mt-10 max-sm:w-full">
            <img
              className="image-float duration-300"
              src={LandingImg}
              alt={t("landing.imageAlt")}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingSection;
