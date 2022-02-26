import Header from './header'
import Footer from "./footer";
import React, { PropsWithChildren, ReactElement } from "react";
import Link from 'next/link';
import { Heading } from '@vcarl/remark-headings';
import Slugger from 'github-slugger'
import { BackTop, message } from 'antd';
import { BarsOutlined } from '@ant-design/icons';

interface Props {
  // 轮播
  carousel?: ReactElement;
  // 文章标题
  heading?: Heading[];
  // 最新帖子标题
  latestPosts?: { title: string; path: string }[];
}

// 友链
const links = [
  { name: 'React', url: 'https://zh-hans.reactjs.org/' },
  { name: 'Vue', url: 'https://v3.vuejs.org/' },
  // {name: 'Angular', url: 'https://angular.cn/'},
  { name: 'Next.js', url: 'https://nextjs.org/' },
  { name: 'UmiJS', url: 'https://umijs.org/zh-CN' },
  { name: 'Nuxt.js', url: 'https://nuxtjs.org/' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com/' },
  { name: 'Vercel', url: 'https://vercel.com/' },
  { name: 'Ant Design', url: 'https://ant.design/' },
  { name: '阿里巴巴矢量图标库', url: 'https://www.iconfont.cn/' },
  { name: '叶子个人博客', url: 'https://www.yezismile.com/' },
];

interface HeadTreeItem {
  depth: number;
  value?: string;
  children?: HeadTreeItem[];
  prent?: HeadTreeItem;
}

/** 查询最小的标题级数 */
function getMinDepth(heading: Heading[]): number {
  let minDepth = 6;
  for (const it of heading) {
    if (it.depth < minDepth) {
      minDepth = it.depth;
    }
  }
  return minDepth;
}
/** 将标题转换为树形结构 */
function toTree(heading: Heading[]): HeadTreeItem[] {
  // 以最小级标题为参考，将所有标题左移，使最小级标题为一级标题，这样渲染出来的目录应该会相对好看一些
  const lower = getMinDepth(heading) - 1;
  const headingTmp = heading.map(it => ({ ...it, depth: it.depth - lower }));

  const headTree: HeadTreeItem[] = [];
  // 最近添加的一个元素（用于非一级标题转换时使用）
  let recentHeadTreeItem: HeadTreeItem;
  for (const item of headingTmp) {
    // 一级标题
    if (item.depth === 1) {
      const treeItem: HeadTreeItem = { ...item };
      headTree.push(treeItem);
      recentHeadTreeItem = treeItem;
      continue;
    }

    // 考虑一开始就不是一级标题的情况
    if (!recentHeadTreeItem) {
      recentHeadTreeItem = { depth: 1 }
    }

    // 与上一个同级
    if (item.depth === recentHeadTreeItem.depth) {
      const treeItem: HeadTreeItem = { ...item, prent: recentHeadTreeItem.prent };
      recentHeadTreeItem.prent.children.push(treeItem);
      recentHeadTreeItem = treeItem;
      continue;
    }

    // 刚好为上一级标题的直属子标题
    if (item.depth === recentHeadTreeItem.depth + 1) {
      if (!recentHeadTreeItem.children) {
        recentHeadTreeItem.children = [];
      }
      const treeItem: HeadTreeItem = { ...item, prent: recentHeadTreeItem };
      recentHeadTreeItem.children.push(treeItem);
      recentHeadTreeItem = treeItem;
      continue;
    }

    // 向下跳级
    if (item.depth > recentHeadTreeItem.depth) {
      for (let i = item.depth - recentHeadTreeItem.depth - 1; i <= 0; i--) {
        if (!recentHeadTreeItem.children) {
          recentHeadTreeItem.children = [];
        }
        const treeItem: HeadTreeItem = { depth: item.depth - i, prent: recentHeadTreeItem, children: [] };
        recentHeadTreeItem.children.push(treeItem);
        recentHeadTreeItem = treeItem;
      }
      const treeItem: HeadTreeItem = { ...item, prent: recentHeadTreeItem };
      recentHeadTreeItem.children.push(treeItem);
      recentHeadTreeItem = treeItem;
    }
    // 向上跳级
    else {
      const sum = recentHeadTreeItem.depth - item.depth + 1;
      for (let i = 0; i < sum; i++) {
        recentHeadTreeItem = recentHeadTreeItem.prent;
      }
      const treeItem: HeadTreeItem = { ...item, prent: recentHeadTreeItem };
      recentHeadTreeItem.children.push(treeItem);
      recentHeadTreeItem = treeItem;
    }
  }
  return headTree;
}

function toReactNode(tree: HeadTreeItem[]): React.ReactNode {
  // 由于 rehype-slug 插件使用它对标题进行转换，所以这里也要使用，否则会出现部分锚点失效的情况
  const slugs = new Slugger();

  return (
    <ul className="text-sm text-gray-600 dark:text-gray-400">
      {tree.map((item, i) => (
        <li key={i} className="truncate py-1">
          <a href={`#${slugs.slug(item.value)}`}>
            <svg className="icon text-gray-500 dark:text-gray-400" aria-hidden="true">
              <use xlinkHref="#icon-shuqian" />
            </svg>
            <span className="pl-1">{item.value}</span>
          </a>
          <div className="pl-4">
            {item.children && toReactNode(item.children)}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function Layout({ children, carousel, latestPosts, heading }: PropsWithChildren<Props>) {
  const headTree = heading && toTree(heading);

  /** 页面固定的小部件。 */
  const fixedWidgets = () => (
    <>
      {/* 回到顶部 - 所有版本都显示 */}
      <BackTop className='bottom-28 sm:bottom-[50px]' />
      <style>{`@media screen and (max-width: 640px) {.ant-back-top {right: 20px;}}`}</style>

      {/* 目录文章 - 仅仅手机版显示且在文章页显示（有标题时市委文章页面）*/}
      {heading?.length > 0 && (
        <div
          className='block sm:hidden fixed bottom-[50px] right-[20px] sm:right-[60px] md:right-[100px] z-10 bg-[rgba(0,0,0,.45)] w-[40px] h-[40px] text-white text-2xl text-center rounded-full'
          onClick={() => message.warn("手机版目录尚未失效，敬请期待！")}
        >
          <BarsOutlined />
        </div>
      )}
    </>
  )

  // 小组件渲染
  const widget: ReactElement = (
    <>
      {/*最新文章(最多展示前10篇文章)*/}
      {latestPosts?.length > 0 && (
        <div>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl text-gray-600 dark:text-gray-400 py-2">最新文章</h2>
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-400 pb-2">
            {latestPosts.map(value => (
              <li key={value.path} className="truncate py-2">
                <Link href={`/${value.path}`}><a>
                  <svg className="icon text-gray-500 dark:text-gray-400" aria-hidden="true">
                    <use xlinkHref="#icon-wenzhang" />
                  </svg>
                  <span className="pl-1">{value.title}</span>
                </a></Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className='relative sm:sticky sm:top-0'>
        {/* 目录(不在头部导航中显示) */}
        {headTree && (
          <div className='hidden sm:block'>
            <div className="border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl text-gray-600 dark:text-gray-400 pt-6 pb-2">目录</h2>
            </div>
            <div className='min-h-[5em] max-h-[calc(100vh-18em)] overflow-hidden hover:overflow-y-auto'>
              {toReactNode(headTree)}
            </div>
          </div>
        )}
        {/*友情链接*/}
        <div>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl text-gray-600 dark:text-gray-400 pt-6 pb-2">友情链接</h2>
          </div>
          <ul className="flex flex-wrap justify-evenly text-sm text-gray-600 dark:text-gray-400 pb-2">
            {links.map(value => (
              <li key={value.name} className="truncate py-2 px-1">
                <a href={value.url} target="_blank">
                  <svg className="icon text-gray-500 dark:text-gray-400" aria-hidden="true">
                    <use xlinkHref="#icon-youqinglianjie" />
                  </svg>
                  <span className="pl-1">{value.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* 页面固定的小部件 */}
      {fixedWidgets()}

      <div className="min-h-screen flex flex-col justify-between">
        <div className="w-full">
          <Header widget={widget} />
          <div className="md:container mx-auto">
            {/* 可选的轮播区域 */}
            {carousel && (
              <div className="m-0 sm:px-3 sm:pt-3">{carousel}</div>
            )}

            <div className="flex justify-between py-2 sm:py-3 px-0 sm:px-3 text-gray-800 dark:text-gray-300">
              {/*左边: 主内容区*/}
              <div className="flex-grow w-0">
                {children}
              </div>
              {/*右边: 小组件,当屏幕宽度太小时换到“小屏幕菜单区”显示*/}
              <div className="flex-shrink-0 sm:w-64 md:w-72 lg:w-80 xl:w-96 hidden sm:block pl-2">
                {widget}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
