import { CaretDownOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { GetStaticProps } from 'next';
import Head from "next/head";
import Link from 'next/link';
import Layout from "../components/layout";
import PostsBrief from '../components/posts-brief';
import { CompletePosts, getAllPostsData } from '../lib/util';
import { rootTitle } from "./_document";
import styles from "./archive.module.scss"

export default function ArchivePage({ archivess }: { archivess: Archivess }) {
  return (
    <>
      <Head>
        <title>{`归档 | ${rootTitle}`}</title>
      </Head>
      <Layout>
        <div className="flex pt-8 px-12">
          {/* 时间线 - 主 */}
          <div className="w-0">
            <div className="h-full w-0.5 bg-blue-500 ml-32">
              <div className="text-blue-500 w-0">
                <div className="bg-gray-50 -ml-4 w-[35px] h-[35px]">
                  <FieldTimeOutlined className='text-4xl' />
                </div>
              </div>
            </div>
          </div>
          <div className="w-0 grow">
            {Object.keys(archivess).sort((v1, v2) => v2.localeCompare(v1)).map(year => {
              const yo = archivess[year];

              return (
                // 年
                <section key={year} className='py-2'>
                  <div className="text-blue-500 flex items-center">
                    <span className='text-2xl'>{year}年</span>
                    <CaretDownOutlined className='text-xl pl-2' />
                  </div>
                  <div>
                    {/* 月 */}
                    {Object.keys(yo).sort((v1, v2) => v2.localeCompare(v1)).map(month => {
                      const posts = yo[month];
                      return (
                        <div key={month} className='flex pt-4'>
                          <div className="w-32 text-xl py-2 pl-12 text-gray-600">{Number(month)}月</div>
                          <div className="pl-10 w-0 grow">
                            {posts.map((post, i) => (
                              <div key={i} className='py-2'>
                                {/* 时间线 - 子 */}
                                <div className="absolute -ml-12 flex justify-center">
                                  <div className='h-8 bg-gray-50 flex items-center justify-center'>
                                    <div className="w-5 h-5 bg-green-500 flex items-center justify-center rounded-full">
                                      <div className="w-4 h-4 bg-gray-50 flex items-center justify-center rounded-full">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="text-xl">{post.title}</div>
                                <div className="text-base">{post.description}</div> */}
                                {/*标题*/}
                                <div className="text-lg text-gray-600 dark:text-gray-400 truncate">
                                  <Link href={`/${post.pt}`}>
                                    <a className="font-bold">{post.title}</a>
                                  </Link>
                                </div>
                                {/*摘要*/}
                                <div className={`${styles.content} break-all text-justify pt-2 leading-normal text-sm text-gray-500 dark:text-gray-500`}
                                  dangerouslySetInnerHTML={{ __html: post.description }}
                                />
                                {/*文章其他信息*/}
                                <PostsBrief author={post.author} date={post.createTime} updated={post.updateTime}
                                  className="text-xs text-gray-500 flex py-1"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // 获取全部文章
  const latestPosts: CompletePosts[] = getAllPostsData();

  const archivess: Archivess = {};
  for (const post of latestPosts) {
    try {
      // 提取年月
      const createData = post.date.split("-");
      const year = createData[0];
      const month = createData[1];

      let yearData = archivess[year];
      if (!yearData) {
        archivess[year] = yearData = {};
      }
      let monthData = yearData[month];
      if (!monthData) {
        yearData[month] = monthData = [];
      }

      monthData.push({
        title: post.title,
        description: post.description || null,
        pt: post.pt as string,
        author: post.author || null,
        createTime: post.date || null,
        updateTime: post.updated || null
      });
    } catch (e) {
      console.warn('处理文章失败：', post);
    }
  }

  return {
    // 注意：这里返回的数据必须要能被序列化为Json
    props: { archivess }
  }
}

interface Archivess {
  [year: string]: {
    [month: string]: Array<{
      title: string;
      description?: string;
      pt: string;
      author?: string;
      createTime: string;
      updateTime?: string;
    }>
  }
}

