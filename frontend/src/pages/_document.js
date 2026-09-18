import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>

      {/* need to specify this here otherwise some mobile devices in landscape will have ugly white margins*/}
      <body className="bg-neutral-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
