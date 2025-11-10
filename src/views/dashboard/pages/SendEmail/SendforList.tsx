/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../components/elements/Button";
import {
  SoAirplane,
  SoArrowDown,
  SoBill,
  SoCalendar2,
  SoClock2,
  SoFileUpload,
  SoInbox,
  SoMailReceive,
  SoSend,
  SoStickyNote,
  SoStickyNote2,
  SoTrailing,
  SoTrash,
  SoUser,
  SoUserGroup2,
  SoUserList,
  SoXmarkCircle,
} from "solom-icon";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputErrorMessage from "../../../../components/auth-errormsg/InputErrorMessage";
import axiosInstance from "../../../../config/axios.config";
import { toast } from "react-fox-toast";
import Cookies from "universal-cookie";
import { sendEmailListSchema } from "../../../../validation";
import { TSendList } from "../../../../types";
import { useGetEmailTemplateQuery } from "../../../../app/functions/api/emailTemplatesApi";
import { Dropdown } from "primereact/dropdown";
import { useRef, useState } from "react";
import Select from "react-select";
import Modal from "../../../../components/elements/Modal";
import Input from "../../../../components/elements/Input";
import { useGetRecipientListsQuery } from "../../../../app/functions/api/recipientListsApi";
import LoadingScreen from "../../../../components/website-loading";
import { typeListAR, typeListEN } from "../../../../i18n/utils";
import { AxiosError } from "axios";
import { useTranslation } from "@/i18n/hooks";
import { cn } from "@/lib/utils";
import { useGetSenderFromQuery } from "@/app/functions/api/recipientListsApi";

interface Recipient {
  id: string;
  name: string;
  email: string;
}

interface RecipientList {
  id: string;
  name: string;
  recipients: Recipient[];
}

