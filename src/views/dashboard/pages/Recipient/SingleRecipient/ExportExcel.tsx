/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../../components/elements/Button";
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../../config/axios.config";
import { toast } from "react-fox-toast";
import { useTranslation } from "@/i18n/hooks";
import { useState } from "react";
import { SoWebValidation } from "solom-icon";

const ExportExcel = () => {
  const { t } = useTranslation("recipient");
  const { id: listId } = useParams<{ id: string }>();
  const cookie = new Cookies();
  const token = cookie.get("userLoggedES");
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    if (!listId) {
      toast.error(t("errorNoListId"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.get(
        `recipients/list/${listId}/export-excel/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { download_url } = response.data;

      if (!download_url) {
        throw new Error("No download URL returned");
      }

      const link = document.createElement("a");
      link.href = download_url;
      link.download = `recipients_list_${listId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(t("successExport"));
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || err.message || t("errorExportFailed");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      isLoading={isLoading}
      disabled={isLoading}
      className="flex items-center gap-2 mb-5 bg-amber-600/90 hover:bg-amber-700"
    >
      <SoWebValidation className="w-5 h-5" />
      {t("exportExcel")}
    </Button>
  );
};

export default ExportExcel;
