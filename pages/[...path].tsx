import Layout from '../components/layout'
import {getAllPostPath, getPostData, PostsContent} from '../lib/util'
import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'
import {rootTitle} from "./_document";
import styles from "./[...path].module.scss"
import ReactMarkdown from 'react-markdown'
import { Components } from "react-markdown/src/ast-to-react";

// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';

// 支持多种主题
// import {
//   coyWithoutShadows, coy, prism, solarizedlight, coldarkCold,                     // 浅色
//   xonokai, vscDarkPlus, tomorrow, okaidia, materialOceanic, darcula, cb, a11yDark // 深色
// } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import theme from 'react-syntax-highlighter/dist/cjs/styles/prism/prism'

/// region 为了减小包大小，这里仅仅注册常见的语言 - https://github.com/react-syntax-highlighter/react-syntax-highlighter#light-build
import bash from 'refractor/lang/bash';
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
SyntaxHighlighter.registerLanguage('bash', bash);
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
/// endregion

const components: Components = {
  code({node, inline, className, children, ...props}) {
    const match = /language-(\w+)/.exec(className || '')

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

export default function Post({ postData }: { postData: PostsContent }) {
  return <Layout>
    <Head>
      <title>{postData.title} | {rootTitle}</title>
    </Head>
    <article>
      <div className="p-2 grid">
        <h1 className="text-xl text-gray-600 p-1 h-10 truncate">{postData.title}</h1>
        <div className="text-xs px-1">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-shijian"/>
          </svg>
          <span className="pl-1">{postData.date}</span>
        </div>
        <div className="border-b-2 pt-4 mx-1"/>
      </div>
      <div className={styles.content}>
        <ReactMarkdown components={components} children={postData.content} skipHtml/>
      </div>
    </article>
  </Layout>
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostPath()
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData: PostsContent = await getPostData(params.path)
  return {
    props: { postData }
  }
}
