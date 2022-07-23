import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />

        {/* Global site tag (gtag.js) - Google Analytics */}
        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HSQ6EH3B6Q"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-HSQ6EH3B6Q');
          `,
          }}
        />
      </Head>

      {/* need to specify this here otherwise some mobile devices in landscape will have ugly white margins*/}
      <body className="bg-neutral-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
