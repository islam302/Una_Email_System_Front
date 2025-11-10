/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../../components/elements/Button";
import Modal from "../../../../../components/elements/Modal";
import { SoSend, SoTrash, SoUserList, SoXmarkCircle } from "solom-icon";
import Cookies from "universal-cookie";
import { SetStateAction } from "react";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../../../config/axios.config";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recipientSchema } from "../../../../../validation";
import { TRecipient } from "../../../../../types";
import InputErrorMessage from "../../../../../components/auth-errormsg/InputErrorMessage";
import Input from "../../../../../components/elements/Input";
import { RECIPIENT_FORM } from "../../../../../data";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { useTranslation } from "@/i18n/hooks";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  refetchData: () => void;
}

const AddRecipient = ({ isOpen, setIsOpen, refetchData }: IProps) => {
  const { t, i18n } = useTranslation("recipient");

  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { id } = useParams();
  const cookie = new Cookies();
  const token = cookie.get("userLoggedES");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<TRecipient>({
    resolver: yupResolver(recipientSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "",
      job_title: "",
      phone_number: "",
      name_of_organization: "",
    },
  });

  const onSubmit = async (data: TRecipient) => {
    try {
      const { status } = await axiosInstance.post(
        `/recipients/list/${id}/add-recipient/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (status === 201) {
        reset();
        setIsOpen(false);
        refetchData();
        toast.success(t("addNewRecipientMsg"));
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

  const renderRecipientForm = RECIPIENT_FORM.map(
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
            style={{
              textAlign: currentLng === "ar" ? "right" : "left",
            }}
            className="w-full focus:outline-none focus:border-0 focus:ring-transparent ring-transparent border-0 bg-transparent"
            {...register(name, validation)}
          />
        </div>
        {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
      </div>
    )
  );

  return (
    <>
      <Button
        className="flex items-center gap-2 mb-5"
        onClick={() => setIsOpen(true)}
      >
        <SoUserList className="w-5 h-5" /> {t("addNewRecipient")}
      </Button>
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
        <div className="w-full flex flex-col items-center justify-center space-y-5 pt-10 px-5">
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
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
    </>
  );
};

export default AddRecipient;
