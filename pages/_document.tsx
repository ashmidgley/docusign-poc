import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          id="docuSignClick"
          strategy="beforeInteractive"
          src="https://demo.docusign.net/clickapi/sdk/latest/docusign-click.js"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
