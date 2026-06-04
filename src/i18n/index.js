import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import km from './locales/km.json';
import enExtra from './locales/extra-en.json';
import kmExtra from './locales/extra-km.json';

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      if (!target[key] || typeof target[key] !== 'object') target[key] = {};
      deepMerge(target[key], val);
    } else {
      target[key] = val;
    }
  }
  return target;
}

const enMessages = deepMerge(structuredClone(en), enExtra);
const kmMessages = deepMerge(structuredClone(km), kmExtra);

export const LOCALE_STORAGE_KEY = 'hrm-locale';
export const SUPPORTED_LOCALES = ['en', 'km'];

const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
const initialLocale = SUPPORTED_LOCALES.includes(saved) ? saved : 'en';

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: { en: enMessages, km: kmMessages },
});

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return;
  i18n.global.locale.value = locale;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.documentElement.lang = locale === 'km' ? 'km' : 'en';
}

setLocale(initialLocale);

export default i18n;
