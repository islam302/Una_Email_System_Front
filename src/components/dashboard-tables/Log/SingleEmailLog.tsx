/* eslint-disable @typescript-eslint/no-explicit-any */
import "../Tables.style.css";
import { useState } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import LoadingScreen from "../../website-loading";
import { SoCheckBadge2, SoXmarkCircle } from "solom-icon";
import { useTranslation } from "@/i18n/hooks";

interface List {
  id?: string;
  name: string;
  email: string;
  phone_number: string;
  name_of_organization: string;
  job_title: string;
  country: string;
  survey_question?: string | null;
  survey_answer?: string | null;
  custom_question?: string | null;
  custom_answer?: string | null;
  is_opened?: boolean;
  is_blocked?: boolean;
  is_delivered?: boolean;
  last_checked_at?: string;
}

interface RecipientListTableProps {
  data: { recipients: { recipients: List[] } }[] | undefined;
  isLoading: boolean;
  error: any;
  refetchData: () => void;
}

const SingleEmailLogTable = ({
  data,
  error,
  isLoading,
}: RecipientListTableProps) => {
  const { t, i18n } = useTranslation("log");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const [rows, setRows] = useState<number>(10);
  const [first, setFirst] = useState<number>(0);

  const EmailLogData = (data && data[0]?.recipients?.recipients) || [];

  const hasCustomSurveyQuestion = EmailLogData.some(
    (row) => row.custom_question !== null
  );

  const hasSurveyQuestion = EmailLogData.some(
    (row) => row.survey_question !== null
  );

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
        <div id="solom" className="w-full overflow-x-auto">
          <DataTable
            dataKey="id"
            value={EmailLogData || []}
            removableSort
            tableStyle={{ minWidth: "100%", cursor: "pointer" }}
            paginator
            rows={rows}
            first={first}
            onPage={onPageChange}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rowsPerPageOptions={[10, 20, 30]}
            totalRecords={EmailLogData.length}
            emptyMessage={t("noListsAvailable")}
            className="custom-datatable"
          >
            <Column
              field="recipient_email"
              header={t("recipientEmail")}
              style={{ width: "15%" }}
              headerClassName="text-ellipsis overflow-hidden whitespace-nowrap"
              body={(rowData) => (
                <div className="w-full flex justify-end">
                  {rowData?.recipient_email ? rowData?.recipient_email : "null"}
                </div>
              )}
            />
            <Column
              field="is_opened"
              header={t("messageOpened")}
              style={{ width: "10%" }}
              headerClassName="text-ellipsis overflow-hidden whitespace-nowrap"
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.is_opened ? (
                    <SoCheckBadge2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <SoXmarkCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            />
            <Column
              field="is_blocked"
              header={t("messageBlocked")}
              style={{ width: "10%" }}
              headerClassName="text-ellipsis overflow-hidden whitespace-nowrap"
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.is_blocked ? (
                    <SoCheckBadge2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <SoXmarkCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            />
            <Column
              field="is_delivered"
              header={t("messageDelivery")}
              style={{ width: "10%" }}
              headerClassName="text-ellipsis overflow-hidden whitespace-nowrap"
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.is_delivered ? (
                    <SoCheckBadge2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <SoXmarkCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            />
            {hasSurveyQuestion && (
              <Column
                field="survey_question"
                header={t("surveyQuestion")}
                style={{ width: "20%", maxWidth: "250px" }}
                headerClassName="text-ellipsis overflow-hidden whitespace-nowrap"
                body={(rowData) => (
                  <div className="w-full flex">
                    {rowData?.survey_question !== null ? (
                      <p
                        className={
                          currentLng === "ar" ? "text-right" : "text-left"
                        }
                      >
                        {rowData?.survey_question}
                      </p>
                    ) : (
                      <SoXmarkCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              />
            )}
            {hasSurveyQuestion && (
              <Column
                field="survey_answer"
                header={t("surveyAnswer")}
                style={{ width: "20%", maxWidth: "250px" }}
                headerClassName="text-ellipsis overflow-hidden whitespace-nowrap"
                body={(rowData) => (
                  <div className="w-full flex">
                    {rowData?.survey_answer !== null ? (
                      <p
                        className={
                          currentLng === "ar" ? "text-right" : "text-left"
                        }
                      >
                        {rowData?.survey_answer}
                      </p>
                    ) : (
                      <SoXmarkCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              />
            )}
            {hasCustomSurveyQuestion && (
              <Column
                field="custom_question"
                header={t("customQuestion")}
                style={{ width: "20%", maxWidth: "250px" }}
                headerClassName="text-ellipsis overflow-hidden whitespace-nowrap"
                body={(rowData) => (
                  <div className="w-full flex">
                    {rowData?.custom_question !== null ? (
                      <p
                        className={
                          currentLng === "ar" ? "text-right" : "text-left"
                        }
                      >
                        {rowData?.custom_question}
                      </p>
                    ) : (
                      <SoXmarkCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              />
            )}
            {hasCustomSurveyQuestion && (
              <Column
                field="custom_answer"
                header={t("customAnswer")}
                style={{ width: "20%", maxWidth: "250px" }}
                headerClassName="text-ellipsis overflow-hidden whitespace-nowrap"
                body={(rowData) => (
                  <div className="w-full flex">
                    {rowData?.custom_answer !== null ? (
                      <p
                        className={
                          currentLng === "ar" ? "text-right" : "text-left"
                        }
                      >
                        {rowData?.custom_answer}
                      </p>
                    ) : (
                      <SoXmarkCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              />
            )}
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default SingleEmailLogTable;
