export const layout = {
  navbar: {
    links: [
      { to: "landing", text: "الرئيسية" },
      { to: "about", text: "من نحن" },
      { to: "services", text: "الخدمات" },
      { to: "contact", text: "اتصل بنا" },
    ],
    startNow: "ابدأ الآن",
    logoAlt: "الشعار",
    menuAriaLabel: "قائمة التنقل",
    homeAriaLabel: "الصفحة الرئيسية",
  },
  footer: {
    logoAlt: "شعار",
    brandName: "إيميل سيندر",
    paymentIcons: [
      { src: "visa", alt: "فيزا" },
      { src: "mastercard", alt: "ماستركارد" },
      { src: "klarna", alt: "كلارنا" },
      { src: "joudpay", alt: "جودباي" },
    ],
    wavesAlt: "موجات",
    contactInfo: {
      address: "المملكة العربية السعودية، جدة",
      email: "info@emailsender.co.uk",
    },
    copyright:
      "حقوق النشر © 2025 إيميل سيندر | جميع الحقوق محفوظة | <span class='underline cursor-pointer'>الشروط والأحكام</span> | <span class='underline cursor-pointer'>سياسة الخصوصية</span>.",
  },
} as const;

export default layout;
