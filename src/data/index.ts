import {
  SoCellularNetwork,
  SoCity,
  SoContact,
  SoLock,
  SoMail,
  SoMailReceive,
  SoNote2,
  SoPhone,
  SoUser,
} from "solom-icon";
import {
  IAddUser,
  IForgetInput,
  ILoginInput,
  IRecipientGroupInput,
  IRecipientInput,
  IRecipientListInput,
  IResetInput,
  ITemplateInput,
  IUpdateUser,
} from "../interfaces";
import validation from "@/i18n/resources/en/validation/validation";

export const LOGIN_FORM: ILoginInput[] = [
  {
    name: "username",
    placeholder: validation.usernamePlaceholder,
    type: "text",
    id: "username",
    label: validation.usernameLabel,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "password",
    placeholder: validation.passwordPlaceholder,
    type: "password",
    id: "password",
    label: validation.passwordLabel,
    validation: {
      required: true,
      minLength: 6,
    },
  },
];

export const FORGET_FORM: IForgetInput[] = [
  {
    name: "email",
    placeholder: validation.emailPlaceholder,
    type: "email",
    id: "email",
    label: validation.emailLabel,
    validation: {
      required: true,
      pattern: /^[^@]+@[^@]+\.[^@ .]{2,}$/,
    },
  },
];

export const RESET_FORM: IResetInput[] = [
  {
    name: "password",
    placeholder: validation.newPasswordPlaceholder,
    type: "password",
    id: "password",
    label: validation.newPasswordLabel,
    validation: {
      required: true,
      minLength: 6,
    },
  },
  {
    name: "password_confirmation",
    placeholder: validation.confirmPasswordPlaceholder,
    type: "password",
    id: "password_confirmation",
    label: validation.confirmPasswordLabel,
    validation: {
      required: true,
      minLength: 6,
    },
  },
];

export const RECIPIENT_FORM: IRecipientInput[] = [
  {
    name: "name",
    placeholder: validation.clientNamePlaceholder,
    type: "text",
    id: "name",
    label: validation.clientNameLabel,
    icon: SoUser,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "email",
    placeholder: validation.emailAddressPlaceholder,
    type: "email",
    id: "email",
    label: validation.emailAddressLabel,
    icon: SoMailReceive,
    validation: {
      required: true,
    },
  },
  {
    name: "country",
    placeholder: validation.countryPlaceholder,
    type: "text",
    id: "country",
    label: validation.countryLabel,
    icon: SoCellularNetwork,
    validation: {
      required: true,
    },
  },
  {
    name: "job_title",
    placeholder: validation.jobTitlePlaceholder,
    type: "text",
    id: "job_title",
    label: validation.jobTitleLabel,
    icon: SoContact,
    validation: {
      required: true,
    },
  },
  {
    name: "phone_number",
    placeholder: validation.phoneNumberPlaceholder,
    type: "tel",
    id: "phone_number",
    label: validation.phoneNumberLabel,
    icon: SoPhone,
    validation: {
      required: true,
    },
  },
  {
    name: "name_of_organization",
    placeholder: validation.orgNamePlaceholder,
    type: "text",
    id: "name_of_organization",
    label: validation.orgNameLabel,
    icon: SoCity,
    validation: {
      required: true,
    },
  },
];

export const RECIPIENT_LIST_FORM: IRecipientListInput[] = [
  {
    name: "name",
    placeholder: validation.listNamePlaceholder,
    type: "text",
    id: "name",
    label: validation.listNameLabel,
    icon: SoNote2,
    validation: {
      required: true,
      minLength: 3,
    },
  },
];

export const RECIPIENT_GROUP_FORM: IRecipientGroupInput[] = [
  {
    name: "name",
    placeholder: validation.groupNamePlaceholder,
    type: "text",
    id: "name",
    label: validation.groupNameLabel,
    icon: SoNote2,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "recipient_lists",
    placeholder: validation.selectListsPlaceholder,
    type: "text",
    id: "recipient_lists",
    label: validation.selectListsLabel,
    icon: SoNote2,
    validation: {
      required: true,
      minLength: 3,
    },
  },
];

export const TEMPLATE_FORM: ITemplateInput[] = [
  {
    name: "name",
    placeholder: validation.templateNamePlaceholder,
    type: "text",
    id: "name",
    label: validation.templateNameLabel,
    icon: SoNote2,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "content",
    placeholder: validation.templateContentPlaceholder,
    type: "text",
    id: "content",
    label: validation.templateContentLabel,
    icon: SoNote2,
    validation: {
      required: true,
      minLength: 3,
    },
  },
];

export const ADD_USER_FORM: IAddUser[] = [
  {
    name: "username",
    placeholder: validation.usernamePlaceholder,
    type: "text",
    id: "username",
    label: validation.usernameLabel,
    icon: SoUser,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "email",
    placeholder: validation.emailPlaceholder,
    type: "email",
    id: "email",
    label: validation.emailLabel,
    icon: SoMail,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "organization",
    placeholder: validation.orgNamePlaceholder,
    type: "text",
    id: "organization",
    label: validation.orgNameLabel,
    icon: SoCity,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "password",
    placeholder: validation.passwordPlaceholder,
    type: "password",
    id: "password",
    label: validation.passwordLabel,
    icon: SoLock,
    validation: {
      required: true,
      minLength: 6,
    },
  },
  {
    name: "sender_name",
    placeholder: validation.orgNamePlaceholder,
    type: "text",
    id: "sender_name",
    label: validation.orgNameLabel,
    icon: SoCity,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "domains",
    placeholder: validation.orgNamePlaceholder,
    type: "text",
    id: "domains",
    label: validation.orgNameLabel,
    icon: SoCity,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "sender_emails",
    placeholder: validation.orgNamePlaceholder,
    type: "text",
    id: "sender_emails",
    label: validation.orgNameLabel,
    icon: SoCity,
    validation: {
      required: true,
      minLength: 3,
    },
  },
];

export const UPDATE_USER_FORM: IUpdateUser[] = [
  {
    name: "username",
    placeholder: validation.usernamePlaceholder,
    type: "text",
    id: "username",
    label: validation.usernameLabel,
    icon: SoUser,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "email",
    placeholder: validation.emailPlaceholder,
    type: "email",
    id: "email",
    label: validation.emailLabel,
    icon: SoMail,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "organization",
    placeholder: validation.orgNamePlaceholder,
    type: "text",
    id: "organization",
    label: validation.orgNameLabel,
    icon: SoCity,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "sender_name",
    placeholder: validation.orgNamePlaceholder,
    type: "text",
    id: "sender_name",
    label: validation.orgNameLabel,
    icon: SoCity,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "domains",
    placeholder: validation.orgNamePlaceholder,
    type: "text",
    id: "domains",
    label: validation.orgNameLabel,
    icon: SoCity,
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "sender_emails",
    placeholder: validation.orgNamePlaceholder,
    type: "text",
    id: "sender_emails",
    label: validation.orgNameLabel,
    icon: SoCity,
    validation: {
      required: true,
      minLength: 3,
    },
  },
];
