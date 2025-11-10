/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "../Tables.style.css";
import { useEffect, useState } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import LoadingScreen from "../../website-loading";
import { TAddUser, TUpdateUser } from "../../../types";
import Modal from "../../elements/Modal";
import { SoEditNote, SoSend, SoTrash, SoXmarkCircle } from "solom-icon";
import Button from "../../elements/Button";
import InputErrorMessage from "../../auth-errormsg/InputErrorMessage";
import Input from "../../elements/Input";
import axiosInstance from "../../../config/axios.config";
import { toast } from "react-fox-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { tokenSelector } from "../../../app/functions/token";
import { updateUserSchema } from "../../../validation";
import { UPDATE_USER_FORM } from "../../../data";
import { AxiosError } from "axios";
import AddQuotaTable from "@/views/dashboard/pages/Users/AddQuotaTable";
import { useTranslation } from "@/i18n/hooks";

interface UsersListTableProps {
  data: TAddUser[] | undefined;
  isLoading: boolean;
  error: any;
  refetchData: () => void;
}

interface IUpdateUser {
  id: string;
  username: string;
  email: string;
  organization: string;
  sender_name: string;
  sender_emails: string[];
  domains: string[];
}

const UsersList = ({
  data,
  error,
  isLoading,
  refetchData,
}: UsersListTableProps) => {
  const { t, i18n } = useTranslation("user");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { access } = useSelector(tokenSelector);

  const [editList, setEditList] = useState<IUpdateUser>({
    id: "",
    username: "",
    email: "",
    organization: "",
    domains: [],
    sender_emails: [],
    sender_name: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenQuota, setIsOpenQuota] = useState(false);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [domainsInputs, setDomainsInputs] = useState<string[]>([""]);
  const [senderEmailsInputs, setSenderEmailsInputs] = useState<string[]>([""]);

  const UsersListData = Array.isArray(data) ? data : [];

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
  } = useForm<TUpdateUser>({
    resolver: yupResolver(updateUserSchema),
    defaultValues: {
      username: "",
      email: "",
      organization: "",
      domains: [],
      sender_emails: [],
      sender_name: "",
    },
  });

  useEffect(() => {
    if (isOpen && editList.id) {
      reset(editList);
      setDomainsInputs(editList.domains.length ? editList.domains : [""]);
      setSenderEmailsInputs(
        editList.sender_emails.length ? editList.sender_emails : [""]
      );
      setValue("domains", editList.domains.length ? editList.domains : []);
      setValue(
        "sender_emails",
        editList.sender_emails.length ? editList.sender_emails : []
      );
    }
  }, [isOpen, editList, reset, setValue]);

  const handleEditList = async (formData: TUpdateUser) => {
    try {
      const cleanedFormData = {
        ...formData,
        domains: domainsInputs.filter((item) => item.trim() !== ""),
        sender_emails: senderEmailsInputs.filter((item) => item.trim() !== ""),
      };
      const { status } = await axiosInstance.patch(
        `auth/users/${editList?.id}/`,
        cleanedFormData,
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
      await axiosInstance.delete(`auth/users/${id}/`, {
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

  const addInputField = (field: "domains" | "sender_emails") => {
    if (field === "domains") {
      setDomainsInputs([...domainsInputs, ""]);
    } else if (field === "sender_emails") {
      setSenderEmailsInputs([...senderEmailsInputs, ""]);
    }
  };

  const removeInputField = (
    field: "domains" | "sender_emails",
    index: number
  ) => {
    if (field === "domains" && domainsInputs.length > 1) {
      const newInputs = domainsInputs.filter((_, i) => i !== index);
      setDomainsInputs(newInputs);
      setValue(
        "domains",
        newInputs.filter((item) => item.trim() !== "")
      );
    } else if (field === "sender_emails" && senderEmailsInputs.length > 1) {
      const newInputs = senderEmailsInputs.filter((_, i) => i !== index);
      setSenderEmailsInputs(newInputs);
      setValue(
        "sender_emails",
        newInputs.filter((item) => item.trim() !== "")
      );
    }
  };

  const handleInputChange = (
    field: "domains" | "sender_emails",
    index: number,
    value: string
  ) => {
    if (field === "domains") {
      const newInputs = [...domainsInputs];
      newInputs[index] = value;
      setDomainsInputs(newInputs);
      setValue(
        "domains",
        newInputs.filter((item) => item.trim() !== "")
      );
    } else if (field === "sender_emails") {
      const newInputs = [...senderEmailsInputs];
      newInputs[index] = value;
      setSenderEmailsInputs(newInputs);
      setValue(
        "sender_emails",
        newInputs.filter((item) => item.trim() !== "")
      );
    }
  };

  const renderRecipientForm = UPDATE_USER_FORM.map(
    ({ name, type, validation, icon: Icon }, idx) => {
      if (name === "domains" || name === "sender_emails") {
        const inputs = name === "domains" ? domainsInputs : senderEmailsInputs;
        return (
          <div
            key={idx}
            className={`w-full ${
              currentLng === "ar" ? "text-right" : "text-left"
            } space-y-1`}
          >
            {inputs.map((value, index) => (
              <div
                key={`${name}-${index}`}
                className={`w-full flex ${
                  currentLng === "ar" ? "flex-row" : "flex-row-reverse"
                } items-center gap-2 border border-accent rounded-lg mb-2`}
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
                  placeholder={t(`placeholders.${name}`)}
                  className="w-full focus:outline-none focus:border-0 focus:ring-transparent ring-transparent border-0 bg-transparent"
                  style={{ textAlign: currentLng === "ar" ? "right" : "left" }}
                  dir={dir}
                  value={value}
                  onChange={(e) =>
                    handleInputChange(name, index, e.target.value)
                  }
                />
                {inputs.length > 1 && (
                  <div
                    className="p-3 cursor-pointer"
                    onClick={() => removeInputField(name, index)}
                  >
                    <SoTrash className="h-5 w-5 text-red-600" />
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={() => addInputField(name)}
              className="w-full mt-2 bg-primary hover:bg-accent text-white"
            >
              {t(`add_${name}`)}
            </Button>
            {errors[name as keyof typeof errors] && (
              <InputErrorMessage
                msg={(errors[name as keyof typeof errors] as any)?.message}
              />
            )}
          </div>
        );
      }
      return (
        <div
          key={idx}
          className={`w-full ${
            currentLng === "ar" ? "text-right" : "text-left"
          } space-y-1`}
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
              placeholder={t(`placeholders.${name}`)}
              className="w-full focus:outline-none focus:border-0 focus:ring-transparent ring-transparent border-0 bg-transparent"
              style={{ textAlign: currentLng === "ar" ? "right" : "left" }}
              dir={dir}
              {...register(name, validation)}
            />
          </div>
          {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
        </div>
      );
    }
  );

  const onPageChange = (event: DataTablePageEvent) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const formatArrayField = (arr: string[]): string => {
    if (!arr || arr.length === 0) return "null";
    return arr.join(", ") + (arr.length > 0 ? "" : "");
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
            value={UsersListData}
            removableSort
            tableStyle={{ minWidth: "100%", cursor: "pointer" }}
            paginator
            rows={rows}
            first={first}
            onPage={onPageChange}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rowsPerPageOptions={[10, 20, 30]}
            totalRecords={UsersListData.length}
            emptyMessage={t("noListsAvailable")}
          >
            <Column
              field="username"
              header={t("username")}
              style={{ width: "20%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.username ? rowData?.username : "null"}
                </div>
              )}
            ></Column>
            <Column
              field="email"
              header={t("email")}
              style={{ width: "20%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.email ? rowData?.email : "null"}
                </div>
              )}
            ></Column>
            {/* <Column
              field="email_quota"
              header={t("quota")}
              style={{ width: "10%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.email_quota ? rowData?.email_quota : "0"}
                </div>
              )}
            ></Column> */}
            <Column
              field="remaining_quota"
              header={t("remainingQuota")}
              style={{ width: "20%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.remaining_quota ? rowData?.remaining_quota : "0"}
                </div>
              )}
            ></Column>
            {/* <Column
              field="used_quota"
              header={t("usedQuota")}
              style={{ width: "20%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.used_quota ? rowData?.used_quota : "0"}
                </div>
              )}
            ></Column> */}
            <Column
              field="organization"
              header={t("organization")}
              style={{ width: "15%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.organization ? rowData?.organization : "null"}
                </div>
              )}
            ></Column>
            <Column
              field="sender_name"
              header={t("senderName")}
              style={{ width: "15%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.sender_name ? rowData?.sender_name : "null"}
                </div>
              )}
            ></Column>
            <Column
              field="sender_emails"
              header={"Sender Emails"}
              style={{ width: "15%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {formatArrayField(rowData?.sender_emails)}
                </div>
              )}
            ></Column>
            <Column
              field="domains"
              header={t("domains")}
              style={{ width: "15%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {formatArrayField(rowData?.domains)}
                </div>
              )}
            ></Column>
            <Column
              field="actions"
              style={{ width: "5%", borderRadius: "0px" }}
              body={(rowData) => (
                <div
                  className={`flex items-center ${
                    currentLng === "ar" ? "justify-end" : "justify-start"
                  } gap-3`}
                >
                  <AddQuotaTable
                    id={rowData.id}
                    quota={rowData.email_quota}
                    isOpen={isOpenQuota}
                    setIsOpen={setIsOpenQuota}
                    refetchData={refetchData}
                  />
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
        >
          <div className="bg-[#E8F0F7] rounded-full p-1">
            <SoXmarkCircle
              className="w-6 h-6 cursor-pointer text-red-600"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center space-y-5 pt-10 px-5">
          <form
            className={`w-full ${
              currentLng === "ar" ? "text-right" : "text-left"
            }`}
            dir={dir}
            onSubmit={handleSubmit(handleEditList)}
          >
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
                        setDomainsInputs([""]);
                        setSenderEmailsInputs([""]);
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

export default UsersList;
