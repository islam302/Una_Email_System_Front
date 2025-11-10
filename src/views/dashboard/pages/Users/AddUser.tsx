/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../components/elements/Button";
import Modal from "../../../../components/elements/Modal";
import { SoSend, SoTrash, SoUserList, SoXmarkCircle } from "solom-icon";
import { SetStateAction, useState } from "react";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../../config/axios.config";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addUserSchema } from "../../../../validation";
import { TAddUser } from "../../../../types";
import InputErrorMessage from "../../../../components/auth-errormsg/InputErrorMessage";
import Input from "../../../../components/elements/Input";
import { ADD_USER_FORM } from "../../../../data";
import { tokenSelector } from "../../../../app/functions/token";
import { useSelector } from "react-redux";
import { AxiosError } from "axios";
import { useTranslation } from "@/i18n/hooks";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  refetchData: () => void;
}

const AddUser = ({ isOpen, setIsOpen, refetchData }: IProps) => {
  const { t, i18n } = useTranslation("user");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { access } = useSelector(tokenSelector);

  const [domainsInputs, setDomainsInputs] = useState<string[]>([""]);
  const [senderEmailsInputs, setSenderEmailsInputs] = useState<string[]>([""]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
  } = useForm<TAddUser>({
    resolver: yupResolver(addUserSchema),
    defaultValues: {
      username: "",
      email: "",
      organization: "",
      password: "",
      sender_name: "",
      sender_emails: [],
      domains: [],
    },
  });

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

  const onSubmit = async (data: TAddUser) => {
    try {
      const cleanedFormData = {
        ...data,
        domains: domainsInputs.filter((item) => item.trim() !== ""),
        sender_emails: senderEmailsInputs.filter((item) => item.trim() !== ""),
        role: "user",
      };
      const { status } = await axiosInstance.post(
        `/auth/users/`,
        cleanedFormData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (status === 201) {
        reset();
        setDomainsInputs([""]);
        setSenderEmailsInputs([""]);
        refetchData();
        setIsOpen(false);
        toast.success(t("successAddUser"));
      }
    } catch (err) {
      const error = err as AxiosError<any>;
      const data = error.response?.data as Record<string, string[]>;
      const firstErrorMessage = Object.entries(data)[0]?.[1]?.[0];
      const errorMessage = firstErrorMessage || t("errorAddUser");
      toast.error(errorMessage, {
        duration: 4000,
      });
    }
  };

  const renderRecipientForm = ADD_USER_FORM.map(
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
                  placeholder={t(`${name}`)}
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
              placeholder={t(`${name}`)}
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

  return (
    <>
      <Button
        className="flex items-center gap-2 mb-5"
        onClick={() => setIsOpen(true)}
      >
        <SoUserList className="w-5 h-5" /> {t("addNewUser")}
      </Button>
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
            onSubmit={handleSubmit(onSubmit)}
            dir={dir}
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
                      {t("add")}
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
    </>
  );
};

export default AddUser;
