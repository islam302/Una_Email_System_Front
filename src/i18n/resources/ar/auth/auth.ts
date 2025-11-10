const auth = {
  login: {
    welcome: "مرحبًا بك في برنامج إرسال البريد الإلكتروني",
    login: "تسجيل الدخول",
    forgotPassword: "هل نسيت كلمة المرور؟",
    successLogin: "تم تسجيل الدخول بنجاح!",
    errors: {
      invalidCredentials:
        "يرجى التحقق من كلمة المرور والبريد الإلكتروني والمحاولة مرة أخرى.",
      networkError: "خطأ في الاتصال بالشبكة، يرجى المحاولة مرة أخرى.",
    },
    placeholders: {
      username: "أدخل اسم المستخدم",
      password: "أدخل كلمة المرور",
    },
    labels: {
      username: "اسم المستخدم",
      password: "كلمة المرور",
    },
  },
  resetPassword: {
    resetPassword: "إعادة تعيين كلمة المرور",
    confirmReset: "تأكيد إعادة التعيين",
    backToLogin: "العودة إلى تسجيل الدخول",
    successReset: "تم إعادة تعيين كلمة المرور بنجاح.",
    invalidResetLink: "رابط إعادة التعيين غير صالح.",
    placeholders: {
      password: "أدخل كلمة المرور الجديدة",
      password_confirmation: "تأكيد كلمة المرور الجديدة",
    },
    labels: {
      password: "كلمة المرور الجديدة",
      password_confirmation: "تأكيد كلمة المرور",
    },
  },
  forgetPassword: {
    forgetPassword: "نسيت كلمة المرور",
    send: "إرسال",
    rememberedPassword: "هل تذكرت كلمة المرور؟",
    successSendReset:
      "تم إرسال بريد إلكتروني لإعادة تعيين كلمة المرور، يرجى التحقق من بريدك الإلكتروني خلال ساعة!",
    accountNotFound: "الحساب غير موجود، يرجى التحقق من بريدك الإلكتروني.",
    placeholders: {
      email: "أدخل البريد الإلكتروني",
    },
    labels: {
      email: "البريد الإلكتروني",
    },
  },
} as const;

export default auth;
