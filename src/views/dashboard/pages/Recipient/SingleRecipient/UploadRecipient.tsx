/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../../components/elements/Button";
import Modal from "../../../../../components/elements/Modal";
import { SoFileUpload, SoSend, SoTrash, SoXmarkCircle } from "solom-icon";
import Cookies from "universal-cookie";
import { SetStateAction, useState } from "react";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../../../config/axios.config";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recipientFileSchema } from "../../../../../validation";
import InputErrorMessage from "../../../../../components/auth-errormsg/InputErrorMessage";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { useTranslation } from "@/i18n/hooks";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
}

interface FormData {
  file: FileList;
}

const UploadRecipientList = ({ isOpen, setIsOpen }: IProps) => {
  const { t, i18n } = useTranslation("recipient");

  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { id } = useParams();

  const cookie = new Cookies();
  const token = cookie.get("userLoggedES");
  const [fileName, setFileName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(recipientFileSchema),
  });

  const fileInput = watch("file");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFileName(files[0].name);
    } else {
      setFileName("");
    }
  };

  const onSubmit = async (data: FormData) => {
    const file = data.file[0];

    if (!file) {
      toast.error(t("errorSelectFile"), {
        duration: 4000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { status } = await axiosInstance.post(
        `recipients/list/${id}/upload/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (status === 207) {
        toast.success(t("successUploadFile"));
        reset();
        setFileName("");
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
        className="flex items-center gap-2 mb-5 bg-green-400/90"
        onClick={() => setIsOpen(true)}
      >
        <SoFileUpload className="w-5 h-5" /> {t("uploadFileForNewRecipient")}
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
              onClick={() => {
                setIsOpen(false);
                setFileName("");
                reset();
              }}
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
                    <div className="w-full">
                      <div
                        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-accent rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() =>
                          document.getElementById("fileInput")?.click()
                        }
                      >
                        <SoFileUpload className="w-10 h-10 text-accent mb-2" />
                        <p className="text-center text-gray-600">
                          {fileName || t("uploadExcelFilePrompt")}
                        </p>
                        <input
                          id="fileInput"
                          type="file"
                          {...register("file", {
                            onChange: handleFileChange,
                          })}
                          accept=".xlsx,.xls"
                          className="hidden"
                        />
                      </div>
                      {errors.file?.message && (
                        <InputErrorMessage msg={errors.file?.message} />
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
                      disabled={!fileInput || fileInput.length === 0}
                    >
                      <SoSend className="h-5 w-5" />
                      {t("upload")}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        reset();
                        setFileName("");
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

export default UploadRecipientList;
