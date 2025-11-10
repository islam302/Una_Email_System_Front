/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../../components/elements/Button";
import Modal from "../../../../../components/elements/Modal";
import { SoSend, SoTrash, SoUserList, SoXmarkCircle } from "solom-icon";
import { SetStateAction } from "react";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../../../config/axios.config";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recipientListSchema } from "../../../../../validation";
import { TRecipientList } from "../../../../../types";
import InputErrorMessage from "../../../../../components/auth-errormsg/InputErrorMessage";
import Input from "../../../../../components/elements/Input";
import { RECIPIENT_LIST_FORM } from "../../../../../data";
import { tokenSelector } from "../../../../../app/functions/token";
import { useSelector } from "react-redux";
import { AxiosError } from "axios";
import { useRefetchRecipientListsMutation } from "@/app/functions/api/recipientListsApi";
import { useTranslation } from "@/i18n/hooks";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  refetchData: () => void;
}

const AddRecipientList = ({ isOpen, setIsOpen, refetchData }: IProps) => {
  const { t, i18n } = useTranslation("recipient");

  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { access } = useSelector(tokenSelector);
  const [refetchLists] = useRefetchRecipientListsMutation();

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

  const onSubmit = async (data: TRecipientList) => {
    try {
      const { status } = await axiosInstance.post(`/recipients/list/`, data, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      if (status === 201) {
        reset();
        refetchData();
        refetchLists();
        setIsOpen(false);
        toast.success(t("successAddList"));
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
            currentLng === "ar" ? "flex-row" : "flex-row" // Error here.
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
            style={{
              textAlign: currentLng === "ar" ? "right" : "left",
            }}
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
        <SoUserList className="w-5 h-5" /> {t("addNewRecipientList")}
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
        <div
          className="w-full flex flex-col items-center justify-center space-y-5 pt-10 px-5"
          dir={dir}
        >
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

export default AddRecipientList;
