/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import AddRecipientList from "../SingleRecipient/AddRecipient";
import SingleRecipientListTable from "../../../../../components/dashboard-tables/Recipient/SingleList";
import UploadRecipientList from "./UploadRecipient";
import ExistingRecipientList from "./ExistingRecipient";
import { tokenSelector } from "../../../../../app/functions/token";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useAuthenticatedQuery from "../../../../../hooks/useAuthenticatedQuery";
import AttachNewValue from "./AttachNewValue";
import AttachAttachments from "./AttachAttachments";
import ExportExcel from "./ExportExcel";

const SingleRecipientListPage = () => {
  const { id } = useParams();
  const { access } = useSelector(tokenSelector);

  const [isOpen, setIsOpen] = useState(false);
  const [isValue, setIsValue] = useState(false);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [isAttachments, setIsAttachments] = useState(false);
  const [isOpenExisting, setIsOpenExisting] = useState(false);

  const { data, isLoading, error, refetchData } = useAuthenticatedQuery({
    queryKey: ["recipientListTable"],
    URL: `recipients/list/${id}`,
    config: {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  });

  useEffect(() => {
    refetchData();
  }, []);

  return (
    <div className="w-full mt-10">
      <Helmet>
        <title>EmailSender | Recipient List</title>
      </Helmet>
      <div className="w-full flex flex-col items-start justify-center mb-10">
        <div className="flex items-center gap-2">
          <AddRecipientList
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            refetchData={refetchData}
          />
          <UploadRecipientList
            isOpen={isOpenUpload}
            setIsOpen={setIsOpenUpload}
          />
          <AttachNewValue
            data={data}
            isOpen={isValue}
            setIsOpen={setIsValue}
            refetchData={refetchData}
          />
          <AttachAttachments
            data={data}
            isOpen={isAttachments}
            setIsOpen={setIsAttachments}
            refetchData={refetchData}
          />
          <div className="hidden">
            <ExistingRecipientList
              isOpen={isOpenExisting}
              setIsOpen={setIsOpenExisting}
            />
          </div>
          <ExportExcel />
        </div>
        <SingleRecipientListTable
          data={data}
          isLoading={isLoading}
          error={error}
          refetchData={refetchData}
        />
      </div>
    </div>
  );
};

export default SingleRecipientListPage;
