import './globals.css'
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from 'next/router'
import NProgress from "nprogress";
import "../lib/nprogress.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (router?.events?.on) {
    router.events.on('routeChangeStart', NProgress.start);
    router.events.on('routeChangeComplete', NProgress.done);
    router.events.on('routeChangeError', NProgress.done);
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
