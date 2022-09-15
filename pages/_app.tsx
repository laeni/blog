import { AppProps } from 'next/app';
import { WithRouterProps } from 'next/dist/client/with-router';
import Head from 'next/head';
import { withRouter } from 'next/router';
import NProgress from "nprogress";
import { useEffect, useState } from 'react';
import '../lib/nprogress.css';
import './globals.css';

export default withRouter(function App({ Component, pageProps, router }: WithRouterProps & AppProps) {
  const [bdScriptSrc, setBdScriptSrc] = useState<string>();

  useEffect(() => {
    // 导航进度条
    if (router?.events?.on) {
      router.events.on('routeChangeStart', NProgress.start);
      router.events.on('routeChangeComplete', NProgress.done);
      router.events.on('routeChangeError', NProgress.done);
    }
    // 百度自动提交
    setBdScriptSrc(window.location.protocol.split(':')[0] === 'https' ? 'https://zz.bdstatic.com/linksubmit/push.js' : 'http://push.zhanzhang.baidu.com/push.js');

    return () => {
      if (router?.events?.off) {
        router.events.off('routeChangeStart', NProgress.start);
        router.events.off('routeChangeComplete', NProgress.done);
        router.events.off('routeChangeError', NProgress.done);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        {bdScriptSrc && <script src={bdScriptSrc} />}
      </Head>
      <Component {...pageProps} />
    </>
  )
})
