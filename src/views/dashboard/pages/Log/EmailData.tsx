import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { tokenSelector } from "../../../../app/functions/token";
import useAuthenticatedQuery from "../../../../hooks/useAuthenticatedQuery";
import EmailDataTable from "../../../../components/dashboard-tables/Log";
import DeleteAllLogs from "./DeleteAllLogs";
import { useState } from "react";

const EmailDataPage = () => {
  const { access } = useSelector(tokenSelector);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error, refetchData } = useAuthenticatedQuery({
    queryKey: ["emailTrackListTable"],
    URL: "email_track/",
    config: {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  });

  return (
    <div className="w-full mt-10">
      <Helmet>
        <title>EmailSender | Email Track</title>
      </Helmet>
      <div className="w-full flex flex-col items-start justify-center mb-10">
        <div className="flex items-center gap-2">
          <DeleteAllLogs
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            refetchData={refetchData}
          />
        </div>
        <EmailDataTable
          data={data}
          isLoading={isLoading}
          error={error}
          refetchData={refetchData}
        />
      </div>
    </div>
  );
};

export default EmailDataPage;
