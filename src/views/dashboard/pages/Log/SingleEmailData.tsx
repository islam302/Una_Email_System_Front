import { Helmet } from "react-helmet-async";
import SingleEmailLogTable from "../../../../components/dashboard-tables/Log/SingleEmailLog";
import useAuthenticatedQuery from "../../../../hooks/useAuthenticatedQuery";
import { useSelector } from "react-redux";
import { tokenSelector } from "../../../../app/functions/token";
import { useParams } from "react-router-dom";

const SingleEmailLogPage = () => {
  const { id } = useParams();
  const { access } = useSelector(tokenSelector);

  const { data, isLoading, error, refetchData } = useAuthenticatedQuery({
    queryKey: ["emailTrackerTable"],
    URL: `email_track/?mail_id=${id}`,
    config: {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  });

  return (
    <div className="w-full mt-10">
      <Helmet>
        <title>EmailSender | Single Email Log</title>
      </Helmet>
      <div className="w-full flex flex-col items-start justify-center mb-10">
        <SingleEmailLogTable
          data={data}
          isLoading={isLoading}
          error={error}
          refetchData={refetchData}
        />
      </div>
    </div>
  );
};

export default SingleEmailLogPage;
