import Document, { Html, Head, Main, NextScript } from 'next/document'

export const rootTitle = 'Laeni的博客'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="zh" className="h-full">
        <Head>
          <meta charSet="utf-8" />
          <meta name="renderer" content="webkit" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Laeni的个人博客" />
          <meta property="og:image" content={`https://og-image.vercel.app/${encodeURI(rootTitle)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`} />
          <meta name="og:title" content={rootTitle} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="baidu-site-verification" content="code-5a8bwoW7Pk" />
          <script src="/font_2464095_8m8uychzspt.js" />
        </Head>
        <body className="antialiased bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
