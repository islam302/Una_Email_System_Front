export const layout = {
  navbar: {
    links: [
      { to: "landing", text: "Home" },
      { to: "about", text: "About Us" },
      { to: "services", text: "Services" },
      { to: "contact", text: "Contact Us" },
    ],
    startNow: "Get Started",
    logoAlt: "Logo",
    menuAriaLabel: "Navigation Menu",
    homeAriaLabel: "Home Page",
  },
  footer: {
    logoAlt: "Logo",
    brandName: "Email Sender",
    paymentIcons: [
      { src: "visa", alt: "Visa" },
      { src: "mastercard", alt: "Mastercard" },
      { src: "klarna", alt: "Klarna" },
      { src: "joudpay", alt: "Joudpay" },
    ],
    wavesAlt: "Waves",
    contactInfo: {
      address: "Saudi Arabia, Jeddah",
      email: "info@emailsender.co.uk",
    },
    copyright:
      "Copyright © 2025 Email Sender | All Rights Reserved | <span class='underline cursor-pointer'>Terms & Conditions</span> | <span class='underline cursor-pointer'>Privacy Policy</span>.",
  },
} as const;

export default layout;
