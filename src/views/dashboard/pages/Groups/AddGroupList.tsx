/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../components/elements/Button";
import Modal from "../../../../components/elements/Modal";
import { SoSend, SoTrash, SoUserList, SoXmarkCircle } from "solom-icon";
import { SetStateAction } from "react";
import { toast } from "react-fox-toast";
import axiosInstance from "../../../../config/axios.config";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recipientGroupSchema } from "../../../../validation";
import { TRecipientGroup } from "../../../../types";
import InputErrorMessage from "../../../../components/auth-errormsg/InputErrorMessage";
import Input from "../../../../components/elements/Input";
import { RECIPIENT_GROUP_FORM } from "../../../../data";
import { tokenSelector } from "../../../../app/functions/token";
import { useSelector } from "react-redux";
import LoadingScreen from "../../../../components/website-loading";
import { useGetRecipientListsQuery } from "../../../../app/functions/api/recipientListsApi";
import Select from "react-select";
import { AxiosError } from "axios";
import { useTranslation } from "@/i18n/hooks";

interface IProps {
  isOpen: boolean;
  setIsOpen: (value: SetStateAction<boolean>) => void;
  refetchData: () => void;
}

const AddGroupList = ({ isOpen, setIsOpen, refetchData }: IProps) => {
  const { t, i18n } = useTranslation("group");

  const currentLng = i18n.language;
  const dir = currentLng === "ar" ? "rtl" : "ltr";

  const { access } = useSelector(tokenSelector);

  const { data: List, isLoading } = useGetRecipientListsQuery();

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<TRecipientGroup>({
    resolver: yupResolver(recipientGroupSchema),
    defaultValues: {
      name: "",
      recipient_lists: [],
    },
  });

  const onSubmit = async (data: TRecipientGroup) => {
    try {
      const { status } = await axiosInstance.post(
        `/recipients/recipient-groups/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (status === 201) {
        reset();
        refetchData();
        setIsOpen(false);
        toast.success(t("successAddGroup"));
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

  const renderRecipientForm = RECIPIENT_GROUP_FORM.map(
    ({ name, placeholder, type, validation, icon: Icon }, idx) => (
      <div
        key={idx}
        className={`w-full space-y-1 ${
          currentLng === "ar" ? "text-right" : "text-left"
        }`}
      >
        {name === "recipient_lists" ? null : (
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
                placeholder={placeholder}
                className="w-full focus:outline-none focus:border-0 focus:ring-transparent ring-transparent border-0 bg-transparent"
                style={{ textAlign: currentLng === "ar" ? "right" : "left" }}
                {...register(name, validation)}
              />
            </div>
            {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
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

  return (
    <>
      <Button
        className="flex items-center gap-2 mb-5"
        onClick={() => setIsOpen(true)}
      >
        <SoUserList className="w-5 h-5" /> {t("addNewGroup")}
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
              onClick={() => setIsOpen(false)}
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
                    {renderRecipientForm}
                    <div className="w-full flex flex-col items-center gap-3">
                      <div
                        className={`w-full flex ${
                          currentLng === "ar" ? "flex-row-reverse" : "flex-row"
                        } items-center gap-2 border border-accent rounded-lg`}
                      >
                        <div
                          className={`bg-accent p-2 ${
                            currentLng === "ar"
                              ? "rounded-l-md"
                              : "rounded-r-md"
                          }`}
                        >
                          <SoUserList className="h-6 w-6 text-primary" />
                        </div>
                        <Controller
                          name="recipient_lists"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isMulti
                              options={List}
                              getOptionLabel={(option) => option.name}
                              getOptionValue={(option) => option.id}
                              value={
                                List &&
                                List.filter((user) =>
                                  field.value?.includes(user.id)
                                )
                              }
                              onChange={(selected) =>
                                field.onChange(
                                  selected?.map((option) => option.id)
                                )
                              }
                              className="w-full react-select-container"
                              classNamePrefix="react-select"
                              placeholder={t("selectRecipientLists")}
                              noOptionsMessage={() => t("noOptions")}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  border: "none",
                                  boxShadow: "none",
                                  "&:hover": { border: "none" },
                                  textAlign:
                                    currentLng === "ar" ? "right" : "left",
                                }),
                                menu: (base) => ({
                                  ...base,
                                  textAlign:
                                    currentLng === "ar" ? "right" : "left",
                                }),
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="w-full flex items-end">
                        <InputErrorMessage
                          msg={errors.recipient_lists?.message}
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
                      onClick={() => reset()}
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

export default AddGroupList;
