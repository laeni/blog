import Head from 'next/head'
import Layout from '../components/layout'
import { genRss, getLatestPostsTitle, getSortedPostsData } from '../lib/util'
import Link from 'next/link'
import { GetStaticProps } from "next";
import { rootTitle } from "./_document";
import React from "react";
import Carousel from "../components/carousel";
import styles from "./index.module.scss"
import PostsBrief from '../components/posts-brief';

// 轮播
const carouselData = [
  {
    img: 'https://pictures-1252266447.cos.ap-chengdu.myqcloud.com/blog/index/dva.jpg',
    blank: false,
    url: '/note/web/umijs-plugin-dva'
  },
  {
    img: 'https://pictures-1252266447.cos.ap-chengdu.myqcloud.com/blog/index/forward-proxy.jpg',
    blank: false,
    url: '/note/net/forward-proxy'
  },
]

export default function Home({ allPostsData, latestPosts }) {
  // 轮播
  const carousel = <Carousel data={carouselData} />

  return (
    <>
      <Head>
        <title>{rootTitle}</title>
      </Head>
      <Layout carousel={carousel} latestPosts={latestPosts}>
        <section>
          <ul className="pb-2">
            {allPostsData.map(({ pt, title, author, date, updated, description, content }) => (
              <li key={pt} className={`py-3 px-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800`}>
                {/*标题*/}
                <div className="text-lg text-gray-600 dark:text-gray-400 truncate">
                  <Link href={`/${pt}`}>
                    <a className="font-bold">{title}</a>
                  </Link>
                </div>
                {/*摘要*/}
                <div className={`${styles.content} break-all text-justify pt-2 leading-normal text-sm text-gray-500 dark:text-gray-500`}
                     dangerouslySetInnerHTML={{__html: description || content}}
                />
                {/*文章其他信息*/}
                <PostsBrief author={author} date={date} updated={updated}
                            className="text-xs text-gray-500 flex py-1"
                />
              </li>
            ))}
          </ul>
        </section>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // 获取所有文章数据
  const allPostsData = getSortedPostsData();
  // 获取最新文章标题
  const latestPosts = getLatestPostsTitle();

  // 生成 RSS 文件
  genRss(allPostsData)

  return {
    props: { allPostsData, latestPosts }
  }
}