const SendListPage = () => {
  const { t, i18n } = useTranslation("send");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const cookie = new Cookies();
  const token = cookie.get("userLoggedES");

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const [showVariableInput, setShowVariableInput] = useState(false);
  const [variableName, setVariableName] = useState("");
  const [temp, setTemp] = useState("");
  const [activeTab, setActiveTab] = useState<"survey" | "custom" | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [generalAttachmentFiles, setGeneralAttachmentFiles] = useState<File[]>(
    []
  );
  const [surveyOptions, setSurveyOptions] = useState<string[]>([""]);
  const [uploadType, setUploadType] = useState<"list" | "excel">("list");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [embeddedImage, setEmbeddedImage] = useState<File | null>(null);
  const [timer, setTimer] = useState(false);

  const { data: List, isLoading } = useGetRecipientListsQuery();
  const { data: EmailTemplate, isLoading: LoadingEmail } =
    useGetEmailTemplateQuery();
  const { data } = useGetSenderFromQuery();

  const senderEmails = (data?.sender_emails || []).map((email: string) => ({
    label: email,
    value: email,
  }));

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TSendList>({
    resolver: yupResolver(sendEmailListSchema),
    defaultValues: {
      subject: "",
      message_body: "",
      recipient_list_id: [],
      email_template_id: "",
      schedule: null,
      survey_question: "",
      custom_question: "",
      custom_question_type: "email",
      from_email: "",
    },
  });

  const addSurveyOption = () => {
    setSurveyOptions([...surveyOptions, ""]);
  };

  const removeSurveyOption = (index: number) => {
    if (surveyOptions.length > 1) {
      const newOptions = surveyOptions.filter((_, i) => i !== index);
      setSurveyOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...surveyOptions];
    newOptions[index] = value;
    setSurveyOptions(newOptions);
  };

  const onSubmit = async (data: TSendList) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.message_body, "text/html");
      const walker = document.createTreeWalker(
        doc.body,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
      );
      let result = "";
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as HTMLElement).classList.contains("variable")
        ) {
          result += `{{${(node as HTMLElement).dataset.variable}}}`;
        } else if (node.nodeType === Node.TEXT_NODE) {
          result += node.textContent;
        }
      }

      let delaySeconds: number | undefined;

      if (uploadType === "list" && data.schedule) {
        const selectedDate = new Date(data.schedule);
        const now = new Date();
        const difference = selectedDate.getTime() - now.getTime();

        if (difference <= 0) {
          toast.error(t("futureTimeError"), {
            duration: 4000,
          });
          return;
        }

        delaySeconds = Math.floor(difference / 1000);
      }

      const formData = new FormData();
      formData.append("subject", data.subject);
      formData.append("message_body", result);
      formData.append("email_template_id", temp);
      formData.append("from_email", data.from_email || "");

      if (uploadType === "list") {
        if (data?.recipient_list_id) {
          data?.recipient_list_id.forEach((id) => {
            if (typeof id === "string") {
              formData.append("recipient_list_ids", id);
            }
          });
        }
        if (delaySeconds) {
          formData.append("delay", `${delaySeconds}`);
        }
        if (data.survey_question) {
          const surveyData = {
            text: data.survey_question,
            options: surveyOptions.filter((option) => option.trim() !== ""),
          };
          formData.append("survey_question", JSON.stringify(surveyData));
        }
        if (data.custom_question) {
          formData.append("custom_question", data.custom_question);
        }
        if (data.custom_question_type) {
          formData.append("custom_question_type", data.custom_question_type);
        }
      } else if (uploadType === "excel" && excelFile) {
        formData.append("excel_recipients_file", excelFile);
      }

      if (attachmentFile) {
        formData.append("attachment_folder", attachmentFile);
      }

      if (generalAttachmentFiles.length > 0) {
        generalAttachmentFiles.forEach((file) => {
          formData.append("general_attachment", file);
        });
      }

      if (embeddedImage) formData.append("embedded_image", embeddedImage);

      const { status } = await axiosInstance.post(
        "/send/send-emails/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (status === 200 || status === 202) {
        toast.success(t("successMessage"));
        setTemp("");
        setAttachmentFile(null);
        setGeneralAttachmentFiles([]);
        setSurveyOptions([""]);
        setExcelFile(null);
        setEmbeddedImage(null);
        setUploadType("list");
        reset();
      }
    } catch (err) {
      const error = err as AxiosError<any>;
      const data = Array.isArray(error.response?.data?.مستلمين_بمعلومات_ناقصة)
        ? error.response.data.مستلمين_بمعلومات_ناقصة
        : [];
      const errorMessages = data.map((item: any) => {
        const listName = item.القائمة || t("unknownLabel");
        const missingFiles = Array.isArray(item["البيانات الناقصة"])
          ? item["البيانات الناقصة"].join(", ")
          : t("unspecifiedLabel");
        return `${t("listLabel")}: ${listName}, ${t(
          "missingFilesLabel"
        )}: ${missingFiles}`;
      });
      const errorText =
        errorMessages.length > 0
          ? errorMessages.join("؛ ")
          : t("missingDataError");
      if (errorText) {
        setAttachmentFile(null);
        setGeneralAttachmentFiles([]);
        setExcelFile(null);
        setEmbeddedImage(null);
      }
      toast.error(errorText, {
        duration: 4000,
      });
    }
  };

  const handleDelete = () => {
    reset();
    setTemp("");
    setAttachmentFile(null);
    setGeneralAttachmentFiles([]);
    setSurveyOptions([""]);
    setExcelFile(null);
    setEmbeddedImage(null);
    setUploadType("list");
    toast.success(t("deleteSuccess"));
  };

  const handleTabToggle = (tab: "survey" | "custom") => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  if (isLoading || LoadingEmail) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  const currentRecipientListValue = watch("recipient_list_id");

  return (
    <div className="w-full mt-4" dir={dir}>
      <Helmet>
        <title>{t("pageTitle")}</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-start justify-center space-y-5 mb-10">
          <div className="w-full flex justify-between items-center gap-3">
            <Button
              type="button"
              onClick={() => setTimer(true)}
              disabled={isSubmitting}
              className={cn(
                "w-full flex items-center justify-center gap-2 transition-all",
                timer
                  ? "bg-green-600 text-white hover:bg-green-500/90"
                  : "border border-primary text-primary hover:bg-primary/10"
              )}
            >
              <SoClock2 className="h-5 w-5" />
              {t("scheduledButton")}
            </Button>

            <Button
              type="button"
              onClick={() => setTimer(false)}
              disabled={isSubmitting}
              className={cn(
                "w-full flex items-center justify-center gap-2 transition-all",
                !timer
                  ? "bg-green-600 text-white hover:bg-green-500/90"
                  : "border border-primary text-primary hover:bg-primary/10"
              )}
            >
              <SoAirplane className="h-5 w-5" />
              {t("notScheduledButton")}
            </Button>
          </div>
          <div className="w-full flex flex-col items-center justify-between space-y-8">
            <div className="w-full flex flex-col items-center justify-between">
              <div className="w-full flex flex-col items-center gap-3">
                <div className="w-full flex items-center gap-2 border border-accent rounded-lg">
                  <div
                    className={`bg-accent p-2 ${
                      currentLng === "ar" ? "rounded-l-md" : "rounded-r-md"
                    }`}
                  >
                    <SoStickyNote2 className="h-6 w-6 text-primary" />
                  </div>
                  <input
                    className="w-full text-gray-400 focus:outline-none outline-none px-3 py-2 text-md bg-transparent duration-200"
                    style={{
                      textAlign: currentLng === "ar" ? "right" : "left",
                    }}
                    placeholder={t("subjectPlaceholder")}
                    {...register("subject")}
                    dir={dir}
                  />
                </div>
                <div className="w-full flex items-end">
                  <InputErrorMessage msg={errors.subject?.message} />
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-3">
                <div className="w-full flex items-start gap-2 border border-accent rounded-lg">
                  <div
                    className={`bg-accent p-2 ${
                      currentLng === "ar" ? "rounded-l-md" : "rounded-r-md"
                    } rounded-b-none`}
                  >
                    <SoStickyNote className="h-6 w-6 text-primary" />
                  </div>
                  <div className="relative w-full">
                    <Controller
                      name="message_body"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          ref={editorRef}
                          value={field.value || ""}
                          onChange={(e) => {
                            const text = e.target.value;
                            field.onChange(text);
                            setValue("message_body", text);
                          }}
                          className="w-full min-h-[120px] py-2 px-3 rounded-lg focus:outline-none border-none text-gray-800 text-md bg-transparent duration-200"
                          style={{
                            textAlign: currentLng === "ar" ? "right" : "left",
                          }}
                          placeholder={t("messagePlaceholder")}
                          dir={dir}
                        />
                      )}
                    />
                    <button
                      title={t("addVariableButton")}
                      type="button"
                      className={`flex items-center gap-2 absolute top-2 ${
                        currentLng === "ar" ? "left-2" : "right-2"
                      } bg-primary text-white p-2 rounded-md`}
                      onClick={() => {
                        setShowVariableInput(true);
                        if (editorRef.current) editorRef.current.focus();
                      }}
                    >
                      <SoBill className="w-5 h-5" /> {t("addVariableButton")}
                    </button>
                  </div>
                </div>
                <div className="w-full flex items-end">
                  <InputErrorMessage msg={errors.message_body?.message} />
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-3 pb-2">
                <div
                  className={`w-full flex items-center gap-2 border border-accent rounded-lg`}
                >
                  <div
                    className={`bg-accent p-2 ${
                      currentLng === "ar" ? "rounded-l-md" : "rounded-r-md"
                    }`}
                  >
                    <SoFileUpload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="relative w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) setEmbeddedImage(e.target.files[0]);
                      }}
                      id="embeddedImageInput"
                      className="hidden"
                    />
                    <label
                      htmlFor="embeddedImageInput"
                      className="w-full p-2 cursor-pointer"
                      style={{
                        textAlign: currentLng === "ar" ? "right" : "left",
                      }}
                    >
                      {t("embeddedImageLabel", {
                        defaultValue: "Upload Embedded Image",
                      })}
                    </label>
                    {embeddedImage && (
                      <div className="flex items-center gap-2">
                        <span className={`text-gray-600`}>
                          {embeddedImage.name}
                        </span>
                        <SoXmarkCircle
                          className="w-5 h-5 cursor-pointer text-red-600"
                          onClick={() => setEmbeddedImage(null)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-3">
                <div className="w-full flex items-center gap-2 border border-accent rounded-lg">
                  <div
                    className={`bg-accent p-2 ${
                      currentLng === "ar" ? "rounded-l-md" : "rounded-r-md"
                    }`}
                  >
                    <SoUserList className="h-6 w-6 text-primary" />
                  </div>
                  <Controller
                    name="recipient_list_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={List as RecipientList[]}
                        getOptionValue={(option: RecipientList) => option.id}
                        getOptionLabel={(option: RecipientList) => option.name}
                        value={
                          (List as RecipientList[])?.filter((user) =>
                            field.value?.includes(user.id)
                          ) || []
                        }
                        onChange={(selected) =>
                          field.onChange(
                            selected?.map(
                              (option: RecipientList) => option.id
                            ) || []
                          )
                        }
                        isDisabled={uploadType === "excel"}
                        components={{
                          Option: ({
                            data,
                            innerProps,
                            isSelected,
                            isFocused,
                          }) => (
                            <div
                              {...innerProps}
                              className={`w-full flex justify-between items-center px-3 py-2 cursor-pointer ${
                                isSelected
                                  ? "bg-primary text-white"
                                  : isFocused
                                  ? "bg-gray-100"
                                  : "bg-white"
                              } ${uploadType === "excel" ? "opacity-50" : ""}`}
                            >
                              <span>{(data as RecipientList).name}</span>
                              <div className="flex items-center gap-1">
                                <SoUserGroup2 className="h-5 w-5 text-primary" />
                                <span className="block font-medium">
                                  ({(data as RecipientList).recipients.length})
                                </span>
                              </div>
                            </div>
                          ),
                        }}
                        className="w-full react-select-container"
                        classNamePrefix="react-select"
                        placeholder={t("recipientsListPlaceholder")}
                        noOptionsMessage={() => t("noOptionsMessage")}
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: "none",
                            boxShadow: "none",
                            "&:hover": { border: "none" },
                            textAlign: currentLng === "ar" ? "right" : "left",
                            opacity: uploadType === "excel" ? 0.5 : 1,
                          }),
                          menu: (base) => ({
                            ...base,
                            textAlign: currentLng === "ar" ? "right" : "left",
                          }),
                        }}
                      />
                    )}
                  />
                </div>
                <div className="w-full flex items-end">
                  <InputErrorMessage msg={errors.recipient_list_id?.message} />
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-3">
                <div className="w-full flex items-center gap-2 border border-accent rounded-lg">
                  <div
                    className={`bg-accent p-2 ${
                      currentLng === "ar" ? "rounded-l-md" : "rounded-r-md"
                    }`}
                  >
                    <SoFileUpload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="relative w-full">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => {
                        if (e.target.files) {
                          setExcelFile(e.target.files[0]);
                          setUploadType("excel");
                          setValue("recipient_list_id", []);
                        }
                      }}
                      id="excelInput"
                      className="hidden"
                      disabled={
                        !!currentRecipientListValue &&
                        currentRecipientListValue.length > 0
                      }
                    />
                    <label
                      htmlFor="excelInput"
                      className={`w-full p-2 cursor-pointer disabled:cursor-not-allowed ${
                        uploadType === "list"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      style={{
                        textAlign: currentLng === "ar" ? "right" : "left",
                      }}
                    >
                      {t("excelUploadLabel")}
                    </label>
                    {excelFile && (
                      <span
                        className={`absolute top-0 ${
                          currentLng === "ar" ? "left-2" : "right-2"
                        } text-gray-600`}
                      >
                        {excelFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-3 pt-3">
                <div className="w-full flex items-center gap-2 border border-accent rounded-lg">
                  <div
                    className={`bg-accent p-2 ${
                      currentLng === "ar" ? "rounded-l-md" : "rounded-r-md"
                    }`}
                  >
                    <SoMailReceive className="h-6 w-6 text-primary" />
                  </div>
                  <Dropdown
                    {...register("email_template_id")}
                    value={temp}
                    onChange={(e) => setTemp(e.value)}
                    options={EmailTemplate}
                    optionLabel="name"
                    optionValue="id"
                    placeholder={t("templatePlaceholder")}
                    className="p-2 w-full"
                    style={{
                      textAlign: currentLng === "ar" ? "right" : "left",
                    }}
                    dir={dir}
                  />
                </div>
                <div className="w-full flex items-end">
                  <InputErrorMessage msg={errors.email_template_id?.message} />
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-3">
                <div className="w-full flex items-center gap-2 border border-accent rounded-lg">
                  <div
                    className={`bg-accent p-2 ${
                      currentLng === "ar" ? "rounded-l-md" : "rounded-r-md"
                    }`}
                  >
                    <SoUser className="h-6 w-6 text-primary" />
                  </div>
                  <Controller
                    name="from_email"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={senderEmails}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        value={senderEmails.find(
                          (option: { value: string | undefined }) =>
                            option.value === field.value
                        )}
                        onChange={(selected) =>
                          field.onChange(selected?.value || "")
                        }
                        className="w-full react-select-container"
                        classNamePrefix="react-select"
                        placeholder={t("fromEmailPlaceholder")}
                        noOptionsMessage={() => t("noOptionsMessage")}
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
                    )}
                  />
                </div>
                <div className="w-full flex items-end">
                  <InputErrorMessage msg={errors.from_email?.message} />
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-3 mb-2">
                <div className="w-full flex items-center gap-2 border border-accent rounded-lg">
                  <div
                    className={`bg-accent p-2 ${
                      currentLng === "ar" ? "rounded-l-md" : "rounded-r-md"
                    }`}
                  >
                    <SoFileUpload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="w-full flex flex-col items-center gap-3">
                    <div className="w-full flex items-center gap-2 rounded-lg">
                      <div className="relative w-full">
                        <input
                          type="file"
                          accept=".zip"
                          onChange={(e) => {
                            if (e.target.files)
                              setAttachmentFile(e.target.files[0]);
                          }}
                          id="attachmentInput"
                          className="hidden"
                        />
                        <label
                          htmlFor="attachmentInput"
                          className="w-full p-2 cursor-pointer"
                          style={{
                            textAlign: currentLng === "ar" ? "right" : "left",
                          }}
                        >
                          {t("attachmentLabel")}
                        </label>
                        {attachmentFile && (
                          <span
                            className={`absolute top-0 ${
                              currentLng === "ar" ? "left-2" : "right-2"
                            } text-gray-600`}
                          >
                            {attachmentFile.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-3 mb-2">
                <div className="w-full flex items-center gap-2 border border-accent rounded-lg">
                  <div
                    className={`bg-accent p-2 ${
                      currentLng === "ar" ? "rounded-l-md" : "rounded-r-md"
                    }`}
                  >
                    <SoFileUpload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="w-full flex flex-col items-center gap-3">
                    <div className="w-full flex items-center gap-2 rounded-lg">
                      <div className="relative w-full">
                        <input
                          type="file"
                          multiple
                          onChange={(e) => {
                            if (e.target.files) {
                              setGeneralAttachmentFiles(
                                Array.from(e.target.files)
                              );
                            }
                          }}
                          id="generalAttachmentInput"
                          className="hidden"
                        />
                        <label
                          htmlFor="generalAttachmentInput"
                          className="w-full p-2 cursor-pointer"
                          style={{
                            textAlign: currentLng === "ar" ? "right" : "left",
                          }}
                        >
                          {t("generalAttachmentLabel")}
                        </label>
                        {generalAttachmentFiles.length > 0 && (
                          <span
                            className={`absolute top-0 ${
                              currentLng === "ar" ? "left-2" : "right-2"
                            } text-gray-600`}
                          >
                            {generalAttachmentFiles
                              .map((file) => file.name)
                              .join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {timer && (
                <label className="w-full flex flex-col items-center gap-3">
                  <div
                    className={`w-full flex items-center gap-2 border border-accent rounded-lg ${
                      uploadType === "excel" ? "opacity-50" : ""
                    }`}
                  >
                    <div
                      className={`bg-accent p-2 ${
                        currentLng === "ar" ? "rounded-l-md" : "rounded-r-md"
                      }`}
                    >
                      <SoCalendar2 className="h-6 w-6 text-primary" />
                    </div>
                    <input
                      type="datetime-local"
                      {...register("schedule")}
                      className={`w-full p-[7px] bg-transparent outline-none ${
                        uploadType === "excel" ? "cursor-not-allowed" : ""
                      }`}
                      style={{
                        textAlign: currentLng === "ar" ? "right" : "left",
                      }}
                      dir={dir}
                      disabled={uploadType === "excel"}
                    />
                  </div>
                  <InputErrorMessage msg={errors.schedule?.message} />
                </label>
              )}

              <div className="w-full flex flex-col items-center gap-3 mt-2">
                <div className="w-full">
                  <button
                    type="button"
                    onClick={() => handleTabToggle("survey")}
                    className={cn(
                      "flex w-full justify-between gap-12 border-b border-[#D5D5D5] bg-transparent text-sm font-medium p-3 pb-4 focus:outline-none focus-visible:ring focus-visible:ring-primary",
                      activeTab === "survey" && uploadType !== "excel"
                        ? "text-primary"
                        : "text-[#212121]",
                      uploadType === "excel"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    )}
                    disabled={uploadType === "excel"}
                  >
                    <span className="text-base font-medium max-sm:text-base duration-150">
                      {t("yesNoSurvey")}
                    </span>
                    <SoArrowDown
                      className={`w-5 h-5 transform transition-transform ${
                        activeTab === "survey" && uploadType !== "excel"
                          ? "rotate-180"
                          : ""
                      } text-primary`}
                    />
                  </button>
                  {activeTab === "survey" && uploadType !== "excel" && (
                    <div className="flex flex-col gap-3 mt-3">
                      <div className="w-full flex flex-col items-center gap-3">
                        <div className="w-full flex items-center gap-2 border border-accent rounded-lg">
                          <div
                            className={`bg-accent p-2 ${
                              currentLng === "ar"
                                ? "rounded-l-md"
                                : "rounded-r-md"
                            }`}
                          >
                            <SoInbox className="h-6 w-6 text-primary" />
                          </div>
                          <input
                            className="w-full text-gray-400 focus:outline-none outline-none px-3 py-2 text-md bg-transparent duration-200"
                            style={{
                              textAlign: currentLng === "ar" ? "right" : "left",
                            }}
                            placeholder={t("yesNoQuestionPlaceholder")}
                            {...register("survey_question")}
                            dir={dir}
                          />
                        </div>
                        <div className="w-full flex items-end">
                          <InputErrorMessage
                            msg={errors.survey_question?.message}
                          />
                        </div>
                      </div>
                      {surveyOptions.map((option, index) => (
                        <div
                          key={`survey-option-${index}`}
                          className="w-full flex items-center gap-2 border border-accent rounded-lg"
                        >
                          <div className="flex items-center">
                            <div
                              className={`bg-accent p-2 ${
                                currentLng === "ar"
                                  ? "rounded-l-md"
                                  : "rounded-r-md"
                              }`}
                            >
                              <SoInbox className="h-6 w-6 text-primary" />
                            </div>
                            {surveyOptions.length > 1 && (
                              <div
                                className="p-2 cursor-pointer"
                                onClick={() => removeSurveyOption(index)}
                              >
                                <SoTrash className="h-5 w-5 text-red-600" />
                              </div>
                            )}
                          </div>
                          <Input
                            type="text"
                            className="w-full focus:outline-none border-none bg-transparent"
                            style={{
                              textAlign: currentLng === "ar" ? "right" : "left",
                            }}
                            placeholder={t("surveyOptionPlaceholder", {
                              number: index + 1,
                            })}
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            dir={dir}
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addSurveyOption}
                        className="mt-2 bg-primary hover:bg-accent text-white"
                      >
                        {t("addSurveyOption")}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <button
                    type="button"
                    onClick={() => handleTabToggle("custom")}
                    className={cn(
                      "flex w-full justify-between gap-12 border-b border-[#D5D5D5] bg-transparent text-sm font-medium p-3 pb-4 focus:outline-none focus-visible:ring focus-visible:ring-primary",
                      activeTab === "custom" && uploadType !== "excel"
                        ? "text-primary"
                        : "text-[#212121]",
                      uploadType === "excel"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    )}
                    disabled={uploadType === "excel"}
                  >
                    <span className="text-base font-medium max-sm:text-base duration-150">
                      {t("customSurvey")}
                    </span>
                    <SoArrowDown
                      className={`w-5 h-5 transform transition-transform ${
                        activeTab === "custom" && uploadType !== "excel"
                          ? "rotate-180"
                          : ""
                      } text-primary`}
                    />
                  </button>
                  {activeTab === "custom" && uploadType !== "excel" && (
                    <div className="flex flex-col gap-1 mt-3">
                      <div className="w-full flex flex-col items-center gap-3">
                        <div className="w-full flex items-center gap-2 border border-accent rounded-lg">
                          <div
                            className={`bg-accent p-2 ${
                              currentLng === "ar"
                                ? "rounded-l-md"
                                : "rounded-r-md"
                            }`}
                          >
                            <SoInbox className="h-6 w-6 text-primary" />
                          </div>
                          <input
                            className="w-full text-gray-400 focus:outline-none outline-none px-3 py-2 text-md bg-transparent duration-200"
                            style={{
                              textAlign: currentLng === "ar" ? "right" : "left",
                            }}
                            placeholder={t("customQuestionPlaceholder")}
                            {...register("custom_question")}
                            dir={dir}
                          />
                        </div>
                        <div className="w-full flex items-end">
                          <InputErrorMessage
                            msg={errors.custom_question?.message}
                          />
                        </div>
                      </div>
                      <div className="w-full flex flex-col items-center gap-3">
                        <div className="w-full flex items-center gap-2 border border-accent rounded-lg">
                          <div
                            className={`bg-accent p-2 ${
                              currentLng === "ar"
                                ? "rounded-l-md"
                                : "rounded-r-md"
                            }`}
                          >
                            <SoTrailing className="h-6 w-6 text-primary" />
                          </div>
                          <Controller
                            name="custom_question_type"
                            control={control}
                            render={({ field }) => (
                              <Dropdown
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                options={
                                  currentLng === "ar" ? typeListAR : typeListEN
                                }
                                optionLabel={currentLng === "ar" ? "ar" : "en"}
                                optionValue="en"
                                placeholder={t("questionTypePlaceholder")}
                                className="p-2 w-full"
                                style={{
                                  textAlign:
                                    currentLng === "ar" ? "right" : "left",
                                }}
                                dir={dir}
                              />
                            )}
                          />
                        </div>
                        <div className="w-full flex items-end">
                          <InputErrorMessage
                            msg={errors.custom_question_type?.message}
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
                  {t("sendButton")}
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 bg-[#D20202] hover:bg-red-500"
                >
                  <SoTrash className="h-5 w-5" />
                  {t("deleteButton")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <Modal
        isOpen={showVariableInput}
        closeModal={() => setShowVariableInput(false)}
      >
        <div
          className={cn(
            "absolute top-[-20px]",
            currentLng === "ar" ? "left-0" : "right-0"
          )}
        >
          <div className="bg-[#E8F0F7] rounded-full p-1">
            <SoXmarkCircle
              className="w-6 h-6 cursor-pointer text-red-600"
              onClick={() => setShowVariableInput(false)}
            />
          </div>
        </div>
        <div
          className="w-full flex flex-col items-center justify-center space-y-5 pt-6 px-5"
          dir={dir}
        >
          <div className="w-full flex flex-col items-center gap-3 pb-2">
            <div className="w-full flex items-center gap-2 border border-accent rounded-lg">
              <div
                className={`bg-accent p-3 ${
                  currentLng === "ar" ? "rounded-l-md" : "rounded-r-md"
                } rounded-b-none`}
              >
                <SoStickyNote className="h-6 w-6 text-primary" />
              </div>
              <Input
                type="text"
                className="border-none focus:ring-0"
                style={{ textAlign: currentLng === "ar" ? "right" : "left" }}
                value={variableName}
                onChange={(e) => setVariableName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const editor = editorRef.current;
                    if (editor && variableName.match(/^[a-zA-Z_]+$/)) {
                      editor.focus();
                      const currentValue = getValues("message_body") || "";
                      const cursorPosition =
                        editor.selectionStart || currentValue.length;
                      const newValue =
                        currentValue.slice(0, cursorPosition) +
                        `{{${variableName}}}` +
                        currentValue.slice(cursorPosition);
                      setValue("message_body", newValue);
                      setVariableName("");
                      setShowVariableInput(false);
                      setTimeout(() => {
                        if (editor)
                          editor.selectionStart = editor.selectionEnd =
                            cursorPosition + variableName.length + 4;
                      }, 0);
                    } else if (!variableName.match(/^[a-zA-Z]+$/)) {
                      toast.error(t("englishOnlyError"), { duration: 4000 });
                    }
                  }
                }}
                placeholder={t("variableInputPlaceholder")}
                dir={dir}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SendListPage;
