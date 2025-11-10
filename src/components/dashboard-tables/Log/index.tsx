/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "../Tables.style.css";
import { useState } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { tokenSelector } from "../../../app/functions/token";
import { useSelector } from "react-redux";
import LoadingScreen from "../../website-loading";
import { SoEye, SoTrash } from "solom-icon";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../config/axios.config";
import { TRecipientList } from "../../../types";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useTranslation } from "@/i18n/hooks";

interface RecipientListTableProps {
  data: TRecipientList[] | undefined;
  isLoading: boolean;
  error: any;
  refetchData: () => void;
}

const EmailDataTable = ({
  data,
  error,
  isLoading,
  refetchData,
}: RecipientListTableProps) => {
  const { t, i18n } = useTranslation("log");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { access } = useSelector(tokenSelector);

  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);

  const RecipientListData = Array.isArray(data) ? data : [];

  const handleDeleteList = async (id: string) => {
    try {
      await axiosInstance.delete(`email_track/delete/?mail_id=${id}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      refetchData();
      toast.success(t("successDeleteRecord"));
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
    return (
      <div className={`text-red-600 text-center`} dir={dir}>
        {t("errorLoadingData", {
          message: error?.message || t("errorUnexpected"),
        })}
      </div>
    );
  }

  return (
    <div className="w-full" dir={dir}>
      <div className="w-full flex flex-col items-start justify-center space-y-5 mb-10">
        <div id="datatable">
          <DataTable
            dataKey="id"
            value={RecipientListData || []}
            removableSort
            tableStyle={{ minWidth: "100%", cursor: "pointer" }}
            paginator
            rows={rows}
            first={first}
            onPage={onPageChange}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rowsPerPageOptions={[10, 20, 30]}
            totalRecords={RecipientListData.length}
            emptyMessage={t("noListsAvailable")}
          >
            <Column
              field="recipients"
              header={t("emailName")}
              style={{ width: "40%", borderRadius: "0px" }}
              body={(rowData) => <div>{rowData?.recipients?.subject}</div>}
            />
            {/* <Column
              field="recipients"
              header={t("recipientsCount")}
              style={{ width: "40%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {Array.isArray(rowData?.recipients)
                    ? rowData.recipients.length
                    : "0"}
                </div>
              )}
            /> */}
            <Column
              field="actions"
              style={{ width: "15%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="flex items-center justify-center gap-3">
                  <Link
                    to={`/dashboard/logs/email/${rowData?.mail_id}`}
                    className="bg-green-200 text-green-600 p-1 rounded-md"
                  >
                    <SoEye className="w-5 h-5" />
                  </Link>
                  <div
                    className="bg-red-200 text-red-600 p-1 rounded-md"
                    onClick={() => handleDeleteList(rowData?.mail_id)}
                  >
                    <SoTrash className="w-5 h-5" />
                  </div>
                </div>
              )}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default EmailDataTable;
