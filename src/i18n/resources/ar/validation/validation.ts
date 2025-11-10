export const validation = {
  nameRequired: "الاسم مطلوب!",
  nameMin: "الاسم يجب أن يكون 3 أحرف على الأقل!",
  emailRequired: "البريد الإلكتروني مطلوب!",
  phoneRequired: "رقم الهاتف مطلوب!",
  emailInvalid: "عنوان البريد الإلكتروني غير صالح!",
  passwordRequired: "كلمة المرور مطلوبة!",
  passwordMin: "كلمة المرور يجب أن تكون 6 أحرف على الأقل!",
  passwordConfirmRequired: "تأكيد كلمة المرور مطلوب!",
  passwordMatch: "كلمتا المرور يجب أن تتطابقا!",
  countryMin: "الدولة يجب أن تكون 3 أحرف على الأقل!",

  usernameRequired: "اسم المستخدم مطلوب!",
  usernameMin: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل!",

  forgetEmailRequired: "البريد الإلكتروني مطلوب لإعادة تعيين كلمة المرور!",

  subjectRequired: "الموضوع مطلوب!",
  subjectMin: "الموضوع يجب أن يكون 3 أحرف على الأقل!",
  messageRequired: "الرسالة مطلوبة!",
  messageMin: "الرسالة يجب أن تكون 5 أحرف على الأقل!",
  recipientsRequired: "يجب اختيار مستلم واحد على الأقل!",
  templateRequired: "قالب البريد الإلكتروني مطلوب!",
  dateFuture: "وقت الجدولة يجب أن يكون في المستقبل!",

  emailValid: "يرجى إدخال بريد إلكتروني صالح!",
  phoneValid: "يرجى إدخال رقم هاتف صالح!",
  organizationRequired: "اسم المنظمة مطلوب!",
  jobTitleRequired: "المسمى الوظيفي مطلوب!",
  countryRequired: "الدولة مطلوبة!",

  fileRequired: "ملف الإكسل مطلوب!",
  fileType: "الملف يجب أن يكون مستند إكسل (xlsx، xls)!",
  fileSize: "حجم الملف يجب أن يكون أقل من 5 ميجابايت!",

  listNameRequired: "اسم القائمة مطلوب!",
  groupListsRequired: "يجب اختيار قائمة مستلمين واحدة على الأقل!",
  recipientIdRequired: "يجب اختيار قائمة مستلمين واحدة على الأقل!",
  recipientsMin: "يجب اختيار قائمة مستلمين واحدة على الأقل!",
  recipientListRequired: "يجب اختيار قائمة مستلمين واحدة على الأقل!",

  templateNameRequired: "اسم القالب مطلوب!",
  templateContentRequired: "محتوى القالب مطلوب!",
  templateContentMin: "محتوى القالب يجب أن يكون 8 أحرف على الأقل!",

  organizationNameRequired: "اسم المنظمة مطلوب!",
  organizationMin: "اسم المنظمة يجب أن يكون 3 أحرف على الأقل!",

  amountRequired: "المبلغ مطلوب!",
  amountPositive: "المبلغ يجب أن يكون رقمًا موجبا!",
  userRequired: "المستخدم مطلوب!",

  usernamePlaceholder: "أدخل اسم المستخدم..",
  usernameLabel: "اسم المستخدم",
  passwordPlaceholder: "أدخل كلمة المرور..",
  passwordLabel: "كلمة المرور",

  emailPlaceholder: "أدخل بريدك الإلكتروني..",
  emailLabel: "البريد الإلكتروني",

  newPasswordPlaceholder: "أدخل كلمة المرور الجديدة..",
  newPasswordLabel: "كلمة المرور",
  confirmPasswordPlaceholder: "أعد إدخال كلمة المرور..",
  confirmPasswordLabel: "تأكيد كلمة المرور",

  clientNamePlaceholder: "أدخل اسم العميل..",
  clientNameLabel: "اسم العميل",
  emailAddressPlaceholder: "أدخل عنوان البريد الإلكتروني..",
  emailAddressLabel: "البريد الإلكتروني",
  countryPlaceholder: "اختر دولتك..",
  countryLabel: "الدولة",
  jobTitlePlaceholder: "أدخل المسمى الوظيفي..",
  jobTitleLabel: "المسمى الوظيفي",
  phoneNumberPlaceholder: "أدخل رقم الهاتف..",
  phoneNumberLabel: "رقم الهاتف",
  orgNamePlaceholder: "أدخل اسم المنظمة..",
  orgNameLabel: "اسم المنظمة",

  listNamePlaceholder: "أدخل اسم القائمة..",
  listNameLabel: "اسم القائمة",

  groupNamePlaceholder: "أدخل اسم المجموعة..",
  groupNameLabel: "اسم المجموعة",
  selectListsPlaceholder: "اختر القوائم..",
  selectListsLabel: "القوائم",

  templateNamePlaceholder: "أدخل اسم القالب..",
  templateNameLabel: "اسم القالب",
  templateContentPlaceholder: "اكتب محتوى القالب..",
  templateContentLabel: "محتوى القالب",
  fromEmailRequired: "البريد الإلكتروني مطلوب",
} as const;

export default validation;
