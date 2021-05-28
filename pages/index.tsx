import Head from 'next/head'
import Layout from '../components/layout'
import {genRss, getLatestPostsTitle, getSortedPostsData} from '../lib/util'
import Link from 'next/link'
import {GetStaticProps} from "next";
import {rootTitle} from "./_document";
import React from "react";
import Carousel from "../components/carousel";
import styles from "./index.module.scss"

// 轮播
const carouselData = [
    {
        img: 'https://pictures-1252266447.cos.ap-chengdu.myqcloud.com/blog/index/forward-proxy.jpg',
        blank: false,
        url: '/note/net/forward-proxy'
    },
    {
        img: 'https://pictures-1252266447.cos.ap-chengdu.myqcloud.com/blog/test/banner2.jpg',
        blank: false,
        url: '/'
    },
    {
        img: 'https://pictures-1252266447.cos.ap-chengdu.myqcloud.com/blog/test/banner3.jpg',
        blank: false,
        url: '/'
    },
]

export default function Home({allPostsData, latestPosts}) {
    // 轮播
    const carousel = <Carousel data={carouselData}/>

    return (
        <>
            <Head>
                <title>{rootTitle}</title>
            </Head>
            <Layout carousel={carousel} latestPosts={latestPosts}>
                <section>
                    <ul className="pb-2">
                        {allPostsData.map(({pt, title, author, date, updated, description, content}) => (
                            <li key={pt} className={`py-3 px-2 border-b ${styles.postsLi}`}>
                                {/*标题*/}
                                <div className="text-lg text-gray-600 truncate">
                                    <Link href={`/${pt}`}>
                                        <a className="font-bold">{title}</a>
                                    </Link>
                                </div>
                                {/*摘要*/}
                                <div className={styles.content}>
                                    {description || content}
                                </div>
                                {/*其他信息*/}
                                <div className="text-xs text-gray-500 flex py-1">
                                    {/*作者*/}
                                    {author && (
                                        <div className="px-1">
                                            <svg className="icon" aria-hidden="true">
                                                <use xlinkHref="#icon-zuozhe"/>
                                            </svg>
                                            <span className="pl-1">{author}</span>
                                        </div>
                                    )}
                                    {/*更新时间(或创建时间)*/}
                                    {
                                        (updated || date) && (
                                            <div className="px-1">
                                                <svg className="icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-shijian"/>
                                                </svg>
                                                <span className="pl-1">{updated || date}</span>
                                            </div>
                                        )
                                    }
                                </div>
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
        props: {allPostsData, latestPosts}
    }
}
