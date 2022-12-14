import App from "next/app";

import Head from "next/head";

import fs from "fs";
import path from "path";

import { useEffect } from "react";
import { useRouter } from "next/router";

// import { getLocalData } from "../lib/api";
import { GA_ID, selectedCategories } from "../lib/constants";

import Script from "next/script";

import * as gtag from "../lib/gtag";

import NProgress from "nprogress";
import "../styles/globals.css";
import "../public/nprogress.css";

const MyApp = ({ Component, pageProps }) => {
  const Router = useRouter();
  useEffect(() => {
    const handleRouteStart = (url) => {
      console.log(`Loading: ${url}`);
      NProgress.start();
    };
    const handleRouteDone = (url) => {
      gtag.pageview(url);
      NProgress.done();
    };

    Router.events.on("routeChangeStart", handleRouteStart);
    Router.events.on("routeChangeComplete", handleRouteDone);
    Router.events.on("routeChangeError", handleRouteDone);

    return () => {
      Router.events.off("routeChangeStart", handleRouteStart);
      Router.events.off("routeChangeComplete", handleRouteDone);
      Router.events.off("routeChangeError", handleRouteDone);
    };
  }, [Router.events]);
  return (
    <>
      <Head>
        <meta name="google" content="notranslate" />
        <link
          rel="icon"
          href={`${Router.basePath}/favicon.ico`}
          sizes="16x16"
          type="image/x-icon"
        />
      </Head>

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Component {...pageProps} />
    </>
  );
};

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  try {
    // ????????????????????????
    // const allCategories = await getLocalData(`categories`);
    const allCategories = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), `data`, `categories.json`))
    ).data;

    let categories = allCategories.filter((cat) =>
      selectedCategories.includes(cat.id)
    );

    return {
      ...appProps,
      pageProps: { global: { categories } },
    };
  } catch (e) {
    return { ...appProps };
  }
};

export default MyApp;
