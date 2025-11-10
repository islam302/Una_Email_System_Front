import { Helmet } from "react-helmet-async";
import EmailTemplatesTable from "../../../../components/dashboard-tables/Services/Templates";
import AddEmailTemplate from "./AddEmailTemplate";
import { tokenSelector } from "../../../../app/functions/token";
import { useSelector } from "react-redux";
import { useState } from "react";
import useAuthenticatedQuery from "../../../../hooks/useAuthenticatedQuery";

const EmailTemplatePage = () => {
  const { access } = useSelector(tokenSelector);

  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error, refetchData } = useAuthenticatedQuery({
    queryKey: ["emailTemplateTable"],
    URL: "email_forms/",
    config: {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  });

  return (
    <div className="w-full mt-10">
      <Helmet>
        <title>EmailSender | Email Templates</title>
      </Helmet>
      <div className="w-full flex flex-col items-start justify-center mb-10">
        <div className="flex items-center gap-2">
          <AddEmailTemplate
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            refetchData={refetchData}
          />
        </div>
        <EmailTemplatesTable
          data={data}
          isLoading={isLoading}
          error={error}
          refetchData={refetchData}
        />
      </div>
    </div>
  );
};

export default EmailTemplatePage;
