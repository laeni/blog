import Link from 'next/link'

/**
 * 页脚.
 */
export default function Footer() {
    return (
        <div className="bg-gray-900 text-gray-300">
            <div className="px-2 py-2">
                <div className="text-center text-sm sm:text-base py-2">
                    <Link href="/about/self">
                        <a>Laeni</a>
                    </Link>
                </div>
                {/*<div className="text-center text-xs sm:text-sm">
                    <span>主要技术栈: </span>
                    <a target="_black" href="https://nextjs.org/">next</a>
                    <span> & </span>
                    <a target="_black" href="https://nextjs.org/">tailwindcss</a>
                </div>*/}
            </div>
            <div className="text-center px-2 py-3 border-t border-gray-600 text-xs sm:text-sm">
                <span>© 2020-{new Date().getFullYear()} All Right Reserved <a target="_black" href="https://beian.miit.gov.cn/">滇ICP备17005647号-2</a></span>
            </div>
        </div>
    )
}
