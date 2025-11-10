/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../components/elements/Button";
import Modal from "../../../../components/elements/Modal";
import {
  SoSend,
  SoTrash,
  SoXmarkCircle,
  SoAddNote,
  SoMailAdd,
  SoQrCode,
} from "solom-icon";
import Cookies from "universal-cookie";
import { SetStateAction, useState } from "react";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../../config/axios.config";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addTemplateSchema } from "../../../../validation";
import { TAddTemplate } from "../../../../types";
import InputErrorMessage from "../../../../components/auth-errormsg/InputErrorMessage";
import Input from "../../../../components/elements/Input";
import { TEMPLATE_FORM } from "../../../../data";
import { Editor } from "@tinymce/tinymce-react";
import * as Yup from "yup";
import { useTranslation } from "@/i18n/hooks";
import { AxiosError } from "axios";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  refetchData: () => void;
}

const PREDEFINED_VARIABLES = [
  { label: "{{name}}", value: "{{name}}" },
  { label: "{{company}}", value: "{{company}}" },
  { label: "{{email}}", value: "{{email}}" },
  { label: "{{date}}", value: "{{date}}" },
];

const updatedAddTemplateSchema = addTemplateSchema.shape({
  content: Yup.string().required("contentRequired").min(10, "contentTooShort"),
});

