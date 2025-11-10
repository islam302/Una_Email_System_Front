import { Helmet } from "react-helmet-async";
import RecipientListTable from "../../../../../components/dashboard-tables/Recipient";
import { useSelector } from "react-redux";
import { tokenSelector } from "../../../../../app/functions/token";
import useAuthenticatedQuery from "../../../../../hooks/useAuthenticatedQuery";
import AddRecipientList from "./AddRecipientList";
import { useState } from "react";
import SearchRecipientList from "./SearchRecipientList";

const RecipientListPage = () => {
  const { access } = useSelector(tokenSelector);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const { data, isLoading, error, refetchData } = useAuthenticatedQuery({
    queryKey: ["recipientListTable"],
    URL: "recipients/list/",
    config: {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  });

  return (
    <div className="w-full mt-10">
      <Helmet>
        <title>EmailSender | Recipient List</title>
      </Helmet>
      <div className="w-full flex items-center justify-start gap-2">
        <AddRecipientList
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          refetchData={refetchData}
        />
        <SearchRecipientList
          isOpen={isOpenSearch}
          setIsOpen={setIsOpenSearch}
        />
      </div>
      <RecipientListTable
        data={data}
        isLoading={isLoading}
        error={error}
        refetchData={refetchData}
      />
    </div>
  );
};

export default RecipientListPage;
