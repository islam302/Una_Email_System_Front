/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Button from "../../../components/elements/Button";
import Input from "../../../components/elements/Input";
import { RESET_FORM } from "../../../data";
import { yupResolver } from "@hookform/resolvers/yup";
import InputErrorMessage from "../../../components/auth-errormsg/InputErrorMessage";
import { SubmitHandler, useForm } from "react-hook-form";
import { resetSchema } from "../../../validation";
import axiosInstance from "../../../config/axios.config";
import { toast } from "react-fox-toast";
import { AxiosError } from "axios";
import Cookies from "universal-cookie";
import { Helmet } from "react-helmet-async";
import { SoArrowRight } from "solom-icon";
import { useTranslation } from "@/i18n/hooks";

interface IFormInput {
  password: string;
  password_confirmation: string;
}

const ResetPasswordPage = () => {
  const { t, i18n } = useTranslation("auth");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const cookie = new Cookies();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(resetSchema),
  });

  const token = searchParams.get("token");
  const uid = searchParams.get("uid");

  useEffect(() => {
    if (!token || !uid) {
      toast.error(t("resetPassword.invalidResetLink"), {
        duration: 4000,
      });
      navigate("/auth/login", { replace: true });
    }
  }, [token, uid, navigate, t]);

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    if (!token || !uid) return;
    setIsLoading(true);
    try {
      const { status } = await axiosInstance.post(
        `auth/password-reset-confirm/${uid}/${token}/`,
        {
          password: data.password,
        }
      );

      if (status === 200) {
        cookie.remove("userLoggedES");
        toast.success(t("resetPassword.successReset"));
        setTimeout(() => {
          navigate("/auth/login", { replace: true });
        }, 1000);
      }
    } catch (err) {
      const error = err as AxiosError<any>;
      const data = error.response?.data as Record<string, string[]>;
      const firstErrorMessage = Object.entries(data)[0]?.[1]?.[0];
      toast.error(firstErrorMessage, {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResetForm = RESET_FORM.map(
    ({ name, type, id, validation }, idx) => (
      <div key={idx}>
        <div className="space-y-2 pb-1">
          <label htmlFor={id} className="text-black text-xl">
            {t(`resetPassword.labels.${name}`)}
          </label>
          <Input
            id={id}
            type={type}
            placeholder={t(`resetPassword.placeholders.${name}`)}
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
      className="w-full flex flex-row items-center justify-center gap-10 mt-44"
      dir={dir}
    >
      <Helmet>
        <title>EmailSender | {t("resetPassword.resetPassword")}</title>
      </Helmet>
      <div className="w-3/4 flex flex-col items-center justify-center space-y-8">
        <h2
          className={`text-3xl text-black font-medium text-center ${
            currentLng === "ar" ? "text-right" : "text-left"
          }`}
        >
          {t("resetPassword.resetPassword")}{" "}
          <span className="text-primary">Email Sender</span>
        </h2>
        <form
          className={`w-[80%] space-y-3 mx-auto max-sm:w-full ${
            currentLng === "ar" ? "text-right" : "text-left"
          }`}
          onSubmit={handleSubmit(onSubmit)}
          dir={dir}
        >
          {renderResetForm}
          <div className="flex flex-col items-center gap-5">
            <Button fullWidth isLoading={isLoading}>
              {t("resetPassword.confirmReset")}
            </Button>
            <Link
              to="/auth/login"
              className={`w-full flex items-center ${
                currentLng === "ar" ? "justify-end" : "justify-start"
              } gap-2 text-gray-600 text-base font-medium`}
            >
              <SoArrowRight
                className={`w-5 h-5 ${
                  currentLng === "ar" ? "transform rotate-180" : ""
                }`}
              />
              {t("resetPassword.backToLogin")}
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
