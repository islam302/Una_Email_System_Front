/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/elements/Button";
import Modal from "@/components/elements/Modal";
import { SoTrash, SoXmarkCircle } from "solom-icon";
import Cookies from "universal-cookie";
import { SetStateAction } from "react";
import { toast } from "react-fox-toast";
import axiosInstance from "@/config/axios.config";
import { AxiosError } from "axios";
import { useTranslation } from "@/i18n/hooks";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  refetchData: () => void;
}

const DeleteAllLogs = ({ isOpen, setIsOpen, refetchData }: IProps) => {
  const { t, i18n } = useTranslation("log");
  const currentLng = i18n.language;

  const cookie = new Cookies();
  const token = cookie.get("userLoggedES");

  const handleDeleteAllLog = async () => {
    try {
      await axiosInstance.delete(`email_track/delete-all/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refetchData();
      setIsOpen(false);
      toast.success(
        t("successDeleteAllRecords", {
          duration: 2000,
        })
      );
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
        className="flex items-center gap-2 mb-5 bg-red-400/90"
        onClick={() => setIsOpen(true)}
      >
        <SoTrash className="w-5 h-5" /> {t("deleteAllRecords")}
      </Button>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <div className="relative">
          <div
            className={`absolute top-[-10px] ${
              currentLng === "ar" ? "right-0" : "left-0"
            } px-5`}
          >
            <div className="bg-[#E8F0F7] rounded-full p-1">
              <SoXmarkCircle
                className="w-6 h-6 cursor-pointer text-red-600"
                onClick={() => setIsOpen(false)}
              />
            </div>
          </div>
          <h2
            className={`text-2xl font-semibold text-black text-center pt-8 mb-8 ${
              currentLng === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t("confirmDeleteAllRecords")}
          </h2>
          <div
            className={`w-full flex ${
              currentLng === "ar" ? "flex-row" : "flex-row-reverse"
            } items-center gap-3 pt-5`}
          >
            <Button
              fullWidth
              onClick={handleDeleteAllLog}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              {t("yes")}
            </Button>
            <Button
              fullWidth
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-400 text-gray-800 rounded-md hover:bg-gray-500 transition"
            >
              {t("no")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteAllLogs;
