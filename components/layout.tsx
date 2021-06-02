import Header from './header'
import Footer from "./footer";
import React, {PropsWithChildren, ReactElement} from "react";
import Link from 'next/link';

interface Props {
    // 轮播
    carousel?: ReactElement;
    // 最新帖子标题
    latestPosts?: {title: string; path: string}[];
}

// 友链
const links = [
    {name: 'React', url: 'https://zh-hans.reactjs.org/'},
    // {name: 'Vue', url: 'https://v3.vuejs.org/'},
    // {name: 'Angular', url: 'https://angular.cn/'},
    {name: 'Next.js', url: 'https://nextjs.org/'},
    {name: 'UmiJS', url: 'https://umijs.org/zh-CN'},
    // {name: 'Nuxt.js', url: 'https://nuxtjs.org/'},
    {name: 'Tailwind CSS', url: 'https://tailwindcss.com/'},
    {name: 'Vercel', url: 'https://vercel.com/'},
    {name: 'Ant Design', url: 'https://ant.design/'},
    {name: '阿里巴巴矢量图标库', url: 'https://www.iconfont.cn/'},
    {name: '叶子个人博客', url: 'https://www.yezismile.com/'},
];

export default function Layout({ children, carousel, latestPosts } : PropsWithChildren<Props>) {
    // 小组件渲染
    const widget = (
        <>
            {/*最新文章(最多展示前10篇文章)*/}
            {latestPosts?.length > 0 && (
                <div>
                    <div className="border-b">
                        <h2 className="text-xl text-gray-600 py-2">最新文章</h2>
                    </div>
                    <ul className="text-sm text-gray-600 pb-2">
                        {latestPosts.map(value => (
                            <li key={value.path} className="truncate py-2">
                                <Link href={`/${value.path}`}><a>
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref="#icon-wenzhang"/>
                                    </svg>
                                    <span className="pl-1">{value.title}</span>
                                </a></Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/*友情链接*/}
            <div>
                <div className="border-b">
                    <h2 className="text-xl text-gray-600 pt-6 pb-2">友情链接</h2>
                </div>
                <ul className="flex flex-wrap justify-evenly text-sm text-gray-600 pb-2">
                    {links.map(value => (
                        <li key={value.name} className="py-2 px-1">
                            <a href={value.url} target="_blank">
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#icon-biaoqian"/>
                                </svg>
                                <span className="pl-1">{value.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )

    return (
        <>
            <Header widget={widget}/>
            <main className="bg-gray-100">
                <div className="md:container mx-auto">
                    {/* 可选的轮播区域 */}
                    {carousel && (
                        <div className="m-0 sm:px-3 sm:pt-3">{carousel}</div>
                    )}

                    <div className="flex justify-between py-2 sm:py-3 px-0 sm:px-3 text-gray-800">
                        {/*左边: 主内容区*/}
                        <div className="flex-grow w-0">
                            {children}
                        </div>
                        {/*右边: 小组件,当屏幕宽度太小时换到“小屏幕菜单区”显示*/}
                        <div className="flex-shrink-0 overflow-hidden sm:w-64 md:w-72 lg:w-80 xl:w-96 hidden sm:block pl-2">
                            {widget}
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    )
}
