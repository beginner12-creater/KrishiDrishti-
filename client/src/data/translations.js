import { TRANSLATIONS } from '../context/LanguageContext';

export { TRANSLATIONS };

export function t(key, lang = 'hi') {
  const currentDict = TRANSLATIONS[lang] || TRANSLATIONS['hi'];
  if (currentDict && currentDict[key]) return currentDict[key];
  if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) return TRANSLATIONS['en'][key];
  if (TRANSLATIONS['hi'] && TRANSLATIONS['hi'][key]) return TRANSLATIONS['hi'][key];
  return key;
}
