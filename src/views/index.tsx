import { Helmet } from "react-helmet";
import LandingSection from "./website/LandingSection";
import ResellerSection from "./website/ResellerSection";
import ServiceSection from "./website/ServiceSection";

const HomePage = () => {
  return (
    <div className="w-full mb-8 max-sm:overflow-x-hidden relative">
      <Helmet>
        <title>EmailSender | Home</title>
      </Helmet>
      <LandingSection />
      {/* <AboutSection /> */}
      <ServiceSection />
      <ResellerSection />
      {/* <ContactSection /> */}
    </div>
  );
};

export default HomePage;
