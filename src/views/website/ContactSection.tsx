/* eslint-disable @typescript-eslint/no-explicit-any */
import ContactImg from "../../assets/contact-us.svg";
import ContactTitleImg from "../../assets/title_contact.svg";
import Input from "../../components/elements/Input";
import Textarea from "../../components/elements/Textarea";
import Button from "../../components/elements/Button";
import { toast } from "react-fox-toast";
import { FormEvent, useState } from "react";
import axiosInstance from "../../config/axios.config";
import { tokenSelector } from "../../app/functions/token";
import { useSelector } from "react-redux";
import { SoSend } from "solom-icon";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

const ContactSection = () => {
  const { t, i18n } = useTranslation("home");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";
  const { access } = useSelector(tokenSelector);

  const [msgData, setMsgData] = useState({
    msgName: "",
    msgEmail: "",
    msgPhone: "",
    msgCompany: "",
    msgMessage: "",
  });

  const handleSendMsg = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !msgData.msgName ||
      !msgData.msgEmail ||
      !msgData.msgPhone ||
      !msgData.msgMessage ||
      !msgData.msgCompany
    ) {
      toast.error(t("contact.errors.requiredFields"), {
        duration: 4000,
      });
      return;
    }

    const data = {
      name: msgData.msgName,
      email: msgData.msgEmail,
      number: msgData.msgPhone,
      message: msgData.msgMessage,
      company_name: msgData.msgCompany,
      status: 1,
    };

    try {
      const response = await axiosInstance.post("contacts", data, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (response.status === 200) {
        toast.success(t("contact.success.sendSuccess"));
        setMsgData({
          msgName: "",
          msgEmail: "",
          msgPhone: "",
          msgCompany: "",
          msgMessage: "",
        });
      } else {
        toast.error(t("contact.errors.sendFailure"), {
          duration: 4000,
        });
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
    <section id="contact" dir={dir}>
      <div className="h-auto pb-5">
        <div className="flex flex-col justify-between items-center gap-10 container max-sm:flex-col max-sm:space-x-0">
          <div className="flex flex-col justify-between items-center space-y-3">
            <img
              className="w-52"
              src={ContactTitleImg}
              alt={t("contact.titleImageAlt")}
              loading="lazy"
            />
            <p className="text-[#525252] text-center text-base font-medium max-sm:text-sm">
              {t("contact.description")}
            </p>
          </div>
          <div
            className={`w-full flex ${
              currentLng === "ar" ? "flex-row-reverse" : "flex-row"
            } items-center justify-between max-sm:flex-col-reverse`}
          >
            <form
              className="flex flex-col items-start justify-between space-y-2"
              onSubmit={handleSendMsg}
            >
              <div
                className={`flex ${
                  currentLng === "ar" ? "flex-row-reverse" : "flex-row"
                } items-center gap-2`}
              >
                <div className="w-full flex flex-col gap-1">
                  <label
                    className="text-sm text-primary font-medium"
                    htmlFor="fullname"
                  >
                    {t("contact.labels.fullname")}
                  </label>
                  <Input
                    id="fullname"
                    type="name"
                    aria-describedby="username-help"
                    placeholder={t("contact.placeholders.fullname")}
                    value={msgData.msgName}
                    onChange={(e) =>
                      setMsgData({ ...msgData, msgName: e.target.value })
                    }
                  />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label
                    className="text-sm text-primary font-medium"
                    htmlFor="phone"
                  >
                    {t("contact.labels.phone")}
                  </label>
                  <Input
                    id="phone"
                    type="number"
                    aria-describedby="phone-help"
                    placeholder={t("contact.placeholders.phone")}
                    value={msgData.msgPhone}
                    onChange={(e) =>
                      setMsgData({ ...msgData, msgPhone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div
                className={`flex ${
                  currentLng === "ar" ? "flex-row-reverse" : "flex-row"
                } items-center gap-2`}
              >
                <div className="w-full flex flex-col gap-1">
                  <label
                    className="text-sm text-primary font-medium"
                    htmlFor="email"
                  >
                    {t("contact.labels.email")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    aria-describedby="email-help"
                    placeholder={t("contact.placeholders.email")}
                    value={msgData.msgEmail}
                    onChange={(e) =>
                      setMsgData({ ...msgData, msgEmail: e.target.value })
                    }
                  />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label
                    className="text-sm text-primary font-medium"
                    htmlFor="company"
                  >
                    {t("contact.labels.company")}
                  </label>
                  <Input
                    id="company"
                    type="name"
                    aria-describedby="companyname-help"
                    placeholder={t("contact.placeholders.company")}
                    value={msgData.msgCompany}
                    onChange={(e) =>
                      setMsgData({ ...msgData, msgCompany: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label
                  className="text-sm text-primary font-medium"
                  htmlFor="msg"
                >
                  {t("contact.labels.message")}
                </label>
                <Textarea
                  id="msg"
                  aria-describedby="message-help"
                  placeholder={t("contact.placeholders.message")}
                  value={msgData.msgMessage}
                  onChange={(e) =>
                    setMsgData({ ...msgData, msgMessage: e.target.value })
                  }
                />
              </div>
              <Button
                fullWidth
                type="submit"
                className="w-full flex items-center gap-2"
              >
                <SoSend className="h-5 w-5" />
                {t("contact.button")}
              </Button>
            </form>
            <div className="flex-shrink-0 w-1/2 max-sm:mt-10 max-sm:w-10/12">
              <img
                className="image-float duration-300"
                src={ContactImg}
                alt={t("contact.imageAlt")}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
