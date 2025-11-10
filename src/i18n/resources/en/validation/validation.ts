export const validation = {
  nameRequired: "Name is required!",
  nameMin: "Name must be at least 3 characters!",
  emailRequired: "Email is required!",
  phoneRequired: "Phone is required!",
  emailInvalid: "Invalid email address!",
  passwordRequired: "Password is required!",
  passwordMin: "Password must be at least 6 characters!",
  passwordConfirmRequired: "Password confirmation is required!",
  passwordMatch: "Passwords must match!",
  countryMin: "Country must be at least 3 characters!",

  usernameRequired: "Username is required!",
  usernameMin: "Username must be at least 3 characters!",

  forgetEmailRequired: "Email is required for password reset!",

  subjectRequired: "Subject is required!",
  subjectMin: "Subject must be at least 3 characters!",
  messageRequired: "Message is required!",
  messageMin: "Message must be at least 5 characters!",
  recipientsRequired: "At least one recipient is required!",
  templateRequired: "Email template is required!",
  dateFuture: "Schedule time must be in the future!",

  emailValid: "Please enter a valid email!",
  phoneValid: "Please enter a valid phone number!",
  organizationRequired: "Organization name is required!",
  jobTitleRequired: "Job title is required!",
  countryRequired: "Country is required!",

  fileRequired: "Excel file is required!",
  fileType: "File must be an Excel document (xlsx, xls)!",
  fileSize: "File size must be less than 5MB!",

  listNameRequired: "List name is required!",
  groupListsRequired: "At least one recipient list is required!",
  recipientIdRequired: "At least one recipient list is required!",
  recipientsMin: "At least one recipient list is required!",
  recipientListRequired: "At least one recipient list is required!",

  templateNameRequired: "Template name is required!",
  templateContentRequired: "Template content is required!",
  templateContentMin: "Template content must be at least 8 characters!",

  organizationNameRequired: "Organization name is required!",
  organizationMin: "Organization name must be at least 3 characters!",

  amountRequired: "Amount is required!",
  amountPositive: "Amount must be a positive number!",
  userRequired: "User is required!",

  usernamePlaceholder: "Enter your username",
  usernameLabel: "Username",
  passwordPlaceholder: "Enter your password",
  passwordLabel: "Password",

  emailPlaceholder: "Enter your email",
  emailLabel: "Email",

  newPasswordPlaceholder: "Enter your new password",
  newPasswordLabel: "Password",
  confirmPasswordPlaceholder: "Re-enter your password",
  confirmPasswordLabel: "Confirm Password",

  clientNamePlaceholder: "Enter client name",
  clientNameLabel: "Client Name",
  emailAddressPlaceholder: "Enter email address",
  emailAddressLabel: "Email",
  countryPlaceholder: "Select your country",
  countryLabel: "Country",
  jobTitlePlaceholder: "Enter job title",
  jobTitleLabel: "Job Title",
  phoneNumberPlaceholder: "Enter phone number",
  phoneNumberLabel: "Phone Number",
  orgNamePlaceholder: "Enter organization name",
  orgNameLabel: "Organization Name",

  listNamePlaceholder: "Enter list name",
  listNameLabel: "List Name",

  groupNamePlaceholder: "Enter group name",
  groupNameLabel: "Group Name",
  selectListsPlaceholder: "Select lists",
  selectListsLabel: "Lists",

  templateNamePlaceholder: "Enter template name",
  templateNameLabel: "Template Name",
  templateContentPlaceholder: "Write template content",
  templateContentLabel: "Template Content",
  fromEmailRequired: "From email is required",
} as const;

export default validation;
