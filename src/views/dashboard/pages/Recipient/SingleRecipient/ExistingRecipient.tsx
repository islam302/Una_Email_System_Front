/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../../components/elements/Button";
import Modal from "../../../../../components/elements/Modal";
import {
  SoFileVerified,
  SoProfile,
  SoSend,
  SoTrash,
  SoXmarkCircle,
} from "solom-icon";
import Cookies from "universal-cookie";
import { SetStateAction, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../../../config/axios.config";
import { useGetUsersQuery } from "../../../../../app/functions/api/usersApi";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
}

const ExistingRecipientList = ({ isOpen, setIsOpen }: IProps) => {
  const { id } = useParams();

  const cookie = new Cookies();
  const token = cookie.get("userLoggedES");
  const [users, setUsers] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: Users } = useGetUsersQuery();

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const { status } = await axiosInstance.post(
        `recipients/list/${id}/add-recipient/`,
        { users },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (status === 200) {
        toast.success("تم رفع الملف بنجاح");
        setUsers("");
        setIsOpen(false);
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

  return (
    <>
      <Button
        className="flex items-center gap-2 mb-5 bg-green-300"
        onClick={() => setIsOpen(true)}
      >
        <SoFileVerified className="w-5 h-5" /> Existing New Recipient
      </Button>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <div className="absolute top-[-20px] left-0">
          <div className="bg-[#E8F0F7] rounded-full p-1">
            <SoXmarkCircle
              className="w-6 h-6 cursor-pointer text-red-600"
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center space-y-5 pt-10 px-5">
          <form className="w-full" onSubmit={onSubmit}>
            <div className="w-full flex flex-col items-start justify-center space-y-5">
              <div className="w-full flex flex-col items-center justify-between space-y-8">
                <div className="w-full flex flex-col items-center justify-between space-y-3">
                  <div className="w-full flex flex-col items-center gap-3">
                    <div className="w-full flex flex-row items-center gap-2 border border-accent rounded-lg">
                      <div className="bg-accent p-2 rounded-l-md">
                        <SoProfile className="h-6 w-6 text-primary" />
                      </div>
                      <Dropdown
                        value={users}
                        onChange={(e) => setUsers(e.value)}
                        options={Users}
                        optionLabel="username"
                        optionValue="id"
                        placeholder="Select Username"
                        className="p-2 w-full"
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-row items-center gap-3 pt-5">
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className="w-full flex items-center gap-2"
                    >
                      <SoSend className="h-5 w-5" />
                      Send
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setUsers("")}
                      className="w-full flex items-center gap-2 bg-[#D20202] hover:bg-red-500"
                    >
                      <SoTrash className="h-5 w-5" />
                      Reset
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

export default ExistingRecipientList;
