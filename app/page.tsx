import { getSortedIndexPostsData } from '@/lib/util';
import Link from "next/link";
import Carousel from "../components/carousel";
import PostsBrief from '../components/posts-brief';
import { rootTitle } from './layout';
import styles from "./page.module.scss";
import Widget from './widget';
import { Metadata } from 'next';

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

// 获取所有文章数据
const indexPostsData = getSortedIndexPostsData();

/** @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#static-metadata */
export const metadata: Metadata = { title: rootTitle }

export default function IndexPage() {
  return (
    <>
      {/* 可选的轮播区域 */}
      {carouselData.length > 0 && (
        <div className="m-0 sm:px-3 sm:pt-3">
          <Carousel data={carouselData} />
        </div>
      )}

      <div className="flex justify-between py-2 sm:py-3 px-0 sm:px-3 text-gray-800 dark:text-gray-300">
        {/*左边: 主内容区*/}
        <main className="flex-grow w-0">
          <ul className="pb-2">
            {indexPostsData.map(({ pt, title, author, date, updated, description, content }) => (
              <li key={pt as string} className={`py-3 px-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800`}>
                <article>
                  {/*标题*/}
                  <h3 className="text-lg text-gray-600 dark:text-gray-400 truncate">
                    <Link href={`/${pt}`} className="font-bold">{title}</Link>
                  </h3>
                  {/*摘要*/}
                  <div className={`${styles.content} break-all text-justify pt-2 leading-normal text-sm text-gray-500 dark:text-gray-500`}>
                    {(description || content) && <span dangerouslySetInnerHTML={{ __html: description || content }} />}
                  </div>
                  {/*文章其他信息*/}
                  <PostsBrief author={author} date={date} updated={updated}
                    className="text-xs text-gray-500 flex py-1"
                  />
                </article>
              </li>
            ))}
          </ul>
        </main>
        {/*右边: 小组件,当屏幕宽度太小时换到“小屏幕菜单区”显示*/}
        <div className="flex-shrink-0 sm:w-64 md:w-72 lg:w-80 xl:w-96 hidden sm:block pl-2">
          <Widget />
        </div>
      </div>
    </>
  )
}
