import Head from "next/head";
import Script from "next/script";

export default function Default({ children, title, description }) {
  title = title || "To-ASCII Demo";
  description = description || "Demo site for the To-ASCII library";

  return (
    <main className="h-full w-full fixed overflow-y-auto bg-neutral-900">
      <Head>
        <title>{title}</title>

        <meta name="title" content={title} />
        <meta name="keywords" content="iapetus11, iapetus-11, milo, weinberg, milo weinberg" />
        <meta name="description" content={description} />

        {/* meta for embeds in discord and facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://ascii.iapetus11.me/" />
        <meta property="og:image" content="https://iapetus11.me/static/images/favicon.png" />

        {/* meta for embeds in twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:url" content="https://ascii.iapetus11.me/" />
        <meta name="twitter:image" content="https://ascii.iapetus11.me/static/images/favicon.png" />
      </Head>

      {/* font awesome */}
      <Script src="https://kit.fontawesome.com/8b5bae0343.js" crossOrigin="anonymous" />

      {children}
    </main>
  );
}
