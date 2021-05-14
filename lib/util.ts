import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import {ParsedUrlQuery} from "querystring";
import RSS from 'rss'
import {rootTitle} from "../pages/_document";

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
}

export interface PostsMatter extends Matter {
    /**
     * 文章对应的路径.
     */
    pt: string | string[]
}

/**
 * 完整的文章内容。
 */
export interface PostsContent extends PostsMatter {
    /**
     * 文章内容。
     */
    contentHtml: string
}

// 博客内容目录
const contentDir = path.join(process.cwd(), 'content')

export function getSortedPostsData(): PostsMatter[] {
    const fileNames = readdirSync(contentDir)

    const allPostsData: PostsMatter[] = fileNames.map(fileName => {
        // Remove ".md" from file name to get pt
        const pt = fileName.replace(/\.md$/, '')

        //读取markdown文件为字符串
        const fileContents = fs.readFileSync(path.join(contentDir, fileName), 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Combine the data with the pt
        return { pt, ...(matterResult.data as Matter) }
    })

    // 根据创建时间排序
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

/**
 * 获取所有文章的路径.
 */
export function getAllPostIds(): Array<string | { params: ParsedUrlQuery; locale?: string }> {
    const fileNames = readdirSync(contentDir)
    return fileNames.map(fileName => {
        return {
            params: {
                path: fileName.replace(/\.md$/, '').split(path.sep)
            }
        }
    })
}

/**
 * 根据博客id获取博客内容。
 *
 * @param pt 博客文件路径
 */
export async function getPostData(pt: string | string[]): Promise<PostsContent> {
    const fullPath = (pt instanceof Array ? path.join(contentDir, ...pt) : path.join(contentDir, pt)) + '.md'

    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    // Combine the data with the pt and contentHtml
    return { pt, contentHtml, ...(matterResult.data as Matter) }
}

/**
 * 递归读取所有“.md”后缀的文件路径,路径不包括基本路径.
 * 返回值示例: [ 'posts/test.md', 'posts/test1.md', 'posts/xxx.md' ]
 *
 * @param basePath  基本目录
 * @param childPath 子目录
 * @param ignore    需要排除的文件名
 */
function readdirSync(basePath: string, childPath: string = '', ignore: string[] = ['README.md']): string[] {
    const fileNames: string[] = []

    for (const fileName of fs.readdirSync(path.join(basePath, childPath))) {
        const now = path.join(basePath, childPath, fileName);
        if (fs.statSync(now).isDirectory()) {
            fileNames.push(...readdirSync(basePath, path.join(childPath, fileName)))
        } else {
            if (now.endsWith(".md") && !ignore.find(value => value.toUpperCase() === fileName.toUpperCase())) {
                fileNames.push(path.join(childPath, fileName))
            }
        }
    }

    return fileNames
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
            url: posts.pt,
            author: posts.author,
            date: posts.date,
            categories: tags
        })
    })

    // 生成xml文件,默认不缩进,如果需要缩进可以使用选项: feed.xml({ indent: true })
    fs.writeFileSync('./public/feed.xml', feed.xml({ indent: true }))
}
