import hiLocale from '../locales/hi.json';
import mrLocale from '../locales/mr.json';
import enLocale from '../locales/en.json';

export const TRANSLATIONS = {
  hi: hiLocale,
  mr: mrLocale,
  en: enLocale
};

export function t(key, lang = 'hi') {
  const currentDict = TRANSLATIONS[lang] || TRANSLATIONS['hi'];
  if (currentDict && currentDict[key]) return currentDict[key];
  if (TRANSLATIONS['mr'] && TRANSLATIONS['mr'][key]) return TRANSLATIONS['mr'][key];
  if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) return TRANSLATIONS['en'][key];
  return key;
}
