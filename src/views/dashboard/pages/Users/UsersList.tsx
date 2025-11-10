import { Helmet } from "react-helmet-async";
import UsersListTable from "../../../../components/dashboard-tables/Users/UsersList";
import { useState } from "react";
import { useSelector } from "react-redux";
import { tokenSelector } from "../../../../app/functions/token";
import useAuthenticatedQuery from "../../../../hooks/useAuthenticatedQuery";
import AddUser from "./AddUser";
import AddQuota from "./AddQuota";

const UsersListPage = () => {
  const { access } = useSelector(tokenSelector);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenQuota, setIsOpenQuota] = useState(false);

  const { data, isLoading, error, refetchData } = useAuthenticatedQuery({
    queryKey: ["usersListTable"],
    URL: "auth/users/",
    config: {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  });

  return (
    <div className="w-full mt-10">
      <Helmet>
        <title>EmailSender | Users List</title>
      </Helmet>
      <div className="w-full flex items-center justify-start gap-2">
        <AddUser
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          refetchData={refetchData}
        />
        <AddQuota
          isOpen={isOpenQuota}
          setIsOpen={setIsOpenQuota}
          refetchData={refetchData}
        />
      </div>
      <UsersListTable
        data={data}
        isLoading={isLoading}
        error={error}
        refetchData={refetchData}
      />
    </div>
  );
};

export default UsersListPage;
