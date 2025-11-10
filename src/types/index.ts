import * as yup from "yup";
import {
  addAmountSchema,
  addAmountTableSchema,
  addTemplateSchema,
  addUserSchema,
  recipientFileSchema,
  recipientGroupSchema,
  recipientListSchema,
  recipientSchema,
  sendEmailListSchema,
  sendEmailSchema,
  sendGroupSchema,
  updateUserSchema,
} from "../validation";

export type TSendEmail = yup.InferType<typeof sendEmailSchema>;

export type TSendGroup = yup.InferType<typeof sendGroupSchema>;

export type TSendList = yup.InferType<typeof sendEmailListSchema>;

export type TRecipient = yup.InferType<typeof recipientSchema>;

export type TRecipientList = yup.InferType<typeof recipientListSchema>;

export type TRecipientGroup = yup.InferType<typeof recipientGroupSchema>;

export type TRecipientUpload = yup.InferType<typeof recipientFileSchema>;

export type TAddTemplate = yup.InferType<typeof addTemplateSchema>;

export type TAddUser = yup.InferType<typeof addUserSchema>;

export type TAddAmount = yup.InferType<typeof addAmountSchema>;

export type TAddAmountTable = yup.InferType<typeof addAmountTableSchema>;

export type TUpdateUser = yup.InferType<typeof updateUserSchema>;
