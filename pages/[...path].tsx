import Layout from '../components/layout'
import { CompletePosts, getAllPostPath, getLatestPostsTitle, getPostData } from '../lib/util'
import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { rootTitle } from "./_document";
import styles from "./[...path].module.scss"
import ReactMarkdown, { Components } from "react-markdown";
import PostsBrief from '../components/posts-brief';
import gfm from "remark-gfm";
import remarkHeadings, { Heading } from '@vcarl/remark-headings';
import remarkStringify from "remark-stringify";
import rehypeSlug from "rehype-slug";
import { unified } from 'unified'
import remarkParse from 'remark-parse'

/// 文章

const components: Components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')

    // 删除自动添加的换行
    children = children.map(value => String(value).replace(/[\n]+$/, ''));

    // 代码块使用动态加载,且服务端不加载,否则其中需要用到window而报错
    const DynamicCodeBlock = dynamic(
      () => import('../components/code-block'),
      { loading: () => <code>{children}</code>, ssr: false }
    )

    return inline ? (
      <code className="bg-gray-200 dark:bg-gray-700 rounded-sm px-1">{children}</code>
    ) : (
      <DynamicCodeBlock language={match?.length > 0 ? match[1] : ''} children={children} {...props} />
    )
  }
}

export default function Post({ postData, latestPosts, headings }: { postData: CompletePosts, latestPosts: any, headings: Heading[] }) {
  // 该文章在github上的路径
  const githubPage = `https://github.com/laeni/blog-content/blob/master/${postData.fileName}`

  return (
    <Layout heading={headings} latestPosts={latestPosts}>
      <Head>
        <title>{`${postData.title} | ${rootTitle}`}</title>
      </Head>
      <article>
        <div className="p-2 grid">
          <h1 className={`${styles.title} text-xl text-gray-600 dark:text-gray-300 p-1 max-h-16`}>{postData.title}</h1>
          {/*文章其他信息*/}
          <PostsBrief author={postData.author} date={postData.date} updated={postData.updated}
            className="text-xs text-gray-500 dark:text-gray-400 flex py-1"
          />
          <hr className="border-t-2 border-gray-200 dark:border-gray-700 mt-4 mx-1" />
        </div>
        {/* Markdown渲染的文章 */}
        <div className={`${styles.content} px-3 pb-3 text-gray-600 dark:text-gray-400 text-justify`}>
          <ReactMarkdown
            remarkPlugins={[gfm]}
            rehypePlugins={[rehypeSlug]}
            components={components}
            children={postData.content}
            skipHtml
          />
        </div>
        {/* 文章在github的地址 */}
        <div className="px-3 text-sm text-gray-400 dark:text-gray-500 pb-2">
          <hr className="mt-5 mb-3 border-gray-200 dark:border-gray-700" />
          <span>发现错误或想为文章做出贡献？ </span>
          <Link href={githubPage} className="text-blue-400 dark:text-blue-500" target="_blank">在 GitHub 上编辑此页面！</Link>
        </div>
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostPath();
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // 文章内容对应的完整文章内容
  const postData: CompletePosts = await getPostData(params.path);
  // 获取最新文章的标题
  const latestPosts = getLatestPostsTitle();
  // 根据Markdown文档提取出所有标题(用于目录生成)
  const headings = (await unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkHeadings)
    .process(postData.content)).data.headings as Heading[];

  return {
    // 注意：这里返回的数据必须要能被序列化为Json
    props: { postData, latestPosts, headings }
  }
}
