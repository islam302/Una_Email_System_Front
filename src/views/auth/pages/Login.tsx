/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Button from "../../../components/elements/Button";
import Input from "../../../components/elements/Input";
import { LOGIN_FORM } from "../../../data";
import { yupResolver } from "@hookform/resolvers/yup";
import InputErrorMessage from "../../../components/auth-errormsg/InputErrorMessage";
import { SubmitHandler, useForm } from "react-hook-form";
import { loginSchema } from "../../../validation";
import axiosInstance from "../../../config/axios.config";
import { toast } from "react-fox-toast";
import { AxiosError } from "axios";
import { IErrorResponse } from "../../../interfaces";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/store";
import { setToken } from "../../../app/functions/token";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "@/i18n/hooks";
import { loginSuccess } from "@/app/functions/auth";

interface IFormInput {
  username: string;
  password: string;
}

const LoginPage = () => {
  const { t, i18n } = useTranslation("auth");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const [isLoading, setIsLoading] = useState(false);

  // ** Cookies
  const cookie = new Cookies();
  const dispatch = useAppDispatch();
  const router = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data: any) => {
    setIsLoading(true);
    try {
      const { status, data: resData } = await axiosInstance.post(
        "auth/token/",
        data
      );
      if (status === 200) {
        dispatch(setToken(resData));
        if (resData.role === "user") {
          cookie.set(
            "elNamerEmailSender",
            "$2a$08$5xDzi.dDP3yNLJ5cVKOim.J7YcmaTIhEaq.yOe9Upc5qSRGLefLxG"
          );
        } else if (resData.role === "admin") {
          cookie.set(
            "elNamerEmailSender",
            "$2a$08$reWdPwXPPmJ055PbpEZIkucsxwxC63QOAgl9kt5vL/GL7xvi4L5Gu"
          );
        }
        cookie.set("userLoggedES", resData.access, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });

        const res = {
          user: {
            username: resData.username,
            organization: resData.organization,
            email: resData.email,
            role: resData.role,
            remaining_quota: resData.remaining_quota,
          },
          access: resData.access,
          refresh: resData.refresh,
        };
        dispatch(loginSuccess(res));

        toast.success(t("login.successLogin"));
        setTimeout(() => {
          router("/dashboard");
        }, 900);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      if (errorObj.response?.status === 401) {
        toast.error(t("login.errors.invalidCredentials"), {
          duration: 4000,
        });
      }
      if (errorObj.response?.status === 419) {
        toast.error(t("login.errors.networkError"), {
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = LOGIN_FORM.map(
    ({ name, type, id, validation }, idx) => (
      <div key={idx}>
        <div className="space-y-2 pb-1">
          <label htmlFor={id} className="text-black text-xl">
            {t(`login.labels.${name}`)}
          </label>
          <Input
            id={id}
            type={type}
            placeholder={t(`login.placeholders.${name}`)}
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
      className="w-full min-h-[90vh] flex flex-row items-end justify-center gap-10 mb-5"
      dir={dir}
    >
      <Helmet>
        <title>EmailSender | {t("login.login")}</title>
      </Helmet>
      <div className="w-3/4 flex flex-col items-center justify-center space-y-8">
        <h2
          className={`text-3xl text-black font-medium text-center ${
            currentLng === "ar" ? "text-right" : "text-left"
          }`}
        >
          {t("login.welcome")}{" "}
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
            {t("login.login")}
          </Button>
          <div
            className={`flex flex-col ${
              currentLng === "ar" ? "items-end" : "items-start"
            } space-y-1`}
          >
            <Link to={"/auth/forget-password"} className="text-black">
              <span className="text-sm ml-1 text-black">
                {t("login.forgotPassword")}
              </span>
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
