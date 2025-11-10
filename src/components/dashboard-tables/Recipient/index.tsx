/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "../Tables.style.css";
import { useEffect, useState } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { tokenSelector } from "../../../app/functions/token";
import { useSelector } from "react-redux";
import LoadingScreen from "../../website-loading";
import { SoEye, SoTrash, SoSend, SoXmarkCircle, SoEditNote } from "solom-icon";
import { Link } from "react-router-dom";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../config/axios.config";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recipientListSchema } from "../../../validation";
import { TRecipientList } from "../../../types";
import InputErrorMessage from "../../../components/auth-errormsg/InputErrorMessage";
import Input from "../../../components/elements/Input";
import { RECIPIENT_LIST_FORM } from "../../../data";
import Button from "../../../components/elements/Button";
import Modal from "../../../components/elements/Modal";
import { AxiosError } from "axios";
import { useTranslation } from "@/i18n/hooks";

interface RecipientListTableProps {
  data: TRecipientList[] | undefined;
  isLoading: boolean;
  error: any;
  refetchData: () => void;
}

interface IUpdateList extends TRecipientList {
  id: string;
}

const RecipientListTable = ({
  data,
  error,
  isLoading,
  refetchData,
}: RecipientListTableProps) => {
  const { t, i18n } = useTranslation("recipient");

  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { access } = useSelector(tokenSelector);

  const [editList, setEditList] = useState<IUpdateList>({
    id: "",
    name: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);

  const RecipientListData = Array.isArray(data) ? data : [];

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<TRecipientList>({
    resolver: yupResolver(recipientListSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isOpen && editList.id) {
      reset(editList);
    }
  }, [isOpen, editList, reset]);

  useEffect(() => {
    refetchData();
  }, []);

  const handleEditList = async (formData: TRecipientList) => {
    try {
      const { status } = await axiosInstance.patch(
        `recipients/list/${editList?.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (status === 200) {
        refetchData();
        toast.success(t("successUpdateList"));
        setIsOpen(false);
      }
    } catch (err) {
      const error = err as AxiosError<any>;
      const data = error.response?.data as Record<string, string[]>;
      const firstErrorMessage = Object.entries(data)[0]?.[1]?.[0];
      toast.error(firstErrorMessage, {
        duration: 4000,
      });
    }
  };

  const handleDeleteList = async (id: string) => {
    try {
      await axiosInstance.delete(`recipients/list/${id}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success(t("successDeleteList"));
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

  const renderRecipientForm = RECIPIENT_LIST_FORM.map(
    ({ name, placeholder, type, validation, icon: Icon }, idx) => (
      <div
        key={idx}
        className={`w-full space-y-1 ${
          currentLng === "ar" ? "text-right" : "text-left"
        }`}
      >
        <div
          className={`w-full flex ${
            currentLng === "ar" ? "flex-row" : "flex-row-reverse"
          } items-center gap-2 border border-accent rounded-lg`}
        >
          <div
            className={`bg-accent p-3 ${
              currentLng === "ar" ? "rounded-r-md" : "rounded-l-md"
            }`}
          >
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <Input
            type={type}
            placeholder={placeholder}
            className="w-full focus:outline-none focus:border-0 focus:ring-transparent ring-transparent border-0 bg-transparent"
            style={{ textAlign: currentLng === "ar" ? "right" : "left" }}
            {...register(name, validation)}
          />
        </div>
        {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
      </div>
    )
  );

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center">
        {t("errorLoadingData")}: {error?.message || t("unexpectedError")}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col items-start justify-center space-y-5 mb-10">
        <div id="datatable">
          <DataTable
            dataKey="id"
            value={RecipientListData}
            removableSort
            tableStyle={{ minWidth: "100%", cursor: "pointer" }}
            paginator
            rows={rows}
            first={first}
            onPage={onPageChange}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rowsPerPageOptions={[10, 20, 30]}
            totalRecords={RecipientListData.length}
            emptyMessage={t("emptyList")}
          >
            <Column
              field="name"
              header={t("headerListName")}
              style={{ width: "40%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.name || t("notAvailable")}
                </div>
              )}
            />
            <Column
              field="recipients"
              header={t("headerRecipientCount")}
              style={{ width: "40%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {Array.isArray(rowData?.recipients)
                    ? rowData.recipients.length
                    : t("zero")}
                </div>
              )}
            />
            <Column
              field="actions"
              style={{ width: "15%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="flex items-center justify-center gap-3">
                  <Link
                    to={`/dashboard/recipient/${rowData?.id}`}
                    className="bg-green-200 text-green-600 p-1 rounded-md"
                  >
                    <SoEye className="w-5 h-5" />
                  </Link>
                  <div
                    className="bg-blue-200 text-blue-600 p-1 rounded-md"
                    onClick={() => {
                      setEditList(rowData);
                      setIsOpen(true);
                    }}
                  >
                    <SoEditNote className="w-5 h-5" />
                  </div>
                  <div
                    className="bg-red-200 text-red-600 p-1 rounded-md"
                    onClick={() => handleDeleteList(rowData?.id)}
                  >
                    <SoTrash className="w-5 h-5" />
                  </div>
                </div>
              )}
            />
          </DataTable>
        </div>
      </div>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <div
          className={`absolute top-[-20px] ${
            currentLng === "ar" ? "left-0" : "right-0"
          }`}
          dir={dir}
        >
          <div className="bg-[#E8F0F7] rounded-full p-1">
            <SoXmarkCircle
              className="w-6 h-6 cursor-pointer text-red-600"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
        <div
          className="w-full flex flex-col items-center justify-center space-y-5 pt-10 px-5"
          dir={dir}
        >
          <form className="w-full" onSubmit={handleSubmit(handleEditList)}>
            <div className="w-full flex flex-col items-start justify-center space-y-5">
              <div className="w-full flex flex-col items-center justify-between space-y-8">
                <div className="w-full flex flex-col items-center justify-between space-y-3">
                  <div className="w-full flex flex-col items-center gap-3">
                    {renderRecipientForm}
                  </div>
                  <div
                    className={`w-full flex ${
                      currentLng === "ar" ? "flex-row" : "flex-row-reverse"
                    } items-center gap-3 pt-5`}
                  >
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      className="w-full flex items-center gap-2"
                    >
                      <SoSend className="h-5 w-5" />
                      {t("update")}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        reset();
                      }}
                      className="w-full flex items-center gap-2 bg-[#D20202] hover:bg-red-500"
                    >
                      <SoTrash className="h-5 w-5" />
                      {t("delete")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default RecipientListTable;
