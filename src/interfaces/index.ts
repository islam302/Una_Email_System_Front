/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IRegisterInput {
  name:
    | "name"
    | "email"
    | "phone"
    | "password"
    | "password_confirmation"
    | "country";
  placeholder: string;
  type: string;
  id: string;
  label: string;
  validation?: {
    pattern?: RegExp;
    required?: boolean;
    minLength?: number;
  };
}

export interface ILoginInput {
  name: "username" | "password";
  placeholder: string;
  type: string;
  id: string;
  label: string;
  validation: {
    required?: boolean;
    minLength?: number;
  };
}

export interface IForgetInput {
  name: "email";
  placeholder: string;
  type: string;
  id: string;
  label: string;
  validation: {
    pattern?: RegExp;
    required?: boolean;
    minLength?: number;
  };
}

export interface IResetInput {
  name: "password" | "password_confirmation";
  placeholder: string;
  type: string;
  id: string;
  label: string;
  validation: {
    pattern?: RegExp;
    required?: boolean;
    minLength?: number;
  };
}

export interface IRecipientInput {
  name:
    | "name"
    | "email"
    | "country"
    | "job_title"
    | "phone_number"
    | "name_of_organization";
  placeholder: string;
  type: string;
  id: string;
  label: string;
  icon?: any;
  validation: {
    pattern?: RegExp;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
}

export interface IRecipientListInput {
  name: "name";
  placeholder: string;
  type: string;
  id: string;
  label: string;
  icon?: any;
  validation: {
    pattern?: RegExp;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
}

export interface IRecipientGroupInput {
  name: "name" | "recipient_lists";
  placeholder: string;
  type: string;
  id: string;
  label: string;
  icon?: any;
  validation: {
    pattern?: RegExp;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
}

export interface ITemplateInput {
  name: "name" | "content";
  placeholder: string;
  type: string;
  id: string;
  label: string;
  icon?: any;
  validation: {
    pattern?: RegExp;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
}

export interface IErrorResponse {
  status?: number;
  message?: string;
  error: {
    message?: string;
    details?: {
      message?: string;
    };
  };
  errors: {
    name?: string[] | undefined;
    email?: string[] | undefined;
    phone?: string[] | undefined;
    country?: string[] | undefined;
    password?: string[] | undefined;
    password_confirmation?: string[] | undefined;
    [key: string]: string[] | undefined;
  };
}

export interface IToken {
  access: string;
  role: string;
  username: string;
}

export interface ITemplates {
  id: number;
  user_id: number;
  name: string;
  text: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface IAddUser {
  name:
    | "username"
    | "email"
    | "organization"
    | "password"
    | "domains"
    | "sender_name"
    | "sender_emails";
  placeholder: string;
  type: string;
  id: string;
  label: string;
  icon?: any;
  validation: {
    required?: boolean;
    minLength?: number;
  };
}

export interface IUpdateUser {
  name:
    | "username"
    | "email"
    | "organization"
    | "sender_emails"
    | "domains"
    | "sender_name";
  placeholder: string;
  type: string;
  id: string;
  label: string;
  icon?: any;
  validation: {
    required?: boolean;
    minLength?: number;
  };
}
