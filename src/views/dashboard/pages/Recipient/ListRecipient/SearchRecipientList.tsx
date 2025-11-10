/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "../../../../../components/elements/Modal";
import { SoXmarkCircle, SoSearch } from "solom-icon";
import { SetStateAction, useState, KeyboardEvent } from "react";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../../../config/axios.config";
import { TRecipientList } from "../../../../../types";
import { tokenSelector } from "../../../../../app/functions/token";
import { useSelector } from "react-redux";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import Button from "@/components/elements/Button";
import Input from "@/components/elements/Input";
import { useTranslation } from "@/i18n/hooks";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
}

const SearchRecipientList = ({ isOpen, setIsOpen }: IProps) => {
  const { t, i18n } = useTranslation("recipient");

  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { access } = useSelector(tokenSelector);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TRecipientList[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const { data } = await axiosInstance.get(
        `/recipients/?search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setSearchResults(data);
    } catch (err) {
      toast.error(t("errorSearchFailed"), {
        duration: 4000,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const onPageChange = (event: DataTablePageEvent) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
    <>
      <Button
        className="flex items-center gap-2 mb-5 bg-amber-500 hover:bg-amber-600"
        onClick={() => setIsOpen(true)}
      >
        <SoSearch className="w-5 h-5" /> {t("searchRecipient")}
      </Button>

      <Modal fullWidth isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <div
          className={`absolute top-[-20px] ${
            currentLng === "ar" ? "left-0" : "right-0"
          }`}
          dir={dir}
        >
          <div className="bg-[#E8F0F7] rounded-full p-1">
            <SoXmarkCircle
              className="w-6 h-6 cursor-pointer text-red-600"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>

        <div
          className="w-full flex flex-col items-center justify-center space-y-5 pt-10 px-5"
          dir={dir}
        >
          <div className="w-full relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value === "") setSearchResults([]);
              }}
              onKeyDown={handleKeyPress}
              placeholder={t("searchByEmailPlaceholder")}
              style={{ textAlign: currentLng === "ar" ? "right" : "left" }}
              dir={dir}
            />
            <SoSearch
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 ${
                currentLng === "ar" ? "left-3" : "right-3"
              }`}
            />
          </div>

          {searchResults.length > 0 && (
            <div id="datatable" className="overflow-x-auto w-full">
              <DataTable
                dataKey="id"
                value={searchResults}
                loading={isSearching}
                removableSort
                tableStyle={{ minWidth: "100%", cursor: "pointer" }}
                paginator
                rows={rows}
                first={first}
                onPage={onPageChange}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                rowsPerPageOptions={[10, 20, 30]}
                totalRecords={searchResults.length}
                scrollable
                scrollHeight="400px"
                emptyMessage={t("noResults")}
              >
                <Column
                  field="name"
                  header={t("headerName")}
                  style={{
                    minWidth: "120px",
                    borderRadius: "0px",
                    fontSize: "14px",
                  }}
                  body={(rowData) => (
                    <div className="w-full flex">
                      {rowData?.name || t("unknown")}
                    </div>
                  )}
                />
                <Column
                  field="email"
                  header={t("headerEmail")}
                  style={{
                    minWidth: "120px",
                    borderRadius: "0px",
                    fontSize: "14px",
                  }}
                  body={(rowData) => (
                    <div className="w-full flex">
                      {rowData?.email || t("unknown")}
                    </div>
                  )}
                />
                <Column
                  field="job_title"
                  header={t("headerJobTitle")}
                  style={{
                    minWidth: "120px",
                    borderRadius: "0px",
                    fontSize: "14px",
                  }}
                  body={(rowData) => (
                    <div className="w-full flex">
                      {rowData?.job_title || t("unknown")}
                    </div>
                  )}
                />
                <Column
                  field="phone_number"
                  header={t("headerPhone")}
                  style={{
                    minWidth: "120px",
                    borderRadius: "0px",
                    fontSize: "14px",
                  }}
                  body={(rowData) => (
                    <div className="w-full flex">
                      {rowData?.phone_number || t("unknown")}
                    </div>
                  )}
                />
                <Column
                  field="name_of_organization"
                  header={t("headerOrganization")}
                  style={{
                    minWidth: "120px",
                    borderRadius: "0px",
                    fontSize: "14px",
                  }}
                  body={(rowData) => (
                    <div className="w-full flex">
                      {rowData?.name_of_organization || t("unknown")}
                    </div>
                  )}
                />
                <Column
                  field="country"
                  header={t("headerCountry")}
                  style={{
                    minWidth: "120px",
                    borderRadius: "0px",
                    fontSize: "14px",
                  }}
                  body={(rowData) => (
                    <div className="w-full flex">
                      {rowData?.country || t("unknown")}
                    </div>
                  )}
                />
              </DataTable>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SearchRecipientList;
