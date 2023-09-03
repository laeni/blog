import { rootTitle } from '@/app/layout';
import { CaretDownOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { Metadata } from 'next';
import Link from 'next/link';
import PostsBrief from '../../components/posts-brief';
import { CompletePosts, getAllPostsData } from '../../lib/util';
import Widget from '../widget';
import styles from "./page.module.scss";

/** @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#static-metadata */
export const metadata: Metadata = { title: `归档 | ${rootTitle}` }

export default async function ArchivePage() {
  const archivess = await getArchivess();
  return (
    <div className="flex justify-between py-2 sm:py-3 px-0 sm:px-3 text-gray-800 dark:text-gray-300">
      {/*左边: 主内容区*/}
      <div className="flex-grow w-0">
        <article>
          <div className="flex pt-8 px-3 lg:px-6 xl:px-8 2xl:px-12">
            {/* 时间线 - 主 */}
            <div className="w-0">
              <div className="h-full w-0.5 bg-blue-500 ml-[92px] lg:ml-28 xl:ml-32">
                <div className="text-blue-500 w-0">
                  <div className="bg-gray-50 dark:bg-gray-900 -ml-2 lg:-ml-[11px] xl:-ml-[14px] w-[23px] lg:w-[26px] xl:w-[33px] h-[23px] lg:h-[26px] xl:h-[33px] mt-1 lg:mt-0">
                    <FieldTimeOutlined className='text-xl lg:text-2xl xl:text-3xl' />
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
                      <span className='text-xl lg:text-2xl'>{year}年</span>
                      <CaretDownOutlined className='text-base lg:text-lg pl-0 xl:pl-1' />
                    </div>
                    <div>
                      {/* 月 */}
                      {Object.keys(yo).sort((v1, v2) => v2.localeCompare(v1)).map(month => {
                        const posts = yo[month];
                        return (
                          <div key={month} className='flex pt-4'>
                            <div className="w-[96px] lg:w-[112px] xl:w-[118px] text-end text-base lg:text-xl py-2 pr-4 text-gray-600">{Number(month)}月</div>
                            <div className="pl-4 lg:pl-6 xl:pl-12 w-0 grow">
                              {posts.map((post, i) => (
                                <div key={i} className='py-2'>
                                  {/* 时间线 - 子 */}
                                  <div className="absolute scale-75 lg:scale-100 -ml-[29px] lg:-ml-[33px] xl:-ml-12 flex justify-center">
                                    <div className='h-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                                      <div className="w-5 h-5 bg-green-500 flex items-center justify-center rounded-full">
                                        <div className="w-4 h-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center rounded-full">
                                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* <div className="text-xl">{post.title}</div>
                              <div className="text-base">{post.description}</div> */}
                                  {/*标题*/}
                                  <div className="text-base lg:text-lg text-gray-600 dark:text-gray-400 truncate">
                                    <Link href={`/${post.pt}`} className="font-bold">{post.title}</Link>
                                  </div>
                                  {/*摘要*/}
                                  <div className={`${styles.content} break-all text-justify pt-1 leading-normal text-sm text-gray-500 dark:text-gray-500`}>
                                    {post.description && <span dangerouslySetInnerHTML={{ __html: post.description }} />}
                                  </div>
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
        </article>
      </div>
      {/*右边: 小组件,当屏幕宽度太小时换到“小屏幕菜单区”显示*/}
      <div className="flex-shrink-0 sm:w-64 md:w-72 lg:w-80 xl:w-96 hidden sm:block pl-2">
        <Widget />
      </div>
    </div>
  )
}

async function getArchivess() {
  // 获取全部文章
  const latestPosts: CompletePosts[] = getAllPostsData();

  const archivess: Archivess = {};
  for (const post of latestPosts) {
    try {
      // 提取年月
      const createData = (post.date as string).split("-");
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
        description: post.description,
        pt: post.pt as string,
        author: post.author,
        createTime: post.date as string,
        updateTime: post.updated
      });
    } catch (e) {
      console.warn('处理文章失败：', post, e);
    }
  }

  return archivess
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
