import Header from './header'
import Footer from "./footer";
import React, {PropsWithChildren, ReactElement} from "react";

interface Props {
    // 轮播
    carousel?: ReactElement
}

// 小组件渲染
const widget = (
    <div className="bg-red-400">
        <div>最新文章</div>
        <div>友情链接</div>
    </div>
)

export default function Layout({ children, carousel } : PropsWithChildren<Props>) {

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
                        <div className="flex-shrink-0 sm:w-64 md:w-72 lg:w-80 xl:w-96 hidden sm:block pl-2">
                            {widget}
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    )
}
