export interface SupportedLanguage {
  code: string;
  name: string;
}

export const getSupportedLanguages = (): SupportedLanguage[] =>
  [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'cs', name: 'Čeština' },
    { code: 'pl', name: 'Polski' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'pt-BR', name: 'Português (Brasil)' },
    { code: 'pt-PT', name: 'Português (Portugal)' },
    { code: 'es', name: 'Español' },
    { code: 'es-MX', name: 'Español (Mexico)' },
    { code: 'es-AR', name: 'Español (Argentina)' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'sv', name: 'Svenska' },
    { code: 'hu', name: 'Magyar' },
    { code: 'he', name: 'עברית' },
  ].sort((a, b) => a.name.localeCompare(b.name));

const RTL_LANGUAGES = new Set(['he', 'ar', 'fa', 'ur']);

/** Text direction for a locale code such as `he` or `pt-BR`. */
export const getLanguageDirection = (locale: string | undefined): 'ltr' | 'rtl' =>
  RTL_LANGUAGES.has(locale?.split('-')[0] ?? '') ? 'rtl' : 'ltr';
