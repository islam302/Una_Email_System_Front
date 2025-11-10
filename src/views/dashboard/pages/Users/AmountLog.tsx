import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { tokenSelector } from "../../../../app/functions/token";
import useAuthenticatedQuery from "../../../../hooks/useAuthenticatedQuery";
import AmountLog from "../../../../components/dashboard-tables/Users/AmountLog";

const AmountLogPage = () => {
  const { access } = useSelector(tokenSelector);

  const { data, isLoading, error, refetchData } = useAuthenticatedQuery({
    queryKey: ["quotaLogoTable"],
    URL: "auth/quota-logs/",
    config: {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  });

  return (
    <div className="w-full mt-10">
      <Helmet>
        <title>EmailSender | Amount Log</title>
      </Helmet>
      <AmountLog
        data={data}
        isLoading={isLoading}
        error={error}
        refetchData={refetchData}
      />
    </div>
  );
};

export default AmountLogPage;
