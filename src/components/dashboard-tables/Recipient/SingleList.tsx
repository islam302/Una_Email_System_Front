/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "../Tables.style.css";
import { useState, useEffect } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { tokenSelector } from "../../../app/functions/token";
import { useSelector } from "react-redux";
import LoadingScreen from "../../website-loading";
import { SoEditNote, SoSend, SoTrash, SoXmarkCircle } from "solom-icon";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../config/axios.config";
import { toast } from "react-fox-toast";
import Modal from "../../elements/Modal";
import Button from "../../elements/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editRecipientSchema } from "../../../validation";
import { RECIPIENT_FORM } from "../../../data";
import InputErrorMessage from "../../auth-errormsg/InputErrorMessage";
import Input from "../../elements/Input";
import { AxiosError } from "axios";
import { useTranslation } from "@/i18n/hooks";

export interface List {
  id?: string;
  name?: string;
  email: string;
  phone_number?: string;
  name_of_organization?: string;
  job_title?: string;
  country?: string;
  extra_fields?: string[];
}

interface RecipientListTableProps {
  data: { recipients: List[] } | undefined;
  isLoading: boolean;
  error: any;
  refetchData: () => void;
}

const SingleRecipientListTable = ({
  data,
  error,
  isLoading,
  refetchData,
}: RecipientListTableProps) => {
  const { access } = useSelector(tokenSelector);

  const { id } = useParams();

  const { t, i18n } = useTranslation("recipient");
  const currentLng = i18n.language;

  const [editList, setEditList] = useState<List>({
    id: "",
    name: "",
    email: "",
    country: "",
    job_title: "",
    phone_number: "",
    name_of_organization: "",
    extra_fields: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState<number>(10);
  const [first, setFirst] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const RecipientListData = data?.recipients || [];

  useEffect(() => {
    setIsCollapsed(document.body.classList.contains("collapsed"));

    const observer = new MutationObserver(() => {
      setIsCollapsed(document.body.classList.contains("collapsed"));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<List>({
    resolver: yupResolver(editRecipientSchema),
  });

  useEffect(() => {
    if (isOpen && editList.id) {
      reset(editList);
    }
  }, [isOpen, editList, reset]);

  const handleEditList = async (formData: List) => {
    try {
      const { status } = await axiosInstance.patch(
        `recipients/list/${id}/update-recipient/${editList.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (status === 200) {
        refetchData();
        toast.success("تم تحديث القائمة بنجاح");
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

  const handleDeleteList = async (idR: string) => {
    try {
      await axiosInstance.delete(`recipients/list/${id}/remove/${idR}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success("تم حذف القائمة بنجاح");
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

  const renderRecipientForm = RECIPIENT_FORM.map(
    ({ name, placeholder, type, validation, icon: Icon }, idx) => (
      <div key={idx} className="w-full text-right space-y-1">
        <div className="w-full flex flex-row items-center gap-2 border border-accent rounded-lg">
          <div className="bg-accent p-3 rounded-r-md">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <Input
            type={type}
            placeholder={placeholder}
            className="w-full focus:outline-none focus:border-0 focus:ring-transparent ring-transparent border-0 bg-transparent"
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
    return <div>Error loading data: {error.message}</div>;
  }

  const rec = RecipientListData.map((e) => e.extra_fields);

  const allKeys = rec.reduce<string[]>((acc, curr) => {
    if (curr) {
      Object.keys(curr).forEach((key) => {
        if (!acc.includes(key)) acc.push(key);
      });
    }
    return acc;
  }, []);

  return (
    <div className="max-w-full w-full">
      <div className="w-full flex flex-col items-start justify-center space-y-5 mb-10">
        <div
          id="datatable"
          className={`overflow-x-auto ${
            isCollapsed ? "max-w-[90vw]" : "max-w-[73vw]"
          }`}
        >
          <DataTable
            dataKey="id"
            value={RecipientListData}
            removableSort
            tableStyle={{ width: "80%", maxWidth: "90%", cursor: "pointer" }}
            paginator
            rows={rows}
            first={first}
            onPage={onPageChange}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rowsPerPageOptions={[10, 20, 30]}
            totalRecords={RecipientListData.length}
            scrollable
            scrollHeight="400px"
            emptyMessage={t("emptyList")}
          >
            <Column
              field="name"
              header="name"
              style={{ minWidth: "150px", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.name ? rowData?.name : "-"}
                </div>
              )}
            ></Column>
            <Column
              field="email"
              header="email"
              style={{ minWidth: "200px", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.email ? rowData?.email : "-"}
                </div>
              )}
            ></Column>
            <Column
              field="job_title"
              header="job_title"
              style={{ minWidth: "150px", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.job_title ? rowData?.job_title : "-"}
                </div>
              )}
            ></Column>
            <Column
              field="phone_number"
              header="phone_number"
              style={{ minWidth: "150px", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.phone_number ? rowData?.phone_number : "-"}
                </div>
              )}
            ></Column>
            <Column
              field="name_of_organization"
              header="name_of_organization"
              style={{ minWidth: "200px", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.name_of_organization
                    ? rowData?.name_of_organization
                    : "-"}
                </div>
              )}
            ></Column>
            <Column
              field="country"
              header="country"
              style={{ minWidth: "150px", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.country ? rowData?.country : "-"}
                </div>
              )}
            ></Column>
            {allKeys.map((key) => (
              <Column
                key={key}
                field={key}
                header={key}
                style={{ minWidth: "100px", borderRadius: "0px" }}
                body={(rowData) => {
                  const value = rowData.extra_fields[key];
                  return <div className="w-full flex">{value || "-"}</div>;
                }}
              />
            ))}
            <Column
              style={{ minWidth: "100px", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex justify-center gap-3">
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
                    onClick={() => handleDeleteList(rowData.id)}
                  >
                    <SoTrash className="w-5 h-5" />
                  </div>
                </div>
              )}
            ></Column>
          </DataTable>
        </div>
      </div>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <div className="absolute top-[-20px] left-0">
          <div className="bg-[#E8F0F7] rounded-full p-1">
            <SoXmarkCircle
              className="w-6 h-6 cursor-pointer text-red-600"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
        <div className="w-full max-w-[90%] mx-auto flex flex-col items-center justify-center space-y-5 pt-10 px-5">
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
                      onClick={() => reset()}
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

export default SingleRecipientListTable;
