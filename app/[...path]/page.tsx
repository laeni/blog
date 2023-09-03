import remarkHeadings, { Heading } from '@vcarl/remark-headings'
import { Metadata } from 'next'
import Link from 'next/link'
import remarkParse from 'remark-parse'
import remarkStringify from "remark-stringify"
import { unified } from 'unified'
import PostsBrief from '../../components/posts-brief'
import { CompletePosts, getAllPostPath, getPostData } from '../../lib/util'
import { rootTitle } from '../layout'
import Widget from '../widget'
import ReactMarkdownContent from './content'
import styles from "./page.module.scss"
import 'supports-color';

/// 文章

type Props = {
  params: { path: string[] }
}

/** @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#static-metadata */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 文章内容对应的完整文章内容
  const postData: CompletePosts = getPostData(params.path);
  return { title: `${postData.title} | ${rootTitle}` }
}

export default async function Post({ params }: Props) {
  // 文章内容对应的完整文章内容
  const postData: CompletePosts = getPostData(params.path);
  // 根据Markdown文档提取出所有标题(用于目录生成)
  const headings = (await unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkHeadings)
    .process(postData.content)).data.headings as Heading[];

  // 该文章在github上的路径
  const githubPage = `https://github.com/laeni/blog-content/blob/main/${postData.fileName}`

  return (
    <div className="flex justify-between py-2 sm:py-3 px-0 sm:px-3 text-gray-800 dark:text-gray-300">
      {/*左边: 主内容区*/}
      <div className="flex-grow w-0">
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
            <ReactMarkdownContent>{postData.content}</ReactMarkdownContent>
          </div>
          {/* 文章在github的地址 */}
          <div className="px-3 text-sm text-gray-400 dark:text-gray-500 pb-2">
            <hr className="mt-5 mb-3 border-gray-200 dark:border-gray-700" />
            <span>发现错误或想为文章做出贡献？ </span>
            <Link href={githubPage} className="text-blue-400 dark:text-blue-500" target="_blank">在 GitHub 上编辑此页面！</Link>
          </div>
        </article>
      </div>
      {/*右边: 小组件,当屏幕宽度太小时换到“小屏幕菜单区”显示*/}
      <div className="flex-shrink-0 sm:w-64 md:w-72 lg:w-80 xl:w-96 hidden sm:block pl-2">
        <Widget heading={headings} />
      </div>
    </div>
  )
}

export async function generateStaticParams(): Promise<{ path: string[] }[]> {
  return getAllPostPath().map(it => ({ path: it }));
}
