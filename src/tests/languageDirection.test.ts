import { getLanguageDirection, getSupportedLanguages } from '~/utils/i18n/client';

describe('getLanguageDirection', () => {
  describe('RightToLeft', () => {
    it('should return rtl for Hebrew', () => {
      expect(getLanguageDirection('he')).toBe('rtl');
    });

    it('should return rtl for a regional Hebrew tag', () => {
      expect(getLanguageDirection('he-IL')).toBe('rtl');
    });
  });

  describe('LeftToRight', () => {
    it('should return ltr for other supported languages', () => {
      getSupportedLanguages()
        .filter(({ code }) => 'he' !== code)
        .forEach(({ code }) => expect(getLanguageDirection(code)).toBe('ltr'));
    });

    it('should return ltr for the default locale and a missing locale', () => {
      expect(getLanguageDirection('default')).toBe('ltr');
      expect(getLanguageDirection(undefined)).toBe('ltr');
    });
  });
});

describe('getSupportedLanguages', () => {
  it('should include Hebrew', () => {
    expect(getSupportedLanguages()).toContainEqual({ code: 'he', name: 'עברית' });
  });
});
