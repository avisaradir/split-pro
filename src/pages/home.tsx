import { type GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import { LanguageSelector } from '~/components/LanguageSelector';
import { Button } from '~/components/ui/button';
import { customServerSideTranslations } from '~/utils/i18n/server';

/**
 * App launch screen: just the app identity and a way in — no marketing copy.
 */
const Home = () => {
  const { t } = useTranslation('home');

  return (
    <>
      <Head>
        <title>{t('nav.app_name')}</title>
      </Head>
      <main className="bg-background flex min-h-full flex-col px-4 pt-[env(safe-area-inset-top)] pb-[max(env(safe-area-inset-bottom),1rem)]">
        <nav className="mx-auto flex w-full max-w-md justify-end py-3">
          <LanguageSelector />
        </nav>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5">
          <Image
            src="/logo.png"
            alt=""
            width={96}
            height={96}
            priority
            className="rounded-[22px] shadow-sm dark:ring-1 dark:ring-white/15"
          />
          <h1 className="text-foreground text-3xl font-bold tracking-tight">{t('nav.app_name')}</h1>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/auth/signin">{t('hero.get_started_button')}</Link>
          </Button>
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <Link href="/terms" className="flex min-h-11 items-center px-3 hover:underline">
              {t('nav.terms')}
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/privacy" className="flex min-h-11 items-center px-3 hover:underline">
              {t('nav.privacy')}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: await customServerSideTranslations(context.locale, ['home']),
});
