/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../components/elements/Button";
import Modal from "../../../../components/elements/Modal";
import { SoSend, SoTrash, SoWallet, SoXmarkCircle } from "solom-icon";
import Cookies from "universal-cookie";
import { SetStateAction } from "react";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../../config/axios.config";
import { AxiosError } from "axios";
import Input from "../../../../components/elements/Input";
import InputErrorMessage from "../../../../components/auth-errormsg/InputErrorMessage";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TAddAmountTable } from "../../../../types";
import { addAmountTableSchema } from "../../../../validation";
import { useTranslation } from "@/i18n/hooks";

interface IProps {
  id: string;
  quota: number;
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  refetchData: () => void;
}

const AddQuotaTable = ({
  id,
  quota,
  isOpen,
  setIsOpen,
  refetchData,
}: IProps) => {
  const { t, i18n } = useTranslation("user");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const cookie = new Cookies();
  const token = cookie.get("userLoggedES");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<TAddAmountTable>({
    resolver: yupResolver(addAmountTableSchema),
    defaultValues: {
      amount: quota,
      user_id: id,
    },
  });

  const onSubmit = async (data: TAddAmountTable) => {
    try {
      const { status } = await axiosInstance.post(`auth/add-quota/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (status === 200) {
        reset();
        refetchData();
        toast.success(t("successAddQuota"));
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

  return (
    <>
      <div
        className="bg-green-200 text-green-600 p-1 rounded-md"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <SoWallet className="w-5 h-5" />
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
              onClick={() => {
                setIsOpen(false);
              }}
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
                    <div
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
                            currentLng === "ar"
                              ? "rounded-r-md"
                              : "rounded-l-md"
                          }`}
                        >
                          <SoWallet className="h-6 w-6 text-primary" />
                        </div>
                        <Input
                          type="number"
                          placeholder={t("enterQuotaAmount")}
                          className="w-full focus:outline-none focus:border-0 focus:ring-transparent ring-transparent border-0 bg-transparent"
                          style={{
                            textAlign: currentLng === "ar" ? "right" : "left",
                          }}
                          dir={dir}
                          {...register("amount")}
                        />
                      </div>
                      <InputErrorMessage msg={errors.amount?.message} />
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
                      {t("send")}
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

export default AddQuotaTable;
