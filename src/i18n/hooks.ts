import { useTranslation as useI18nTranslation } from 'react-i18next';
import { Namespaces } from './resources/index'; // Point to correct types location

export const useTranslation = (ns?: Namespaces) => {
  return useI18nTranslation(ns);
};

export type TranslationFunction = ReturnType<typeof useTranslation>[0];