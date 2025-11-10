import { Helmet } from "react-helmet-async";
import DashboardLineChart from "../../components/dashboard-charts/LineChart";
import { SoApp2, SoMailSend, SoWallet2 } from "solom-icon";
import { useTranslation } from "@/i18n/hooks";
import { useGetUserStatusQuery } from "@/app/functions/api/usersApi";

const DashboardPage = () => {
  const { t } = useTranslation("dashboard");

  const { data: user } = useGetUserStatusQuery({});

  return (
    <div className="w-full mt-10">
      <Helmet>
        <title>EmailSender | Dashboard</title>
      </Helmet>
      <div className="flex flex-col items-start justify-center space-y-5 mb-10">
        <div className="w-full flex flex-row items-center justify-between gap-3 max-sm:flex-col">
          <div className="w-1/3 gradientBg flex flex-row items-start justify-between py-4 px-6 rounded-lg shadow-md max-sm:w-full">
            <div className="flex flex-col items-start justify-center">
              <h3 className="text-xl text-white font-medium mb-5 mt-2">
                {t("organization")}
              </h3>
              <p className="text-lg text-white font-semibold uppercase">
                {user?.organization}
              </p>
            </div>
            <SoApp2 className="w-12 h-12 mt-2 text-white" />
          </div>
          <div className="w-1/3 gradientBg flex flex-row items-start justify-between py-4 px-6 rounded-lg shadow-md max-sm:w-full">
            <div className="flex flex-col items-start justify-center">
              <h3 className="text-xl text-white font-medium mb-5 mt-2">
                {t("email")}
              </h3>
              <p className="text-lg text-white font-semibold uppercase">
                {user?.email}
              </p>
            </div>
            <SoMailSend className="w-14 h-14 mt-0.5 text-white" />
          </div>
          <div className="w-1/3 gradientBg flex flex-row items-start justify-between py-4 px-6 rounded-lg shadow-md max-sm:w-full">
            <div className="flex flex-col items-start justify-center">
              <h3 className="text-xl text-white font-medium mb-5 mt-2">
                {t("credits")}
              </h3>
              <p className="text-lg text-white font-semibold uppercase">
                {user?.remaining_quota}
              </p>
            </div>
            <SoWallet2 className="w-14 h-14 mt-0.5 text-white" />
          </div>
        </div>
        <div className="w-full space-y-2 hidden">
          <h3 className="text-2xl font-medium gradientText">
            معدل الأيميلات المُرسلة
          </h3>
          <DashboardLineChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
