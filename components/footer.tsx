/**
 * 页脚.
 */
export default function Footer() {
  return (
    <div className="flex-none relative z-50 leading-3 ring-1 ring-gray-900 ring-opacity-5 shadow-sm py-6 text-xs sm:text-sm text-gray-400">
      <div className="flex justify-center">
        <div className="px-2">
          <span>© 2020-{new Date().getFullYear()} All Right Reserved <a target="_black" href="https://beian.miit.gov.cn/">滇ICP备17005647号-2</a></span>
        </div>
        <div className="px-2">
          <a href="/feed.xml" target="_blank">RSS</a>
        </div>
      </div>
    </div>
  )
}
