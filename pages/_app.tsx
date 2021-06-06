import './globals.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { withRouter } from 'next/router';
import NProgress from "nprogress";
import '../lib/nprogress.css';
import React from 'react';

export default withRouter(class App extends React.Component<AppProps, any> {
  componentDidMount() {
    const { router } = this.props;

    // 导航进度条
    if (router?.events?.on) {
      router.events.on('routeChangeStart', NProgress.start);
      router.events.on('routeChangeComplete', NProgress.done);
      router.events.on('routeChangeError', NProgress.done);
    }
    // 百度自动提交
    (function(){
      const bp = document.createElement('script');
      if (window.location.protocol.split(':')[0] === 'https'){
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
      } else{
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
      }
      const s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(bp, s);
    })();
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        <Component {...pageProps} />
      </>
    )
  }
})
