import { Helmet } from "react-helmet-async";
import SingleGroupListTable from "../../../../components/dashboard-tables/Group/SingleGroup";
import useAuthenticatedQuery from "../../../../hooks/useAuthenticatedQuery";
import { useSelector } from "react-redux";
import { tokenSelector } from "../../../../app/functions/token";
import { useParams } from "react-router-dom";

const SingleGroupListPage = () => {
  const { id } = useParams();
  const { access } = useSelector(tokenSelector);

  const { data, isLoading, error, refetchData } = useAuthenticatedQuery({
    queryKey: ["recipientGroupTable"],
    URL: `recipients/recipient-groups/${id}`,
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
      <div className="w-full flex flex-col items-end justify-center mb-10">
        <SingleGroupListTable
          data={data}
          isLoading={isLoading}
          error={error}
          refetchData={refetchData}
        />
      </div>
    </div>
  );
};

export default SingleGroupListPage;
