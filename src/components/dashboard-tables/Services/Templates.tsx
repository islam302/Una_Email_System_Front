/* eslint-disable @typescript-eslint/no-explicit-any */
import "../Tables.style.css";
import { useEffect, useState } from "react";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import LoadingScreen from "../../website-loading";
import { TAddTemplate } from "../../../types";
import {
  SoEditNote,
  SoSend,
  SoTrash,
  SoXmarkCircle,
  SoAddNote,
  SoQrCode,
} from "solom-icon";
import Modal from "../../elements/Modal";
import Button from "../../elements/Button";
import { TEMPLATE_FORM } from "../../../data";
import Input from "../../elements/Input";
import InputErrorMessage from "../../auth-errormsg/InputErrorMessage";
import { tokenSelector } from "../../../app/functions/token";
import { useSelector } from "react-redux";
import { addTemplateSchema } from "../../../validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../../config/axios.config";
import { toast } from "react-fox-toast";
import { Editor } from "@tinymce/tinymce-react";
import * as Yup from "yup";
import { useTranslation } from "@/i18n/hooks";
import { AxiosError } from "axios";

interface TemplateTableProps {
  data: TAddTemplate[] | undefined;
  isLoading: boolean;
  error: any;
  refetchData: () => void;
}

interface ITemplate extends TAddTemplate {
  id: string;
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

const EmailTemplatesTable = ({
  data,
  isLoading,
  error,
  refetchData,
}: TemplateTableProps) => {
  const { t, i18n } = useTranslation("template");
  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { access } = useSelector(tokenSelector);

  const [editTemp, setEditTemp] = useState<ITemplate>({
    id: "",
    name: "",
    content: "",
  });
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [isOpen, setIsOpen] = useState(false);
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [rawContent, setRawContent] = useState<string>("");
  const [isHtmlView, setIsHtmlView] = useState(false);

  const EmailTemplatesData = data || [];

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

  useEffect(() => {
    if (isOpen && editTemp.id) {
      console.log("Raw Edit Template Content:", editTemp.content);
      const cleanedContent =
        editTemp.content?.replace(/[\u200B-\u200D\uFEFF]/g, "") || "";
      reset({ name: editTemp.name, content: cleanedContent });
      setRawContent(cleanedContent);
      setContent(cleanedContent);
      setIsHtmlView(false);
    }
  }, [isOpen, editTemp, reset]);

  const handleEditTemp = async (formData: TAddTemplate) => {
    try {
      const updatedData = {
        ...formData,
        content: rawContent, // دايماً نستخدم rawContent
      };
      console.log("Updating Template with:", updatedData);
      const { status } = await axiosInstance.patch(
        `email_forms/${editTemp?.id}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (status === 200) {
        refetchData();
        toast.success(t("successUpdateTemplate"));
        setIsOpen(false);
        setContent("");
        setRawContent("");
        setIsHtmlView(false);
        reset();
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

  const handleDeleteTemp = async (id: string) => {
    try {
      await axiosInstance.delete(`email_forms/${id}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success(t("successDeleteTemplate"));
      refetchData();
    } catch (err) {
      const error = err as AxiosError<any>;
      const data = error.response?.data as Record<string, string[]>;
      const firstErrorMessage = Object.entries(data)[0]?.[1]?.[0];
      toast.error(firstErrorMessage, {
        duration: 4000,
      });
    }
  };

  const onPageChange = (event: DataTablePageEvent) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const insertVariable = () => {
    if (selectedVariable) {
      const formattedVariable = `{{${selectedVariable.trim()}}}`;
      setRawContent((prev) => {
        const newContent = prev + formattedVariable;
        setContent(newContent);
        setValue("content", newContent, { shouldValidate: true });
        return newContent;
      });
      setSelectedVariable("");
      setShowVariablesModal(false);
    } else {
      toast.error(t("selectVariableError"), {
        duration: 4000,
      });
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    console.log("Textarea Content:", newContent);
    setRawContent(newContent);
    setContent(newContent);
    setValue("content", newContent, { shouldValidate: true });
  };

  const customToolbar = `
    undo redo | bold italic underline | forecolor backcolor | 
    alignleft aligncenter alignright alignjustify | 
    bullist numlist | table | image media link | 
    customInsertVariable | code
  `;

  const renderRecipientForm = TEMPLATE_FORM.map(
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
                currentLng === "ar" ? "flex-row" : "flex-row"
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

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <div className="w-full" dir={dir}>
      <div className="w-full flex flex-col items-start justify-center space-y-5 mb-10">
        <div id="datatable">
          <DataTable
            dataKey="id"
            value={EmailTemplatesData}
            removableSort
            tableStyle={{ minWidth: "100%", cursor: "pointer" }}
            paginator
            rows={rows}
            first={first}
            onPage={onPageChange}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rowsPerPageOptions={[10, 20, 30]}
            totalRecords={EmailTemplatesData.length}
            emptyMessage={t("noListsAvailable")}
          >
            <Column
              field="name"
              header={t("templateName")}
              style={{ width: "25%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="w-full flex">
                  {rowData?.name ? rowData?.name : "null"}
                </div>
              )}
            ></Column>
            <Column
              field="recipients"
              style={{ width: "15%", borderRadius: "0px" }}
              body={(rowData) => (
                <div className="flex items-center justify-center gap-3">
                  <div
                    className="bg-blue-200 text-blue-600 p-1 rounded-md"
                    onClick={() => {
                      setEditTemp(rowData);
                      setIsOpen(true);
                    }}
                  >
                    <SoEditNote className="w-5 h-5" />
                  </div>
                  <div
                    className="bg-red-200 text-red-600 p-1 rounded-md"
                    onClick={() => handleDeleteTemp(rowData?.id)}
                  >
                    <SoTrash className="w-5 h-5" />
                  </div>
                </div>
              )}
            ></Column>
          </DataTable>
        </div>
      </div>
      <Modal fullWidth isOpen={isOpen} closeModal={() => setIsOpen(false)}>
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
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full flex flex-col items-center justify-center space-y-5 pt-10 px-5"
        >
          <form
            className={`w-full ${
              currentLng === "ar" ? "text-right" : "text-left"
            }`}
            dir={dir}
            onSubmit={handleSubmit(handleEditTemp)}
          >
            <div className="w-full flex flex-col items-start justify-center space-y-5">
              <div className="w-full flex flex-col items-center justify-between space-y-8">
                <div className="w-full flex flex-col items-center justify-between space-y-3">
                  <div className="w-full flex flex-col items-center gap-3">
                    {renderRecipientForm}
                    <div className="w-full">
                      {isHtmlView ? (
                        <textarea
                          value={rawContent}
                          onChange={handleHtmlChange}
                          className="w-full h-[300px] rounded-lg bg-gray-100 p-4 font-mono text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder={t("enterHtmlCode")}
                          dir="ltr"
                        />
                      ) : (
                        <Editor
                          apiKey="7ece5d4122fvf658pdmbmstqb7lgr1pwfcn6hn5nqtzc7uuq"
                          value={content}
                          onEditorChange={(newContent) => {
                            console.log("TinyMCE Content:", newContent);
                            setContent(newContent);
                            // لا نحدث rawContent هنا للحفاظ على الـ HTML الكامل
                            setValue("content", newContent, {
                              shouldValidate: true,
                            });
                          }}
                          init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                              "link",
                              "image",
                              "media",
                              "table",
                              "lists",
                              "advlist",
                              "code",
                            ],
                            toolbar: customToolbar,
                            directionality: dir,
                            valid_elements: "*[*]",
                            extended_valid_elements: "*[*]",
                            protect: [
                              /<\?[\s\S]*?\?>/g,
                              /<!\[CDATA\[[\s\S]*?\]\]>/g,
                              /<!DOCTYPE[^>]+>/g,
                              /<html[\s\S]*?>[\s\S]*<\/html>/g,
                            ],
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
                              editor.ui.registry.addToggleButton(
                                "customHtmlToggle",
                                {
                                  text: t("htmlCode"),
                                  icon: "sourcecode",
                                  onAction: () => {
                                    console.log(
                                      "Switching to HTML View, Raw Content:",
                                      rawContent
                                    );
                                    setIsHtmlView((prev) => !prev);
                                  },
                                  onSetup: (buttonApi) => {
                                    buttonApi.setActive(isHtmlView);
                                    return () => {};
                                  },
                                }
                              );
                              editor.ui.registry.addButton(
                                "customInsertContent",
                                {
                                  text: t("addCustomContent"),
                                  icon: "placeholder",
                                  onAction: () => {
                                    editor.insertContent("[[CUSTOM_CONTENT]]");
                                  },
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
                        className={`font-bold mt-2 ${
                          currentLng === "ar" ? "text-right" : "text-left"
                        }`}
                      >
                        {t("contentPreview")}
                      </h4>
                      <div className="mt-2 p-4 bg-gray-100 rounded-lg">
                        <div
                          className={`prose max-w-none ${
                            currentLng === "ar" ? "text-right" : "text-left"
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: rawContent.replace(
                              /(\{\{.*?\}\})/g,
                              '<span className="text-blue-400 font-mono">$1</span>'
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
                      {t("editTemplate")}
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
                        handleDeleteTemp(editTemp.id);
                        setIsOpen(false);
                        reset();
                        setContent("");
                        setRawContent("");
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
    </div>
  );
};

export default EmailTemplatesTable;
