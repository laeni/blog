import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { ParsedUrlQuery } from "querystring";
import RSS from 'rss'
import { rootTitle } from "../pages/_document";
import { micromark } from 'micromark'


/**
 * 文章元数据.
 */
export interface Matter {
  /**
   * 标题.
   */
  title: string;
  /**
   * 文章说明.
   */
  description?: string;
  /**
   * 作者.
   */
  author?: string;
  /**
   * 标签.
   * 字符串时以 ',' 分隔
   */
  tags?: string | string[];
  /**
   * 创建时间.
   */
  date?: string;
  /**
   * 更新时间.
   */
  updated?: string;

  /**
   * 开启文章的评论功能.
   * 默认: true
   * TODO 暂未实现
   */
  comments?: string;

  /**
   * 是否隐藏.
   * 防止部分还为完成的文章不小心提交后对外展示.
   * 默认: false
   */
  hide?: boolean;
}

export interface PostsMatter extends Matter {
  /**
   * 文章对应的路径.
   */
  pt: string | string[]
}

/**
 * 完整文章内容.
 */
export interface CompletePosts extends PostsMatter {
  /**
   * 文章内容.
   */
  content: string;
  /**
   * 文章对应的文件路径,如'about/self.md'.
   */
  fileName: string;
}

// 博客内容所在目录
const contentDir = path.join(process.cwd(), 'content');
// 所有文章路径
let pathList: string[] | null = null;
// 所有文章数据
let posts: CompletePosts[] | null = null;

/** 获取全部文章数据. */
function getAllPostsData(): CompletePosts[] {
  if (posts) {
    return posts;
  }

  // 读取文章路径下的所有文章路径(默认不包含README.md)
  const fileNames = readdirSync(contentDir)
  const allPostsData: CompletePosts[] = fileNames
    // 根据文件名加载并解析文章
    .map(fileName => {
      // Remove ".md" from file name to get pt
      let pt = fileName.replace(/\.md[x]?$/, '');
      // 去除 index 结尾的路径
      if (pt.endsWith('index')) {
        pt = pt.slice(0, pt.length - ('index'.length + 1));
      }

      //读取markdown文件为字符串
      const fileContents = fs.readFileSync(path.join(contentDir, fileName), 'utf8')

      try {
        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);
        // Combine the data with the pt
        return { pt, fileName, ...(matterResult.data as Matter), content: matterResult.content }
      } catch {
        console.warn('解析 matter 出错，将忽略该md文章！path:', path.join(contentDir, fileName));
        return null;
      }
    })
    // 不显示刻意隐藏以及没有标题（没有标题的一般为草稿）的文章
    .filter(it => it && !it.hide && it.title);

  // 如果 description 为空,则尝试获取第一段作为 description
  allPostsData.forEach(value => {
    const { description, content } = value;

    if (!description && content) {
      for (const row of content.split(/\n/)) {
        if (row?.trim()) {
          if (!row.startsWith('#') && row.search(/[*-]{2,}/)) {
            value.description = removeMdSymbol(row.trim());
          }
          break;
        }
      }
    }
  })

  return posts = allPostsData;
}

/** 获取经过排序的首页文章 */
export function getSortedIndexPostsData(): CompletePosts[] {
  return getAllPostsData()
    // 对于首页,只展示有 description 的文章
    .filter(({ description }) => description)
    // 根据修改时间倒序
    .sort((a, b) => a.updated < b.updated ? 1 : -1);
}

/**
 * 最多获取 size 篇最新的文章标题和地址
 * @param size 最多返回的标题数量,默认为10
 */
export function getLatestPostsTitle(size = 10): { title: string; path: string }[] {
  const titles: { title: string; path: string }[] = [];

  const sortByUpdated = getAllPostsData()
    // 时间相同的根据名称进行排序
    .sort((a, b) => a.title < b.title ? -1 : 1)
    // 根据创建时间进行反向排序
    .sort((a, b) => {
      const aDate = a.date || a.updated || '';
      const bDate = b.date || b.updated || '';

      return aDate < bDate ? 1 : -1
    });
  // 筛选10篇
  for (const post of sortByUpdated) {
    if (titles.length < size) {
      // 文章标题,用于导航到该文章
      const postPath = post.pt instanceof Array ? path.join(...post.pt) : post.pt;
      titles.push({
        title: post.title,
        path: postPath
      })
    }
  }

  return titles;
}

