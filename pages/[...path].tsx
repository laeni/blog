import Layout from '../components/layout'
import {getAllPostIds, getPostData, PostsContent} from '../lib/util'
import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'
import {rootTitle} from "./_document";
import styles from "./[...path].module.scss"

export default function Post({ postData }: { postData: PostsContent }) {
  return <Layout>
    <Head>
      <title>{postData.title} - {rootTitle}</title>
    </Head>
    <article className={styles.article}>
      <div className="bg-gray-100 sm:bg-gray-200 p-2 grid">
        <h1 className="text-md text-gray-700 p-1 h-7 truncate">{postData.title}</h1>
        <div className="text-xs px-1">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-shijian"/>
          </svg>
          <span className="pl-1">{postData.date}</span>
        </div>
      </div>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  </Layout>
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds()
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
