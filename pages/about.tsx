import Head from 'next/head'
import Layout from '../components/layout'
import { rootTitle } from "./_document";
import React from "react";

export default function Home({ }) {
  return (
    <>
      <Head>
        <title>关于我 | {rootTitle}</title>
      </Head>
      <Layout>
        <section>
          关于我
        </section>
      </Layout>
    </>
  )
}
