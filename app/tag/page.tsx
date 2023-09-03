import PostsBrief from "@/components/posts-brief";
import { CompletePosts, getAllPostsData } from "@/lib/util";
import { TagOutlined } from '@ant-design/icons';
import { Tag } from "antd";
import Link from "next/link";
import Widget from "../widget";
import styles from "./page.module.scss";
import Slugger from 'github-slugger';

const slugs = new Slugger();

export default function TagPage() {
  const posts = getAllPostsData();
  // 根据标签进行分类
  const tags: { [key: string]: CompletePosts[] } = {};
  for (const post of posts) {
    for (const tag of post.tags) {
      if (tags[tag]) {
        tags[tag].push(post);
      } else {
        tags[tag] = [post];
      }
    }
  }
  const sortTags: string[][] = Object.keys(tags)
    // 升序排序
    .sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()))
    // 生成标签对应的URL编码字符串，结果为二元组
    .map(tag => [tag, slugs.slug(tag)]);

  return (
    <div className="flex justify-between py-2 sm:py-3 px-0 sm:px-3 text-gray-800 dark:text-gray-300">
      {/*左边: 主内容区*/}
      <div className="flex-grow w-0">
        <div className='flex flex-wrap p-2 justify-around'>
          {sortTags.map(([tag, tagSlug]) => (
            <div key={tag} className='pt-4'>
              <a href={`#${tagSlug}`}>
                <Tag color={getColor(tag)}>
                  <span className="text-lg">{tag}{tags[tag].length > 1 ? `（${tags[tag].length}）` : ''}</span>
                </Tag>
              </a>
            </div>
          ))}
        </div>
        <ul className="pt-8">
          {sortTags.map(([tag, tagSlug]) => (
            <li key={tag}>
              <h1 id={tagSlug} className="opacity-60">
                <span className="text-2xl pr-2"><TagOutlined /></span>
                <span className="text-3xl">{tag}</span>
              </h1>
              <div className="pl-8 pb-4">
                {tags[tag].map((post, i) => (
                  <div key={i} className='py-2'>
                    {/*标题*/}
                    <div className="text-base lg:text-lg text-gray-600 dark:text-gray-400 truncate">
                      <Link href={`/${post.pt}`} className="font-bold">{post.title}</Link>
                    </div>
                    {/*摘要*/}
                    <div className={`${styles.content} break-all text-justify pt-1 leading-normal text-sm text-gray-500 dark:text-gray-500`}>
                      {post.description && <span dangerouslySetInnerHTML={{ __html: post.description }} />}
                    </div>
                    {/*文章其他信息*/}
                    <PostsBrief author={post.author} date={post.date} updated={post.updated}
                      className="text-xs text-gray-500 flex py-1"
                    />
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/*右边: 小组件,当屏幕宽度太小时换到“小屏幕菜单区”显示*/}
      <div className="flex-shrink-0 sm:w-64 md:w-72 lg:w-80 xl:w-96 hidden sm:block pl-2">
        <Widget />
      </div>
    </div>
  )
}

const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
/** 根据字符串计算一个唯一确定的颜色 */
function getColor(v: string): string {
  let hashCode: number = 0;
  for (let i = 0; i < v.length; i++) {
    hashCode += v.charCodeAt(i);
  }
  return colors[hashCode % colors.length];
}
