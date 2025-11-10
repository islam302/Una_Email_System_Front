/* eslint-disable @typescript-eslint/no-explicit-any */
import "../Tables.style.css";
import { useState } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { tokenSelector } from "../../../app/functions/token";
import { useSelector } from "react-redux";
import LoadingScreen from "../../website-loading";
import { SoTrash } from "solom-icon";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../config/axios.config";
import { toast } from "react-fox-toast";
import { TRecipientList } from "../../../types";
import { AxiosError } from "axios";
import { useTranslation } from "@/i18n/hooks";

interface RecipientListTableProps {
  data: { recipient_lists: TRecipientList[] };
  isLoading: boolean;
  error: any;
  refetchData: () => void;
}

const SingleGroupListTable = ({
  data,
  error,
  isLoading,
  refetchData,
}: RecipientListTableProps) => {
  const { t, i18n } = useTranslation("group");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { access } = useSelector(tokenSelector);
  const { id } = useParams();
  const [rows, setRows] = useState<number>(10);
  const [first, setFirst] = useState<number>(0);

  const groups = data?.recipient_lists || [];

  const handleDeleteList = async (idR: string) => {
    try {
      await axiosInstance.delete(
        `recipients/recipient-groups/${id}/remove-list/${idR}/`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      toast.success(t("successDeleteGroup"));
      refetchData();
    } catch (err) {
      const error = err as AxiosError<any>;
      const data = error.response?.data as Record<string, string[]>;
      const firstErrorMessage = Object.entries(data)[0]?.[1]?.[0];
      toast.error(firstErrorMessage, {
        duration: 4000,
      });
    }
  };

  const onPageChange = (event: DataTablePageEvent) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <div className="w-full" dir={dir}>
      <div className="w-full flex flex-col items-start justify-center space-y-5 mb-10">
        <div id="datatable">
          <DataTable
            dataKey="id"
            value={groups}
            removableSort
            tableStyle={{ minWidth: "100%", cursor: "pointer" }}
            paginator
            rows={rows}
            first={first}
            onPage={onPageChange}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rowsPerPageOptions={[10, 20, 30]}
            totalRecords={groups.length}
            emptyMessage={t("noListsAvailable")}
          >
            <Column
              field="name"
              header={t("name")}
              style={{ width: "15%", borderRadius: "0px" }}
              body={(rowData) => (
                <div
                  className={`w-full flex ${
                    currentLng === "ar" ? "justify-start" : "justify-start"
                  }`}
                >
                  {rowData?.name ? rowData?.name : "null"}
                </div>
              )}
            ></Column>
            <Column
              field="recipients"
              style={{ width: "15%", borderRadius: "0px" }}
              body={(rowData) => (
                <div
                  className={`w-full flex ${
                    currentLng === "ar" ? "justify-end" : "justify-end"
                  } gap-3`}
                >
                  <div
                    className="bg-red-200 text-red-600 p-1 rounded-md"
                    onClick={() => handleDeleteList(rowData?.id)}
                  >
                    <SoTrash className="w-5 h-5" />
                  </div>
                </div>
              )}
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default SingleGroupListTable;
