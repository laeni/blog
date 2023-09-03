import Footer from '@/components/footer';
import Header from '@/components/header';
import type { Metadata } from 'next';
import Script from 'next/script';
import 'server-only';
import '../lib/nprogress.css';
import Globals from './globals';
import './globals.css';
import Widget from './widget';

export const rootTitle = 'Laeni的博客'

/** @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#static-metadata */
export const metadata: Metadata = {
  metadataBase: new URL('https://blog.laeni.cn/'),
  title: rootTitle,
  description: '该博客为个人博客，主要是用于记录一些开发相关的笔记，以方便查阅。',
  openGraph: {
    title: rootTitle,
    images: `https://og-image.vercel.app/${encodeURI(rootTitle)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`
  },
  other: { "baidu-site-verification": "code-5a8bwoW7Pk" },
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="zh" className="h-full">
      {/* 百度自动提交 */}
      <Script src="https://zz.bdstatic.com/linksubmit/push.js" />
      <Script src="/font_2464095_6irv0kam8oo.js" />
      <body className="antialiased bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        <Globals>
          <div className="min-h-screen flex flex-col justify-between">
            <div className="w-full">
              <Header widget={<Widget />} />
              <div className="md:container mx-auto">
                {children}
              </div>
            </div>
            <Footer />
          </div>
        </Globals>
      </body>
    </html>
  )
}
