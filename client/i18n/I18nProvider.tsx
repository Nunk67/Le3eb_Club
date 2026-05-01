import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE, normalizeLocale, RTL_LOCALES, SUPPORTED_LOCALES, type Locale } from './locale';
import { LOCALE_LABELS, messages, type MessageKey } from './messages';

type I18nContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  isRtl: boolean;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  supportedLocales: readonly Locale[];
  getLocaleLabel: (value: Locale) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'le3eb_locale';

function applyVars(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return DEFAULT_LOCALE;
    return normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = messages[locale] ?? messages[DEFAULT_LOCALE];
    return {
      locale,
      setLocale: setLocaleState,
      isRtl: RTL_LOCALES.has(locale),
      t: (key, vars) => applyVars(dict[key] ?? messages.en[key], vars),
      supportedLocales: SUPPORTED_LOCALES,
      getLocaleLabel: (value: Locale) => LOCALE_LABELS[value]
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
