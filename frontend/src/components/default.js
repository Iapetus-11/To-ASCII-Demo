import Head from "next/head"
import Script from "next/script";

export default function Default({children, title}) {
    return (
        <main className="h-full w-full fixed overflow-y-auto bg-neutral-900">
            <Head>
                <title>{title || "To-ASCII Demo"}</title>
            </Head>

            {/* font awesome */}
            <Script src="https://kit.fontawesome.com/8b5bae0343.js" crossOrigin="anonymous" />

            {children}
        </main>
    )
}
