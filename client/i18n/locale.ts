export const SUPPORTED_LOCALES = ['en', 'ar', 'zh-CN', 'fr', 'ru', 'tr'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const RTL_LOCALES: ReadonlySet<Locale> = new Set(['ar']);

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return DEFAULT_LOCALE;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
