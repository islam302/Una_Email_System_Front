const home = {
  landing: {
    title: "Experience the Latest and Most Powerful Email Platform",
    highlightedTitle: "Email Platform",
    description:
      "A new messaging system that provides everything you need in the world of communication",
    buttons: {
      discoverServices: "Discover Services",
      pricingPlans: "Pricing Plans",
    },
    imageAlt: "Main Image",
  },
  about: {
    titleImageAlt: "About Section Title",
    description:
      "EmailSender, offered by SolomDev0 Ltd, a leader in digital communications based in London, provides businesses with the ability to send SMS messages using customized sender identities, enhancing professionalism and trust. The service supports both individual and bulk messaging, enabling targeted notifications or large-scale campaigns. It integrates via APIs with tools like CRMs and e-commerce platforms for automation and personalized communication. Key features include:<br /><br />• Flexible Messaging: Supports targeted and bulk messages<br />• API Integration: Connects with internal systems for automation<br />• Message Archive: Tracks deliveries, analyzes campaigns, and ensures performance optimization<br /><br />This innovative solution empowers businesses to communicate securely, efficiently, and professionally.",
    imageAlt: "Service Image",
  },
  services: {
    titleImageAlt: "Services Section Title",
    description:
      "The company excels in providing and developing email services with cutting-edge technology, high quality, and continuous 24/7 technical support, positioning it at the forefront of leading companies in this field.",
    items: [
      {
        title: "Bulk Sending",
        description:
          "Bulk email sending allows sending text messages to multiple recipients simultaneously. This feature is typically used for mass messaging, enabling businesses to efficiently send promotional offers, alerts, reminders, or updates to a large audience. It saves time, ensures consistent communication, and supports personalized content through features like dynamic fields for names or details.",
      },
      {
        title: "Email Templates",
        description:
          "Email templates on the platform are pre-designed message models that simplify communication by allowing users to create and reuse standardized text messages. These templates save time, ensure consistency, and reduce errors, especially for recurring messages like confirmations, reminders, promotional offers, or alerts. They can often be customized with placeholders for recipient-specific details like names or dates.",
      },
      {
        title: "24/7 Technical Support",
        description:
          "24/7 technical support for the email platform provides continuous assistance for any issues or inquiries related to the platform. This service offers expert guidance in troubleshooting, setup, campaign management, and API integrations, ensuring seamless and uninterrupted email operations. It boosts user confidence by providing quick solutions through multiple channels like chat and email.",
      },
    ],
  },
  resellers: {
    titleImageAlt: "Resellers Section Title",
    title: "Do you want to become an authorized SMS service reseller?",
    description:
      "Request your project now and manage sub-accounts through the best messaging platform.",
    features: [
      "Activate your account via OTP and email.",
      "An SMS system branded with your business name and logo.",
      "Reports detailing sub-account balances and sent messages.",
      "Send appointment reminders.",
      "Manage your bookings.",
    ],
    imageAlt: "Reseller",
  },
  contact: {
    titleImageAlt: "Contact Us Section Title",
    description: "We will respond to you soon.",
    labels: {
      fullname: "Full Name",
      phone: "Phone Number",
      email: "Email",
      company: "Company Name",
      message: "Message",
    },
    placeholders: {
      fullname: "Enter Full Name",
      phone: "Enter Phone Number",
      email: "Enter Email",
      company: "Enter Company Name",
      message: "Enter Message",
    },
    button: "Send",
    imageAlt: "Contact Us",
    errors: {
      requiredFields: "Please fill in all fields",
      sendFailure: "Failed to send the message!",
    },
    success: {
      sendSuccess: "Message sent successfully!",
    },
  },
} as const;

export default home;
