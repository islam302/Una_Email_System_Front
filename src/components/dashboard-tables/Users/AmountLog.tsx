/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "../Tables.style.css";
import { useState } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import LoadingScreen from "../../website-loading";
import { TAddUser } from "../../../types";
import { useTranslation } from "@/i18n/hooks";

interface UsersListTableProps {
  data: TAddUser[] | undefined;
  isLoading: boolean;
  error: any;
  refetchData: () => void;
}

const AmountLog = ({ data, error, isLoading }: UsersListTableProps) => {
  const { t, i18n } = useTranslation("user");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);

  const AmountLogData = Array.isArray(data) ? data : [];

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
      <div
        className={`text-red-600 ${
          currentLng === "ar" ? "text-right" : "text-left"
        }`}
        dir={dir}
      >
        Error loading data: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full" dir={dir}>
      <div className="w-full flex flex-col items-start justify-center space-y-5 mb-10">
        <div id="datatable">
          <DataTable
            dataKey="id"
            value={AmountLogData || []}
            removableSort
            tableStyle={{ minWidth: "100%", cursor: "pointer" }}
            paginator
            rows={rows}
            first={first}
            onPage={onPageChange}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rowsPerPageOptions={[10, 20, 30]}
            totalRecords={AmountLogData.length}
            emptyMessage={t("noListsAvailable")}
          >
            <Column
              field="user"
              header={t("username")}
              style={{ width: "20%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.user ? rowData?.user : "null"}
                </div>
              )}
            ></Column>
            <Column
              field="user_email"
              header={t("email")}
              style={{ width: "20%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.user_email ? rowData?.user_email : "null"}
                </div>
              )}
            ></Column>
            <Column
              field="amount_added"
              header={t("amountAdded")}
              style={{ width: "20%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.amount_added ? rowData?.amount_added : "0"}
                </div>
              )}
            ></Column>
            <Column
              field="timestamp"
              header={t("timestamp")}
              style={{ width: "20%", borderRadius: "0px" }}
              body={(rowData) => (
                <div
                  className={`w-full flex ${
                    currentLng === "ar" ? "justify-end" : "justify-start"
                  } text-${currentLng === "ar" ? "right" : "left"}`}
                >
                  {rowData?.timestamp ? rowData?.timestamp : "0"}
                </div>
              )}
            ></Column>
            <Column
              field="updated_by"
              header={t("updatedBy")}
              style={{ width: "20%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.updated_by ? rowData?.updated_by : "0"}
                </div>
              )}
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default AmountLog;
