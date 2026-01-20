import { signal } from '@preact/signals';
import type { Locale, Translations } from './types';
import { en } from './locales/en';
import { ja } from './locales/ja';

const translations: Record<Locale, Translations> = { en, ja };

// Server-side: detect locale from Accept-Language header
export function detectLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return 'en';
  return acceptLanguage.toLowerCase().startsWith('ja') ? 'ja' : 'en';
}

// Server-side: get translations for a specific locale
export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

// Client-side: detect locale from document or navigator
function detectLocale(): Locale {
  if (typeof document !== 'undefined') {
    const saved = document.documentElement.dataset.locale as Locale | undefined;
    if (saved && (saved === 'en' || saved === 'ja')) {
      return saved;
    }
  }

  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage;
  return browserLang?.startsWith('ja') ? 'ja' : 'en';
}

export const currentLocale = signal<Locale>(detectLocale());

export function t(): Translations {
  return translations[currentLocale.value];
}

export function getLocale(): Locale {
  return currentLocale.value;
}

export type { Locale, Translations };
