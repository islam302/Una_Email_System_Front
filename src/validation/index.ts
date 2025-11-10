import validation from "@/i18n/resources/en/validation/validation";
import * as yup from "yup";

export const registerSchema = yup
  .object({
    name: yup
      .string()
      .required(validation.nameRequired)
      .min(3, validation.nameMin),
    phone: yup.string().optional(),
    email: yup
      .string()
      .required(validation.emailRequired)
      .matches(/^[^@]+@[^@]+\.[^@ .]{2,}$/, validation.emailInvalid),
    password: yup
      .string()
      .required(validation.passwordRequired)
      .min(6, validation.passwordMin),
    password_confirmation: yup
      .string()
      .required(validation.passwordConfirmRequired)
      .oneOf([yup.ref("password")], validation.passwordMatch),
    country: yup.string().optional().min(3, validation.countryMin),
  })
  .required();

export const loginSchema = yup
  .object({
    username: yup
      .string()
      .required(validation.usernameRequired)
      .min(3, validation.usernameMin),
    password: yup
      .string()
      .required(validation.passwordRequired)
      .min(6, validation.passwordMin),
  })
  .required();

export const forgetSchema = yup
  .object({
    email: yup
      .string()
      .required(validation.emailRequired)
      .matches(/^[^@]+@[^@]+\.[^@ .]{2,}$/, validation.emailInvalid),
  })
  .required();

export const resetSchema = yup
  .object({
    password: yup
      .string()
      .required(validation.passwordRequired)
      .min(6, validation.passwordMin),
    password_confirmation: yup
      .string()
      .required(validation.passwordConfirmRequired)
      .oneOf([yup.ref("password")], validation.passwordMatch),
  })
  .required();

export const sendEmailSchema = yup.object().shape({
  subject: yup
    .string()
    .required(validation.subjectRequired)
    .min(3, validation.subjectMin),
  message_body: yup
    .string()
    .required(validation.messageRequired)
    .min(5, validation.messageMin),
  recipient_ids: yup
    .array()
    .of(yup.string().required(validation.recipientIdRequired))
    .min(1, validation.recipientsMin)
    .required(validation.recipientsRequired),
  email_template_id: yup.string().required(validation.templateRequired),
  survey_question: yup.string(),
  custom_question: yup.string(),
  custom_question_type: yup.string(),
  schedule: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .optional()
    .min(new Date(), validation.dateFuture),
  from_email: yup.string().required(validation.fromEmailRequired),
});

export const sendEmailListSchema = yup.object().shape({
  subject: yup
    .string()
    .required(validation.subjectRequired)
    .min(3, validation.subjectMin),
  message_body: yup
    .string()
    .required(validation.messageRequired)
    .min(5, validation.messageMin),
  recipient_list_id: yup.array().of(yup.string().optional()),
  // .min(1, validation.recipientsMin)
  // .required(validation.recipientListRequired),
  email_template_id: yup.string().required(validation.templateRequired),
  survey_question: yup.string(),
  custom_question: yup.string(),
  custom_question_type: yup.string(),
  schedule: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .optional()
    .min(new Date(), validation.dateFuture),
  from_email: yup.string().required(validation.fromEmailRequired),
});

export const sendGroupSchema = yup.object().shape({
  subject: yup
    .string()
    .required(validation.subjectRequired)
    .min(3, validation.subjectMin),
  message_body: yup
    .string()
    .required(validation.messageRequired)
    .min(5, validation.messageMin),
  group_id: yup
    .array()
    .of(yup.string().required(validation.recipientIdRequired))
    .min(1, validation.recipientsMin)
    .required(validation.groupListsRequired),
  email_template_id: yup.string().required(validation.templateRequired),
  survey_question: yup.string(),
  custom_question: yup.string(),
  custom_question_type: yup.string(),
  schedule: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .optional()
    .min(new Date(), validation.dateFuture),
  from_email: yup.string().required(validation.fromEmailRequired),
});

