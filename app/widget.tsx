import { getLatestPostsTitle } from "@/lib/util";
import { Heading } from "@vcarl/remark-headings";
import Slugger from 'github-slugger';
import Link from "next/link";

// 友链
const links = [
  { name: 'React', url: 'https://react.dev' },
  { name: 'Vue', url: 'https://vuejs.org' },
  // {name: 'Angular', url: 'https://angular.cn/'},
  { name: 'Next.js', url: 'https://nextjs.org' },
  { name: 'UmiJS', url: 'https://umijs.org' },
  { name: 'Nuxt.js', url: 'https://nuxt.com' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
  { name: 'CSS Loaders', url: 'https://css-loaders.com' },
  { name: 'Ant Design', url: 'https://ant.design' },
  { name: '中文文案排版指北', url: 'https://github.com/mzlogin/chinese-copywriting-guidelines' },
  { name: 'GFM 规范', url: 'https://github.github.com/gfm/' },
  { name: '阿里巴巴矢量图标库', url: 'https://www.iconfont.cn' },
  { name: '叶子个人博客', url: 'https://www.yezismile.com' },
  { name: '在线工具', url: 'https://util.laeni.cn' },
];

// 获取最新文章标题（最新动态）
const latestPosts = getLatestPostsTitle();

/** 右侧小组件 */
export default function Widget({
  heading
}: {
  /** 目录 */
  heading?: Heading[];
}) {
  const headTree = heading && toTree(heading);

  return (
    <>
      {/*最新动态(最多展示前10个)*/}
      {latestPosts?.length > 0 && (
        <div>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl text-gray-600 dark:text-gray-400 py-2">最新动态</h2>
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-400 pb-2">
            {latestPosts.map(value => (
              <li key={value.path} className="truncate py-2">
                <Link href={`/${value.path}`}>
                  <svg className="icon text-gray-500 dark:text-gray-400" aria-hidden="true">
                    <use xlinkHref="#icon-wenzhang" />
                  </svg>
                  <span className="pl-1">{value.title}</span>
                </Link>
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
}

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
  let currentNode: HeadTreeItem = { depth: 1 };
  for (const item of headingTmp) {
    // 一级标题
    if (item.depth === 1) {
      const treeItem: HeadTreeItem = { ...item };
      headTree.push(treeItem);
      currentNode = treeItem;
      continue;
    }

    // 与上一个同级
    if (item.depth === currentNode.depth) {
      const treeItem: HeadTreeItem = { ...item, prent: currentNode.prent };
      currentNode.prent?.children?.push(treeItem);
      currentNode = treeItem;
      continue;
    }

    // 向下跳级
    if (item.depth > currentNode.depth) {
      while (currentNode.depth < item.depth) {
        if (!currentNode.children) {
          currentNode.children = [];
        }
        let treeItem: HeadTreeItem;
        if (currentNode.depth === item.depth - 1) {
          treeItem = { ...item, depth: currentNode.depth + 1, prent: currentNode, children: [] };
        } else {
          treeItem = { depth: currentNode.depth + 1, prent: currentNode, children: [] };
        }
        currentNode.children.push(treeItem);
        currentNode = treeItem;
      }
    }
    // 向上跳级
    else {
      while (currentNode.depth !== item.depth) {
        currentNode.prent && (currentNode = currentNode.prent);
      }
      const treeItem: HeadTreeItem = { ...item, prent: currentNode.prent };
      currentNode.prent?.children?.push(treeItem);
      currentNode = treeItem;
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
          <a href={`#${slugs.slug(item.value as string)}`}>
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
