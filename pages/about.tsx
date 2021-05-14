import Head from 'next/head'
import Layout from '../components/layout'
import {getSortedPostsData} from '../lib/util'
import {GetStaticProps} from "next";
import {rootTitle} from "./_document";
import React from "react";

export default function Home({allPostsData}) {
    return (
        <>
            <Head>
                <title>关于我 - {rootTitle}</title>
            </Head>
            <Layout>
                <section>
                    关于我
                </section>
            </Layout>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const allPostsData = getSortedPostsData()
    return {
        props: {allPostsData}
    }
}
