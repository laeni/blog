import Layout from '../components/layout'
import { CompletePosts, getAllPostPath, getLatestPostsTitle, getPostData } from '../lib/util'
import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'
import { rootTitle } from "./_document";
import styles from "./[...path].module.scss"
import ReactMarkdown from 'react-markdown'
import { Components } from "react-markdown/src/ast-to-react";
import PostsBrief from '../components/posts-brief';

// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';

// 支持多种主题
// import {
//   coyWithoutShadows, coy, prism, solarizedlight, coldarkCold,                     // 浅色
//   xonokai, vscDarkPlus, tomorrow, okaidia, materialOceanic, darcula, cb, a11yDark // 深色
// } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import theme from 'react-syntax-highlighter/dist/cjs/styles/prism/prism'

//#region  为了减小包大小，这里仅仅注册常见的语言 - https://github.com/react-syntax-highlighter/react-syntax-highlighter#light-build
import basic from 'refractor/lang/basic';
import c from 'refractor/lang/c';
import cpp from 'refractor/lang/cpp';
import css from 'refractor/lang/css';
import go from 'refractor/lang/go';
import java from 'refractor/lang/java';
import javascript from 'refractor/lang/javascript';
import json from 'refractor/lang/json';
import jsx from 'refractor/lang/jsx';
import kotlin from 'refractor/lang/kotlin';
import less from 'refractor/lang/less';
import lua from 'refractor/lang/lua';
import makefile from 'refractor/lang/makefile';
import markdown from 'refractor/lang/markdown';
import nginx from 'refractor/lang/nginx';
import python from 'refractor/lang/python';
import sql from 'refractor/lang/sql';
import typescript from 'refractor/lang/typescript';
import yaml from 'refractor/lang/yaml';
import React from "react";
SyntaxHighlighter.registerLanguage('basic', basic);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('less', less);
SyntaxHighlighter.registerLanguage('lua', lua);
SyntaxHighlighter.registerLanguage('makefile', makefile);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('nginx', nginx);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('yaml', yaml);
//#endregion

const components: Components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')

    // 删除自动添加的换行
    children = children.map(value => String(value).replace(/[\n]+$/, ''));
    if (!inline) {
      return (
        <SyntaxHighlighter
          language={match?.length > 0 ? match[1] : ''}
          style={theme}
          children={children}
          {...props}
        />
      )
    } else {
      return (
        <code className="bg-gray-200 rounded-sm px-1">{children}</code>
      )
    }

  }
}

export default function Post({ postData, latestPosts }: { postData: CompletePosts, latestPosts: any }) {

  // 该文章在github上的路径
  const githubPage = `https://github.com/laeni/blog-content/blob/master/${postData.fileName}`

  return (
    <Layout latestPosts={latestPosts}>
      <Head>
        <title>{postData.title} | {rootTitle}</title>
      </Head>
      <article>
        <div className="p-2 grid">
          <h1 className="text-xl text-gray-600 dark:text-gray-300 p-1 h-10 truncate">{postData.title}</h1>
          {/*文章其他信息*/}
          <PostsBrief author={postData.author} date={postData.date} updated={postData.updated}
                      className="text-xs text-gray-500 dark:text-gray-400 flex py-1"
          />
          <hr className="border-t-2 border-gray-200 dark:border-gray-700 mt-4 mx-1" />
        </div>
        {/* Markdown渲染的文章 */}
        <div className={`${styles.content} px-3 pb-3 text-gray-600 dark:text-gray-400 text-justify`}>
          <ReactMarkdown components={components} children={postData.content} skipHtml />
        </div>
        {/* 文章在github的地址 */}
        <div className="text-gray-400 dark:text-gray-500 pb-2">
          <hr className="mt-5 mb-3 mx-1 border-gray-200 dark:border-gray-700" />
          <span>发现错误或想为文章做出贡献？ </span>
          <Link href={githubPage}><a className="text-blue-400 dark:text-blue-500" target="_blank">在 GitHub 上编辑此页面！</a></Link>
        </div>
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostPath()
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData: CompletePosts = await getPostData(params.path);
  // 获取最新文章标题
  const latestPosts = getLatestPostsTitle();

  return {
    props: { postData, latestPosts }
  }
}
