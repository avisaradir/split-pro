import Document, { type DocumentProps, Head, Html, Main, NextScript } from 'next/document';

import { getLanguageDirection } from '~/utils/i18n/client';

const getHtmlLang = (locale: string | undefined) =>
  !locale || 'default' === locale ? 'en' : locale;

// Next.js sets `lang` on <html> but not `dir`. Set both so RTL locales are right on first paint.
export default class MyDocument extends Document<DocumentProps> {
  render() {
    const { locale } = this.props;

    return (
      <Html lang={getHtmlLang(locale)} dir={getLanguageDirection(locale)}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
