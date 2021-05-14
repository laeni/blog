import Head from 'next/head'
import Layout from '../components/layout'
import {genRss, getSortedPostsData} from '../lib/util'
import Link from 'next/link'
import {GetStaticProps} from "next";
import {rootTitle} from "./_document";
import React from "react";
import Carousel from "../components/carousel";

// 轮播图片
const listImg = [
    'https://pictures-1252266447.cos.ap-chengdu.myqcloud.com/blog/test/banner1.jpg',
    'https://pictures-1252266447.cos.ap-chengdu.myqcloud.com/blog/test/banner2.jpg',
    'https://pictures-1252266447.cos.ap-chengdu.myqcloud.com/blog/test/banner3.jpg',
];

export default function Home({allPostsData}) {
    // 轮播
    const carousel = <Carousel listImg={listImg}/>

    return (
        <>
            <Head>
                <title>{rootTitle}</title>
            </Head>
            <Layout carousel={carousel}>
                <section>
                    <h2>Blog</h2>
                    <ul>
                        {allPostsData.map(({pt, date, title}) => (
                            <li key={pt}>
                                <Link href={`/${pt}`}>
                                    <a>{title}</a>
                                </Link>
                                <br/>
                                <small>
                                    {date}
                                </small>
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
    const allPostsData = getSortedPostsData()

    // 生成 RSS 文件
    genRss(allPostsData)

    return {
        props: {allPostsData}
    }
}
