import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Globe } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { getSupportedLanguages } from '~/utils/i18n/client';
import { cn } from '~/lib/utils';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const supportedLanguages = getSupportedLanguages();

  const currentLanguage =
    supportedLanguages.find((lang) => lang.code === i18n.language) ?? supportedLanguages[0];

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await fetch(`/api/locale?locale=${languageCode}`);
      await router.push(router.asPath, router.asPath, {
        locale: languageCode,
        scroll: false,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 px-2"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
        <span className="sm:hidden">{currentLanguage?.code.toUpperCase()}</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="bg-popover text-popover-foreground absolute end-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-xl shadow-lg">
            <div className="py-1">
              {supportedLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  aria-current={i18n.language === language.code ? 'true' : undefined}
                  className={`hover:bg-muted flex min-h-11 w-full items-center justify-between px-4 text-start text-base ${
                    i18n.language === language.code ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {language.name}
                  {i18n.language === language.code && <span className="text-primary ms-2">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