/** 获取所有文章的路径. */
export function getAllPostPath(): Array<string | { params: ParsedUrlQuery; locale?: string }> {
  return getAllPostsData().map(data => {
    // 原始文章路径（这里必须返回数组）
    const pt = typeof data.pt === 'string' ? data.pt.split(path.sep) : data.pt;
    return { params: { path: pt } }
  });
}

/**
 * 根据博客id获取博客内容。
 *
 * @param pt 博客文件路径
 */
export async function getPostData(pt: string | string[]): Promise<CompletePosts> {
  // 不包含前缀的路径
  let fullPathPrefix = (pt instanceof Array ? path.join(contentDir, ...pt) : path.join(contentDir, pt));
  // 后缀
  let suffix: '.md' | '.mdx';

  // 需要考虑省略 index 的情况
  if (fs.existsSync(fullPathPrefix + '.md')) {
    suffix = '.md';
  } else if (fs.existsSync(fullPathPrefix + '.mdx')) {
    suffix = '.mdx';
  } else if (fs.existsSync(fullPathPrefix + '/index.md')) {
    suffix = '.md';
    fullPathPrefix += '/index'
  } else if (fs.existsSync(fullPathPrefix + '/index.mdx')) {
    suffix = '.mdx';
    fullPathPrefix += '/index'
  } else {
    throw '无法找' + fullPathPrefix + '对应的源文件';
  }

  const fileContents = fs.readFileSync(fullPathPrefix + suffix, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // 文章路径
  const fileName: string = (pt instanceof Array ? path.join(...pt) : pt) + suffix;

  // Combine the data with the pt and contentHtml
  return { pt, fileName, content: matterResult.content, ...(matterResult.data as Matter) }
}

/**
 * 递归读取所有“.md”后缀的文件路径,路径不包括基本路径.
 * 返回值示例: [ 'posts/test.md', 'posts/test1.md', 'posts/xxx.md' ]
 *
 * @param basePath  基本目录
 * @param childPath 子目录
 * @param ignore    需要排除的文件名
 */
function readdirSync(basePath: string, childPath: string = '', ignore: string[] = ['README.md', 'README.mdx']): string[] {
  if (!childPath && pathList) {
    return pathList;
  }

  const fileNames: string[] = []

  for (const fileName of fs.readdirSync(path.join(basePath, childPath))) {
    const now = path.join(basePath, childPath, fileName);
    if (fs.statSync(now).isDirectory()) {
      fileNames.push(...readdirSync(basePath, path.join(childPath, fileName)))
    } else {
      if ((now.endsWith(".md") || now.endsWith(".mdx")) && !ignore.find(value => value.toUpperCase() === fileName.toUpperCase())) {
        fileNames.push(path.join(childPath, fileName))
      }
    }
  }

  if (!childPath) {
    pathList = fileNames;
  }
  return fileNames
}

/**
 * 去除markdown字符串中的markdown标记.
 */
function removeMdSymbol(txt: string): string {
  return micromark(txt).replace(/<[^>]+>/g, "")
}

/**
 * 生成Rss文件.
 * doc: https://www.npmjs.com/package/rss
 */
export function genRss(matters: PostsMatter[]) {
  const feed = new RSS({ title: rootTitle, site_url: '', feed_url: '/feed.xml', ttl: 30 * 24 * 60 })

  matters.forEach(posts => {
    let tags: string[] = []
    if (posts.tags) {
      if (typeof posts.tags === 'string') {
        tags = posts.tags.split(',').map(s => s.replace(' ', ''))
      } else {
        tags = posts.tags
      }
    }

    feed.item({
      title: posts.title,
      description: posts.description,
      // 这里的pt一定为string
      url: posts.pt as string,
      author: posts.author,
      date: posts.date,
      categories: tags
    })
  })

  // 生成xml文件,默认不缩进,如果需要缩进可以使用选项: feed.xml({ indent: true })
  fs.writeFileSync('./public/feed.xml', feed.xml({ indent: true }))
}
