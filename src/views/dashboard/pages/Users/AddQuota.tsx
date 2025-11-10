/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../components/elements/Button";
import Modal from "../../../../components/elements/Modal";
import {
  SoProfile,
  SoSend,
  SoTrash,
  SoWallet,
  SoXmarkCircle,
} from "solom-icon";
import Cookies from "universal-cookie";
import { SetStateAction } from "react";
import { Dropdown } from "primereact/dropdown";
import { toast } from "react-fox-toast";
import { useGetUsersQuery } from "../../../../app/functions/api/usersApi";
import axiosInstance from "../../../../config/axios.config";
import { AxiosError } from "axios";
import Input from "../../../../components/elements/Input";
import InputErrorMessage from "../../../../components/auth-errormsg/InputErrorMessage";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TAddAmount } from "../../../../types";
import { addAmountSchema } from "../../../../validation";
import { useTranslation } from "@/i18n/hooks";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  refetchData: () => void;
}

const AddQuota = ({ isOpen, setIsOpen, refetchData }: IProps) => {
  const { t, i18n } = useTranslation("user");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const cookie = new Cookies();
  const token = cookie.get("userLoggedES");

  const { data: Users } = useGetUsersQuery();

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<TAddAmount>({
    resolver: yupResolver(addAmountSchema),
    defaultValues: {
      amount: 0,
      user_id: "",
    },
  });

  const onSubmit = async (data: TAddAmount) => {
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
      <Button
        className="flex items-center gap-2 mb-5 bg-green-300 px-6"
        onClick={() => setIsOpen(true)}
      >
        <SoWallet className="w-5 h-5" /> {t("addQuota")}
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
                    <div className="w-full flex flex-col items-start gap-1">
                      <div
                        className={`w-full flex ${
                          currentLng === "ar" ? "flex-row" : "flex-row"
                        } items-center gap-2 border border-accent rounded-lg`}
                      >
                        <div
                          className={`bg-accent p-3 ${
                            currentLng === "ar"
                              ? "rounded-r-md"
                              : "rounded-l-md"
                          }`}
                        >
                          <SoProfile className="h-6 w-6 text-primary" />
                        </div>
                        <Controller
                          control={control}
                          name="user_id"
                          render={({ field }) => (
                            <Dropdown
                              {...field}
                              value={field.value}
                              onChange={(e) => field.onChange(e.value)}
                              options={Users}
                              optionLabel="username"
                              optionValue="id"
                              placeholder={t("selectUser")}
                              className="w-full bg-transparent border-0 shadow-none focus:ring-0 ring-0 focus:border-none"
                              panelClassName={
                                currentLng === "ar" ? "text-right" : "text-left"
                              }
                              style={{
                                padding: "0.75rem 0.25rem",
                                borderRadius: "0.5rem",
                                fontSize: "1rem",
                                textAlign:
                                  currentLng === "ar" ? "right" : "left",
                              }}
                              dir={dir}
                            />
                          )}
                        />
                      </div>
                      <InputErrorMessage msg={errors.user_id?.message} />
                    </div>
                    <div
                      className={`w-full ${
                        currentLng === "ar" ? "text-right" : "text-left"
                      } space-y-1`}
                    >
                      <div
                        className={`w-full flex ${
                          currentLng === "ar" ? "flex-row" : "flex-row"
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

export default AddQuota;
