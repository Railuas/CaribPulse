import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#0b0d12" />
        <link rel="icon" href="/favicon.svg" />
        <meta name="description" content="CaribePulse — weather, news & travel in the Caribbean" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
