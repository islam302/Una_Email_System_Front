import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useSelector } from "react-redux";
import { tokenSelector } from "../../../../app/functions/token";
import useAuthenticatedQuery from "../../../../hooks/useAuthenticatedQuery";
import AddGroupList from "./AddGroupList";
import GroupListTable from "../../../../components/dashboard-tables/Group";

const GroupListPage = () => {
  const { access } = useSelector(tokenSelector);

  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error, refetchData } = useAuthenticatedQuery({
    queryKey: ["groupListTable"],
    URL: "recipients/recipient-groups/",
    config: {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  });

  return (
    <div className="w-full mt-10">
      <Helmet>
        <title>EmailSender | Group List</title>
      </Helmet>
      <div className="w-full flex items-center justify-start gap-2">
        <AddGroupList
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          refetchData={refetchData}
        />
      </div>
      <GroupListTable
        data={data}
        isLoading={isLoading}
        error={error}
        refetchData={refetchData}
      />
    </div>
  );
};

export default GroupListPage;
