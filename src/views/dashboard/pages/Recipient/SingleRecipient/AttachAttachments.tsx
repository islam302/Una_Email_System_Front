/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../../components/elements/Button";
import Modal from "../../../../../components/elements/Modal";
import { SoFileVerified, SoSend, SoUser, SoXmarkCircle } from "solom-icon";
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

const AttachAttachments = ({
  data,
  isOpen,
  setIsOpen,
  refetchData,
}: IProps) => {
  const { t, i18n } = useTranslation("recipient");

  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { id } = useParams();

  const cookie = new Cookies();
  const token = cookie.get("userLoggedES");
  const [attachmentsValue, setAttachmentsValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idR, setIdR] = useState<string | null>(null);
  const [existingExtraFields, setExistingExtraFields] = useState<
    Record<string, string>
  >({});

  const UsersList = data?.recipients || [];

  useEffect(() => {
    if (idR && UsersList.length > 0) {
      const selectedUser = UsersList.find((user) => user.id === idR);
      if (
        selectedUser?.extra_fields &&
        typeof selectedUser.extra_fields === "object" &&
        !Array.isArray(selectedUser.extra_fields)
      ) {
        setExistingExtraFields(selectedUser.extra_fields);
        setAttachmentsValue(selectedUser.extra_fields["attachments"] || "");
      } else {
        setExistingExtraFields({});
        setAttachmentsValue("");
      }
    }
  }, [idR, UsersList]);

  const onSubmit = async () => {
    if (!idR) {
      toast.error(t("errorSelectUser"), {
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);

    const updatedExtraFields = {
      ...existingExtraFields,
      attachments: attachmentsValue,
    };

    try {
      const { status } = await axiosInstance.patch(
        `recipients/list/${id}/update-recipient/${idR}/`,
        { extra_fields: updatedExtraFields },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (status === 200) {
        refetchData();
        toast.success(t("successUpdateAttachments"));
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

  return (
    <>
      <Button
        className="flex items-center gap-2 mb-5 bg-blue-400/90"
        onClick={() => setIsOpen(true)}
      >
        <SoFileVerified className="w-5 h-5" /> {t("addAttachments")}
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
                setAttachmentsValue("");
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
            <div
              className={`w-full flex ${
                currentLng === "ar" ? "flex-row" : "flex-row-reverse"
              } items-center gap-2`}
            >
              <Input
                type="text"
                placeholder={t("attachmentsValue")}
                value={attachmentsValue}
                onChange={(e) => setAttachmentsValue(e.target.value)}
                className="w-full"
                style={{ textAlign: currentLng === "ar" ? "right" : "left" }}
              />
            </div>
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
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AttachAttachments;
