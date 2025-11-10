/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../../components/elements/Button";
import Modal from "../../../../../components/elements/Modal";
import {
  SoAddSquare,
  SoSend,
  SoTrash,
  SoUser,
  SoXmarkCircle,
} from "solom-icon";
import Cookies from "universal-cookie";
import { SetStateAction, useEffect, useState } from "react";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../../../config/axios.config";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import Input from "../../../../../components/elements/Input";
import Select from "react-select";
import { List } from "@/components/dashboard-tables/Recipient/SingleList";
import { useTranslation } from "@/i18n/hooks";

interface IProps {
  data: { recipients: List[] } | undefined;
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  refetchData: () => void;
}

interface ExtraField {
  key: string;
  value: string;
}

const AttachNewValue = ({ data, isOpen, setIsOpen, refetchData }: IProps) => {
  const { t, i18n } = useTranslation("recipient");

  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { id } = useParams();

  const cookie = new Cookies();
  const token = cookie.get("userLoggedES");
  const [extraFields, setExtraFields] = useState<ExtraField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idR, setIdR] = useState<string | null>("");
  const [existingExtraFields, setExistingExtraFields] = useState<ExtraField[]>(
    []
  );

  const UsersList = data?.recipients || [];

  const addExtraField = () => {
    setExtraFields([...extraFields, { key: "", value: "" }]);
  };

  const removeExtraField = (index: number) => {
    const newFields = extraFields.filter((_, i) => i !== index);
    setExtraFields(newFields);
  };

  const handleExtraFieldChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newFields = [...extraFields];
    newFields[index][field] = value;
    setExtraFields(newFields);
  };

  const handleExistingFieldChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedFields = [...existingExtraFields];
    updatedFields[index][field] = value;
    setExistingExtraFields(updatedFields);
  };

  const removeExistingField = (index: number) => {
    const updatedFields = existingExtraFields.filter((_, i) => i !== index);
    setExistingExtraFields(updatedFields);
  };

  const validateFields = () => {
    for (const field of extraFields) {
      if (!field.key.trim() || !field.value.trim()) {
        toast.error(t("errorAllFieldsRequired"), {
          duration: 4000,
        });
        return false;
      }
    }
    for (const field of existingExtraFields) {
      if (!field.key.trim() || !field.value.trim()) {
        toast.error(t("errorAllFieldsRequired"), {
          duration: 4000,
        });
        return false;
      }
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validateFields()) return;

    setIsSubmitting(true);

    const allFields = [...existingExtraFields, ...extraFields];
    const allFieldsObj = allFields.reduce((acc, field) => {
      if (field.key.trim() && field.value.trim()) {
        acc[field.key] = field.value;
      }
      return acc;
    }, {} as Record<string, string>);

    try {
      const { status } = await axiosInstance.patch(
        `recipients/list/${id}/update-recipient/${idR}/`,
        { extra_fields: allFieldsObj },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (status === 200) {
        refetchData();
        toast.success(t("successFieldsUpdated"));
        setExtraFields([]);
        setIsOpen(false);
      }
    } catch (err) {
      const error = err as AxiosError<any>;
      const data = error.response?.data as Record<string, string[]>;
      const firstErrorMessage = Object.entries(data)[0]?.[1]?.[0];
      toast.error(firstErrorMessage, {
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (idR && UsersList.length > 0) {
      const selectedUser = UsersList.find((user) => user.id === idR);
      if (selectedUser?.extra_fields) {
        const fields = Object.entries(selectedUser.extra_fields).map(
          ([key, value]) => ({
            key,
            value: String(value),
          })
        );
        setExistingExtraFields(fields);
        setExtraFields([]);
      } else {
        setExistingExtraFields([]);
        setExtraFields([]);
      }
    }
  }, [idR, UsersList]);

  return (
    <>
      <Button
        className="flex items-center gap-2 mb-5 bg-red-400/90"
        onClick={() => setIsOpen(true)}
      >
        <SoAddSquare className="w-5 h-5" /> {t("addNewField")}
      </Button>
      <Modal one isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <div
          className={`absolute top-[-20px] ${
            currentLng === "ar" ? "left-0" : "right-0"
          }`}
          dir={dir}
        >
          <div className="bg-[#E8F0F7] rounded-full p-1">
            <SoXmarkCircle
              className="w-6 h-6 cursor-pointer text-red-600"
              onClick={() => {
                setIsOpen(false);
                setExtraFields([]);
              }}
            />
          </div>
        </div>
        <div
          className="w-full flex flex-col items-center justify-center space-y-5 pt-10 px-5 relative"
          dir={dir}
        >
          <div className="w-full flex flex-col items-center gap-3">
            <div
              className={`w-full flex ${
                currentLng === "ar" ? "flex-row-reverse" : "flex-row"
              } items-center gap-2 border border-accent rounded-lg`}
            >
              <div
                className={`bg-accent p-2 ${
                  currentLng === "ar" ? "rounded-l-md" : "rounded-r-md"
                }`}
              >
                <SoUser className="h-6 w-6 text-primary" />
              </div>
              <Select
                options={UsersList}
                getOptionLabel={(option) => option.name || ""}
                getOptionValue={(option) => option.id || ""}
                value={UsersList?.find((user) => user.id === idR) || null}
                onChange={(selectedOption) =>
                  setIdR(selectedOption?.id || null)
                }
                className="w-full react-select-container"
                classNamePrefix="react-select"
                placeholder={t("selectRecipient")}
                noOptionsMessage={() => t("noOptions")}
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                    "&:hover": { border: "none" },
                    textAlign: currentLng === "ar" ? "right" : "left",
                  }),
                  menu: (base) => ({
                    ...base,
                    textAlign: currentLng === "ar" ? "right" : "left",
                  }),
                }}
              />
            </div>
          </div>
          <div className="w-full flex flex-col items-center gap-3">
            {existingExtraFields.map((field, index) => (
              <div
                key={`existing-${index}`}
                className="w-full flex flex-row items-center gap-2"
              >
                <Input
                  type="text"
                  placeholder={t("fieldName")}
                  value={field.key}
                  onChange={(e) =>
                    handleExistingFieldChange(index, "key", e.target.value)
                  }
                  className="w-1/2"
                  disabled={field.key === "attachments"}
                  style={{
                    cursor:
                      field.key === "attachments" ? "not-allowed" : "none",
                  }}
                />
                <Input
                  type="text"
                  placeholder={t("fieldValue")}
                  value={field.value}
                  onChange={(e) =>
                    handleExistingFieldChange(index, "value", e.target.value)
                  }
                  className="w-1/2"
                />
                <Button
                  type="button"
                  onClick={() => removeExistingField(index)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  <SoTrash className="w-5 h-5" />
                </Button>
              </div>
            ))}
            {extraFields.map((field, index) => (
              <div
                key={`new-${index}`}
                className="w-full flex flex-row items-center gap-2"
              >
                <Input
                  type="text"
                  placeholder={t("newFieldName")}
                  value={field.key}
                  onChange={(e) =>
                    handleExtraFieldChange(index, "key", e.target.value)
                  }
                  className="w-1/2"
                />
                <Input
                  type="text"
                  placeholder={t("newFieldValue")}
                  value={field.value}
                  onChange={(e) =>
                    handleExtraFieldChange(index, "value", e.target.value)
                  }
                  className="w-1/2"
                />
                <Button
                  type="button"
                  onClick={() => removeExtraField(index)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  <SoTrash className="w-5 h-5" />
                </Button>
              </div>
            ))}
            <Button
              fullWidth
              type="button"
              onClick={addExtraField}
              className="flex items-center gap-2 mt-2"
            >
              <SoAddSquare className="w-5 h-5" /> {t("addNewField")}
            </Button>
          </div>
          <div
            className={`w-full flex ${
              currentLng === "ar" ? "flex-row" : "flex-row-reverse"
            } items-center gap-3 pt-5`}
          >
            <Button
              type="button"
              onClick={onSubmit}
              isLoading={isSubmitting}
              className="w-full flex items-center gap-2"
            >
              <SoSend className="h-5 w-5" />
              {t("add")}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setExtraFields([]);
                setExistingExtraFields([]);
              }}
              className="w-full flex items-center gap-2 bg-[#D20202] hover:bg-red-500"
            >
              <SoTrash className="h-5 w-5" />
              {t("deleteAll")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AttachNewValue;
