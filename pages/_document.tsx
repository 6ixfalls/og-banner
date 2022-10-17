import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
                <link
                    rel="stylesheet"
                    href="https://i.icomoon.io/public/temp/da106da234/og-banner/style.css"
                />
                <script src="https://cdn.tailwindcss.com/" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        tailwind.config = {
                            theme: {
                              fontFamily: {
                                "sans": "'Inter', sans-serif",
                              }
                            }
                          }
                    `,
                    }}
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
