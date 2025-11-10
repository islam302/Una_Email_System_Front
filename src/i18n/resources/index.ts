import en from "./en";
import ar from "./ar";

export const resources = {
  en,
  ar,
} as const;

export type Resources = typeof resources;

export type Namespaces = keyof typeof en;

export default resources;