export const recipientSchema = yup.object().shape({
  email: yup
    .string()
    .email(validation.emailValid)
    .required(validation.emailRequired),
  name: yup.string().optional(),
  phone_number: yup
    .string()
    // .matches(/^\+?\d+$/, validation.phoneValid)
    .optional(),
  name_of_organization: yup.string().optional(),
  job_title: yup.string().optional(),
  country: yup.string().optional(),
});

export const recipientFileSchema = yup.object().shape({
  file: yup
    .mixed<FileList>()
    .required(validation.fileRequired)
    .test("fileExists", validation.fileRequired, (value) => {
      return value && value.length > 0;
    })
    .test("fileType", validation.fileType, (value) => {
      if (!value || value.length === 0) return false;
      const file = value[0];
      return (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      );
    })
    .test("fileSize", validation.fileSize, (value) => {
      if (!value || value.length === 0) return false;
      const file = value[0];
      return file.size <= 5 * 1024 * 1024;
    }),
});

export const recipientListSchema = yup.object().shape({
  name: yup.string().required(validation.listNameRequired),
});

export const recipientGroupSchema = yup.object().shape({
  name: yup.string().required(validation.listNameRequired),
  recipient_lists: yup
    .array()
    .of(yup.string().required(validation.recipientIdRequired))
    .min(1, validation.recipientsMin)
    .required(validation.groupListsRequired),
});

export const addTemplateSchema = yup.object().shape({
  name: yup.string().required(validation.templateNameRequired),
  content: yup
    .string()
    .min(8, validation.templateContentMin)
    .required(validation.templateContentRequired),
});

export const editRecipientSchema = yup.object().shape({
  id: yup.string().optional(),
  email: yup
    .string()
    .email(validation.emailValid)
    .required(validation.emailRequired),
  name: yup.string().optional(),
  phone_number: yup
    .string()
    // .matches(/^\+?\d+$/, validation.phoneValid)
    .optional(),
  name_of_organization: yup.string().optional(),
  job_title: yup.string().optional(),
  country: yup.string().optional(),
  // extra_fields: yup.array().optional(),
});

export const addUserSchema = yup.object().shape({
  username: yup
    .string()
    .required(validation.usernameRequired)
    .min(3, validation.usernameMin),
  email: yup
    .string()
    .required(validation.emailRequired)
    .matches(/^[^@]+@[^@]+\.[^@ .]{2,}$/, validation.emailInvalid),
  organization: yup
    .string()
    .required(validation.organizationNameRequired)
    .min(3, validation.organizationMin),
  password: yup
    .string()
    .required(validation.passwordRequired)
    .min(6, validation.passwordMin),
  sender_name: yup.string().required("Sender name is required"),
  sender_emails: yup
    .array()
    .of(yup.string().email("Invalid email"))
    .min(1, "At least one sender email is required"),
  domains: yup
    .array()
    .of(yup.string().required("Domain cannot be empty"))
    .min(1, "At least one domain is required"),
});

export const addAmountSchema = yup.object().shape({
  amount: yup
    .number()
    .required(validation.amountRequired)
    .positive(validation.amountPositive),
  user_id: yup.string().required(validation.userRequired),
});

export const addAmountTableSchema = yup.object().shape({
  amount: yup
    .number()
    .required(validation.amountRequired)
    .positive(validation.amountPositive),
  user_id: yup.string().optional(),
});

export const updateUserSchema = yup.object().shape({
  username: yup
    .string()
    .required(validation.usernameRequired)
    .min(3, validation.usernameMin),
  email: yup
    .string()
    .required(validation.emailRequired)
    .matches(/^[^@]+@[^@]+\.[^@ .]{2,}$/, validation.emailInvalid),
  organization: yup
    .string()
    .required(validation.organizationNameRequired)
    .min(3, validation.organizationMin),
  sender_name: yup.string().required("Sender name is required"),
  sender_emails: yup
    .array()
    .of(yup.string().email("Invalid email"))
    .min(1, "At least one sender email is required"),
  domains: yup
    .array()
    .of(yup.string().required("Domain cannot be empty"))
    .min(1, "At least one domain is required"),
});
