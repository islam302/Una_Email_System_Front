import { Resources } from "./resources";

export const defaultNS = "common" as const;
export const fallbackLng = "en" as const; // This will be used when no language is detected
export const supportedLngs = ["en", "ar"] as const;

export type SupportedLanguages = keyof Resources;

export const i18nConfig = {
  fallbackLng, // English will be used as fallback
  defaultNS,
  ns: ["common", "dashboard", "sidebar", "navbar", "breadcrumbs"],
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
    caches: ["localStorage"],
    lookupLocalStorage: "i18nextLng",
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,

    // Optional: check browser language but only use if it's in your supportedLngs
    checkWhitelist: true,
  },
  // This ensures the detected language is always from your supportedLngs
  supportedLngs,
};