const AddEmailTemplate = ({ isOpen, setIsOpen, refetchData }: IProps) => {
  const { t, i18n } = useTranslation("template");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const cookie = new Cookies();
  const token = cookie.get("userLoggedES");

  const [content, setContent] = useState<string>("");
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<string>("");
  const [isHtmlView, setIsHtmlView] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
  } = useForm<TAddTemplate>({
    resolver: yupResolver(updatedAddTemplateSchema),
    defaultValues: {
      name: "",
      content: "",
    },
  });

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
    setValue("content", newContent, { shouldValidate: true });
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setValue("content", newContent, { shouldValidate: true });
  };

  const insertVariable = () => {
    if (selectedVariable) {
      const formattedVariable = `{{${selectedVariable.trim()}}}`;
      setContent((prev) => prev + formattedVariable);
      setSelectedVariable("");
      setShowVariablesModal(false);
    } else {
      toast.error(t("selectVariableError"), {
        duration: 4000,
      });
    }
  };

  const customToolbar = `
    undo redo | bold italic underline | forecolor backcolor | 
    alignleft aligncenter alignright alignjustify | 
    bullist numlist | table | image media link | 
    customInsertVariable | placeholder
  `;

  const onSubmit = async (data: TAddTemplate) => {
    try {
      const templateData = {
        ...data,
        content,
      };
      const { status } = await axiosInstance.post(
        `/email_forms/`,
        templateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (status === 201) {
        reset();
        setContent("");
        setIsOpen(false);
        setIsHtmlView(false);
        refetchData();
        toast.success(t("successAddTemplate"));
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

  const renderTemplateForm = TEMPLATE_FORM.map(
    ({ name, placeholder, type, validation, icon: Icon }, idx) => (
      <div
        key={idx}
        className={`w-full space-y-1 ${
          currentLng === "ar" ? "text-right" : "text-left"
        }`}
      >
        {name === "content" ? null : (
          <div className="w-full">
            <div
              className={`w-full flex ${
                currentLng === "ar" ? "flex-row" : "flex-rowツ"
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
                placeholder={t(placeholder)}
                className="w-full focus:outline-none focus:border-0 focus:ring-transparent ring-transparent border-0 bg-transparent"
                style={{ textAlign: currentLng === "ar" ? "right" : "left" }}
                dir={dir}
                {...register(name, validation)}
              />
            </div>
            {errors[name] && errors[name]?.message && (
              <InputErrorMessage msg={t(errors[name].message)} />
            )}
          </div>
        )}
      </div>
    )
  );

  return (
    <>
      <Button
        className="flex items-center gap-2 mb-5"
        onClick={() => setIsOpen(true)}
      >
        <SoMailAdd className="w-5 h-5" /> {t("addNewTemplate")}
      </Button>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} fullWidth>
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
            dir={dir}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full flex flex-col items-start justify-center space-y-5">
              <div className="w-full flex flex-col items-center justify-between space-y-8">
                <div className="w-full flex flex-col items-center justify-between space-y-3">
                  <div className="w-full flex flex-col items-center gap-3">
                    {renderTemplateForm}
                    <div className="w-full">
                      {isHtmlView ? (
                        <textarea
                          value={content}
                          onChange={handleHtmlChange}
                          className="w-full h-[300px] rounded-lg bg-gray-100 p-4 font-mono text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder={t("enterHtmlCode")}
                          dir="ltr"
                        />
                      ) : (
                        <Editor
                          apiKey="7ece5d4122fvf658pdmbmstqb7lgr1pwfcn6hn5nqtzc7uuq"
                          value={content}
                          onEditorChange={handleEditorChange}
                          init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                              "placeholder",
                              "link",
                              "image",
                              "media",
                              "table",
                              "lists",
                              "advlist",
                              "textcolor",
                              "colorpicker",
                            ],
                            toolbar: customToolbar,
                            directionality: dir,
                            referrer_policy: "origin",
                            image_uploadtab: true,
                            file_picker_types: "image media",
                            file_picker_callback: (callback, _, meta) => {
                              const input = document.createElement("input");
                              input.setAttribute("type", "file");
                              input.setAttribute(
                                "accept",
                                meta.filetype === "image"
                                  ? "image/*"
                                  : "video/*"
                              );
                              input.onchange = () => {
                                const file = input.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    callback(reader.result as string, {
                                      title: file.name,
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              };
                              input.click();
                            },
                            setup: (editor) => {
                              editor.ui.registry.addButton(
                                "customInsertVariable",
                                {
                                  text: t("addVariable"),
                                  icon: "template",
                                  onAction: () => setShowVariablesModal(true),
                                }
                              );
                              editor.ui.registry.addAutocompleter("variables", {
                                trigger: "{",
                                minChars: 1,
                                columns: 1,
                                fetch: (
                                  pattern: string,
                                  maxResults: number
                                ) => {
                                  return new Promise((resolve) => {
                                    const results = PREDEFINED_VARIABLES.map(
                                      ({ value }) => ({
                                        value,
                                        text: t(
                                          `predefinedVariables.${value.replace(
                                            /{{|}}/g,
                                            ""
                                          )}`
                                        ),
                                        icon: "placeholder",
                                      })
                                    )
                                      .filter(({ value }) =>
                                        value.includes(pattern)
                                      )
                                      .slice(0, maxResults);
                                    resolve(results);
                                  });
                                },
                                onAction: (autocompleteApi, rng, value) => {
                                  editor.selection.setRng(rng);
                                  editor.insertContent(value);
                                  autocompleteApi.hide();
                                },
                              });
                            },
                          }}
                        />
                      )}
                      {errors.content && errors.content.message && (
                        <InputErrorMessage msg={t(errors.content.message)} />
                      )}
                      <Modal
                        one
                        isOpen={showVariablesModal}
                        closeModal={() => setShowVariablesModal(false)}
                      >
                        <div
                          className={`absolute top-[-20px] ${
                            currentLng === "ar" ? "left-0" : "right-0"
                          }`}
                        >
                          <div className="bg-[#E8F0F7] rounded-full p-1">
                            <SoXmarkCircle
                              className="w-6 h-6 cursor-pointer text-red-600"
                              onClick={() => setShowVariablesModal(false)}
                            />
                          </div>
                        </div>
                        <div
                          className={`w-full flex flex-col items-center justify-center space-y-5 pt-10 px-5 ${
                            currentLng === "ar" ? "text-right" : "text-left"
                          }`}
                          dir={dir}
                        >
                          <h3 className="text-xl font-bold mb-4 text-center">
                            {t("insertVariable")}
                          </h3>
                          <Input
                            type="text"
                            value={selectedVariable}
                            onChange={(e) =>
                              setSelectedVariable(e.target.value)
                            }
                            placeholder={t("enterVariableName")}
                            className="w-full rounded-lg bg-gray-100 py-3 px-6 focus:outline-none focus:ring-2 focus:ring-primary"
                            style={{
                              textAlign: currentLng === "ar" ? "right" : "left",
                            }}
                            dir={dir}
                          />
                          <div className="w-full flex justify-center gap-3">
                            <Button
                              fullWidth
                              type="button"
                              onClick={insertVariable}
                              disabled={
                                !selectedVariable ||
                                !selectedVariable.match(/^[a-zA-Z]+$/)
                              }
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              <SoAddNote className="w-5 h-5" />
                              {t("insert")}
                            </Button>
                            <Button
                              fullWidth
                              type="button"
                              onClick={() => setShowVariablesModal(false)}
                              className="flex items-center gap-2 bg-transparent border border-red-600 text-red-600 dark:text-red-600 hover:bg-red-500 hover:text-white"
                            >
                              <SoXmarkCircle className="w-5 h-5" />
                              {t("cancel")}
                            </Button>
                          </div>
                        </div>
                      </Modal>
                      <h4
                        className={`font-bold mt-5 mb-2 ${
                          currentLng === "ar" ? "text-right" : "text-left"
                        }`}
                      >
                        {t("contentPreview")}
                      </h4>
                      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                        <div
                          className={`prose max-w-none ${
                            currentLng === "ar" ? "text-right" : "text-left"
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: content.replace(
                              /(\{\{.*?\}\})/g,
                              '<span class="text-blue-600 font-mono">$1</span>'
                            ),
                          }}
                        />
                      </div>
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
                      onClick={() => setIsHtmlView(!isHtmlView)}
                      className="w-full flex items-center gap-2 bg-gray-600 hover:bg-gray-700"
                    >
                      <SoQrCode className="w-5 h-5" />
                      {isHtmlView ? t("visualEditor") : t("htmlCode")}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        reset();
                        setContent("");
                        setIsHtmlView(false);
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

export default AddEmailTemplate;
