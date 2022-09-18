import Link from "next/link";
import { NextRouter, useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import styles from "../components/header.module.scss";
import ShowSize from "./show-size";

interface Props {
  /**
   * 小部件，当宽度很小时，右边的部分小部件将被隐藏，这时候会放在顶部下拉列表中显示。
   */
  widget?: ReactElement
}

/**
 * 页头.
 */
export default function Header({ widget }: Props) {
  const router: NextRouter = useRouter();
  /**
   * 顶部下拉列表展开状态.
   */
  const [click, setClick] = useState<boolean>(false);

  // 设置下拉展开状态
  const setDropDownState = (dropDownState: boolean) => {
    setClick(dropDownState);
    if (document) {
      const html = document.getElementsByTagName("html")[0];
      if (dropDownState) {
        html.classList.add('global-scrollblock')
      } else {
        html.classList.remove('global-scrollblock')
      }
    }
  }

  // 更改下拉的状态
  const negateDropDownState = () => setDropDownState(!click);

  // 关闭下拉
  const closeDropDown = () => setDropDownState(false)

  // 切换夜间模式
  /*darkModeSwitch = () => {
    if (document.querySelector('html').classList.contains('dark')) {
      document.querySelector('html').classList.remove('dark')
    } else {
      document.querySelector('html').classList.add('dark')
    }
  }*/

  // 进度条
  useEffect(() => {
    // 只要导航发生变化就自动收起顶部下拉
    router?.events?.on('routeChangeComplete', closeDropDown);
    return () => router?.events?.off('routeChangeComplete', closeDropDown)
  }, []);

  const menus = [
    /* // { name: "文章", path: "/posts" }, */
    // { name: "随笔", path: "/essay" },
    // { name: "学习", path: "/learn" },
    // { name: "笔记", path: "/note" },
    // { name: "摄影", path: "/photo" },
    /* // { name: "美图", path: "/picture" }, */
    { name: "归档", path: "/archive" },
    { name: "关于", path: "/about" },
  ]

  return (
    <div className="flex-none relative z-50">
      <div className="leading-3 bg-white dark:bg-black ring-1 ring-gray-900 ring-opacity-5 shadow-sm py-2">
        <div className="md:container md:mx-auto h-12 lg:h-14 flex justify-between items-center px-3">
          {/* 显示屏幕尺寸 - 仅开发环境生效 */}
          <ShowSize />
          {/*左边*/}
          <div className="flex items-center">
            <Link href="/">
              <a><img src="/img/logo.svg" alt="logo" width="40" height="40" /></a>
            </Link>
            <ul className="hidden sm:flex pl-6 lg:pl-10 xl:pl-12 text-base lg:text-lg">
              {menus.map((menu, i) => (
                <li key={i} className="px-1.5 lg:px-5 xl:px-7">
                  <Link href={menu.path}>
                    <span className={router.asPath.startsWith(menu.path) ? styles.select : ''}>{menu.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {/*<button onClick={darkModeSwitch}>夜间模式切换</button>*/}
          </div>
          {/*右边*/}
          <div className="flex items-center">
            {/* github */}
            <div className="p-1 mx-1">
              <a href="https://github.com/laeni/blog" target="_blank">
                <svg className="icon text-gray-500 dark:text-gray-400 text-base lg:text-lg" aria-hidden="true">
                  <use xlinkHref="#icon-github" />
                </svg>
              </a>
            </div>
            {/*手机版显示部分*/}
            <div className="block sm:hidden">
              {/*菜单按钮*/}
              <div className={`${styles.sm_menu} w-5 h-4 flex flex-wrap content-between`}
                onClick={negateDropDownState}>
                <div className={`bg-gray-500 dark:bg-gray-400 ${click ? styles.div1 : ''}`} />
                <div className={`bg-gray-500 dark:bg-gray-400 ${click ? styles.div2 : ''}`} />
                <div className={`bg-gray-500 dark:bg-gray-400 ${click ? styles.div3 : ''}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*小屏幕菜单区*/}
      {click && (
        <div className="relative block sm:hidden">
          <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900 overflow-auto" style={{ height: 'calc(100vh - 3rem)', width: '100vw' }}>
            {/*菜单*/}
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
              <ul>
                {menus.map((menu, i, array) => (
                  <Link key={menu.name} href={menu.path}>
                    <li key={menu.path} className={`px-5 py-2 ${i + 1 !== array.length ? 'border-b border-gray-200' : ''} ${router.asPath.startsWith(menu.path) ? styles.select : ''}`}>
                      {menu.name}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
            {/*其他小组件*/}
            <div className="px-3 pb-2 pt-4">
              {widget}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
