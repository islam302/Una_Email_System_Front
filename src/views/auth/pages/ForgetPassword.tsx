/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Button from "../../../components/elements/Button";
import Input from "../../../components/elements/Input";
import { FORGET_FORM } from "../../../data";
import { yupResolver } from "@hookform/resolvers/yup";
import InputErrorMessage from "../../../components/auth-errormsg/InputErrorMessage";
import { SubmitHandler, useForm } from "react-hook-form";
import { forgetSchema } from "../../../validation";
import axiosInstance from "../../../config/axios.config";
import { toast } from "react-fox-toast";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AxiosError } from "axios";
import { useTranslation } from "@/i18n/hooks";

interface IFormInput {
  email: string;
}

const ForgetPasswordPage = () => {
  const { t, i18n } = useTranslation("auth");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(forgetSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    setIsLoading(true);
    try {
      const { status } = await axiosInstance.post("auth/password-reset/", data);

      if (status === 200) {
        toast.success(t("forgetPassword.successSendReset"));
      }
    } catch (err) {
      const error = err as AxiosError<any>;
      const data = error.response?.data as Record<string, string[]>;
      const firstErrorMessage = Object.entries(data)[0]?.[1]?.[0];
      if (error?.response?.status === 404) {
        toast.error(t("forgetPassword.accountNotFound"));
        return;
      } else {
        toast.error(firstErrorMessage, {
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = FORGET_FORM.map(
    ({ name, type, id, validation }, idx) => (
      <div key={idx}>
        <div className="space-y-2 pb-1">
          <label htmlFor={id} className="text-black text-xl">
            {t(`forgetPassword.labels.${name}`)}
          </label>
          <Input
            id={id}
            type={type}
            placeholder={t(`forgetPassword.placeholders.${name}`)}
            style={{ textAlign: currentLng === "ar" ? "right" : "left" }}
            dir={dir}
            {...register(name, validation)}
          />
        </div>
        {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
      </div>
    )
  );

  return (
    <section
      className="w-full flex flex-row items-center justify-center gap-10 mt-56"
      dir={dir}
    >
      <Helmet>
        <title>EmailSender | {t("forgetPassword.forgetPassword")}</title>
      </Helmet>
      <div className="w-3/4 flex flex-col items-center justify-center space-y-8">
        <h2
          className={`text-3xl text-black font-medium text-center ${
            currentLng === "ar" ? "text-right" : "text-left"
          }`}
        >
          {t("forgetPassword.forgetPassword")}{" "}
          <span className="text-primary">Email Sender</span>
        </h2>
        <form
          className={`w-[80%] space-y-3 mx-auto max-sm:w-full ${
            currentLng === "ar" ? "text-right" : "text-left"
          }`}
          onSubmit={handleSubmit(onSubmit)}
          dir={dir}
        >
          {renderLoginForm}
          <Button fullWidth isLoading={isLoading}>
            {t("forgetPassword.send")}
          </Button>
          <div
            className={`flex flex-col ${
              currentLng === "ar" ? "items-end" : "items-start"
            } space-y-1`}
          >
            <Link to={"/auth/login"} className="text-black">
              <span className="text-sm ml-1 text-black">
                {t("forgetPassword.rememberedPassword")}
              </span>
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ForgetPasswordPage;
