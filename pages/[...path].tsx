import Layout from '../components/layout'
import {getAllPostPath, getPostData, PostsContent} from '../lib/util'
import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'
import {rootTitle} from "./_document";
import styles from "./[...path].module.scss"
import ReactMarkdown from 'react-markdown'
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// import {docco} from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { Components } from "react-markdown/src/ast-to-react";

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java';

import prism from 'react-syntax-highlighter/dist/cjs/styles/prism/prism'

SyntaxHighlighter.registerLanguage('java', require('refractor/lang/java'));

const components: Components = {
  code({node, inline, className, children, ...props}) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
        <SyntaxHighlighter
            language={match[1]}
            style={prism}
            children={String(children).replace(/\n$/, '')}
            {...props}
        />
    ) : (
        <code className={className} {...props} />
    )
  }
}

export default function Post({ postData }: { postData: PostsContent }) {
  return <Layout>
    <Head>
      <title>{postData.title} - {rootTitle}</title>
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
        <ReactMarkdown components={components} children={postData.content} />
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
  console.log('[...path].tsx ------------------------------------------ getStaticProps')
  const postData: PostsContent = await getPostData(params.path)
  return {
    props: { postData }
  }
}
