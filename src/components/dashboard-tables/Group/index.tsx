/* eslint-disable @typescript-eslint/no-explicit-any */
import "../Tables.style.css";
import { useEffect, useState } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { tokenSelector } from "../../../app/functions/token";
import { useSelector } from "react-redux";
import LoadingScreen from "../../website-loading";
import {
  SoEye,
  SoTrash,
  SoSend,
  SoXmarkCircle,
  SoEditNote,
  SoUserList,
} from "solom-icon";
import { Link } from "react-router-dom";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../config/axios.config";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recipientGroupSchema } from "../../../validation";
import { TRecipientGroup, TRecipientList } from "../../../types";
import InputErrorMessage from "../../auth-errormsg/InputErrorMessage";
import Input from "../../elements/Input";
import { RECIPIENT_GROUP_FORM } from "../../../data";
import Button from "../../elements/Button";
import Modal from "../../elements/Modal";
import { useGetRecipientListsQuery } from "../../../app/functions/api/recipientListsApi";
import Select from "react-select";
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
  recipient_lists: string[];
}

const GroupListTable = ({
  data,
  error,
  isLoading,
  refetchData,
}: RecipientListTableProps) => {
  const { t, i18n } = useTranslation("group");

  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { access } = useSelector(tokenSelector);

  const [editList, setEditList] = useState<IUpdateList>({
    id: "",
    name: "",
    recipient_lists: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);

  const RecipientListData = data || [];
  const { data: List, isLoading: isLoadingRec } = useGetRecipientListsQuery();

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<TRecipientGroup>({
    resolver: yupResolver(recipientGroupSchema),
    defaultValues: {
      name: "",
      recipient_lists: [],
    },
  });

  useEffect(() => {
    if (isOpen && editList.id) {
      reset({
        name: editList.name,
        recipient_lists: editList.recipient_lists || [],
      });
    }
  }, [isOpen, editList, reset]);

  const handleEditList = async (formData: TRecipientGroup) => {
    try {
      const { status } = await axiosInstance.patch(
        `recipients/recipient-groups/${editList?.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (status === 200) {
        refetchData();
        toast.success(t("successUpdateGroup"));
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
      await axiosInstance.delete(`recipients/recipient-groups/${id}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
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

  const renderRecipientForm = RECIPIENT_GROUP_FORM.map(
    ({ name, placeholder, type, validation, icon: Icon }, idx) => (
      <div
        key={idx}
        className={`w-full space-y-1 ${
          currentLng === "ar" ? "text-right" : "text-left"
        }`}
      >
        {name === "recipient_lists" ? null : (
          <div className="w-full">
            <div
              className={`w-full flex ${
                currentLng === "ar" ? "flex-row" : "flex-row"
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
        )}
      </div>
    )
  );

  if (isLoading || isLoadingRec) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center">
        {t("errorLoadingData")}: {error.message || t("unexpectedError")}
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
            emptyMessage={t("noListsAvailable")}
          >
            <Column
              field="name"
              header={t("headerGroupName")}
              style={{ width: "40%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.name ? rowData?.name : t("notAvailable")}
                </div>
              )}
            />
            <Column
              field="recipients"
              header={t("headerListCount")}
              style={{ width: "40%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.recipient_lists
                    ? rowData?.recipient_lists.length
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
                    to={`/dashboard/groups/${rowData?.id}`}
                    className="bg-green-200 text-green-600 p-1 rounded-md"
                  >
                    <SoEye className="w-5 h-5" />
                  </Link>
                  <div
                    className="bg-blue-200 text-blue-600 p-1 rounded-md"
                    onClick={() => {
                      setEditList({
                        id: rowData?.id,
                        name: rowData?.name,
                        recipient_lists: rowData?.recipient_lists,
                      });
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
                    <div className="w-full flex flex-col items-center gap-3">
                      <div
                        className={`w-full flex ${
                          currentLng === "ar" ? "flex-row-reverse" : "flex-row"
                        } items-center gap-2 border border-accent rounded-lg`}
                      >
                        <div
                          className={`bg-accent p-2 ${
                            currentLng === "ar"
                              ? "rounded-l-md"
                              : "rounded-r-md"
                          }`}
                        >
                          <SoUserList className="h-6 w-6 text-primary" />
                        </div>
                        <Controller
                          name="recipient_lists"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isMulti
                              options={List}
                              getOptionLabel={(option) => option.name}
                              getOptionValue={(option) => option.id}
                              value={
                                List &&
                                List.filter((user) =>
                                  field.value?.includes(user.id)
                                )
                              }
                              onChange={(selected) =>
                                field.onChange(
                                  selected?.map((option) => option.id)
                                )
                              }
                              className="w-full react-select-container"
                              classNamePrefix="react-select"
                              placeholder={t("selectRecipientLists")}
                              noOptionsMessage={() => t("noOptions")}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  border: "none",
                                  boxShadow: "none",
                                  "&:hover": { border: "none" },
                                  textAlign:
                                    currentLng === "ar" ? "right" : "left",
                                }),
                                menu: (base) => ({
                                  ...base,
                                  textAlign:
                                    currentLng === "ar" ? "right" : "left",
                                }),
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="w-full flex items-end">
                        <InputErrorMessage
                          msg={errors.recipient_lists?.message}
                        />
                      </div>
                    </div>
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

export default GroupListTable;
