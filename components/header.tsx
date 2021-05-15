import Link from "next/link";
import styles from "../components/header.module.scss"
import React, {ReactDOM} from 'react';
import { withRouter, NextRouter } from 'next/router'

interface Props {
    router: NextRouter
    widget?: ReactDOM
}

interface State {
    click: boolean
}

/**
 * 页头.
 */
export default withRouter(class Header extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = { click: false };
    }

    stateChange = () => {
        const click = !this.state.click;
        this.setState({ click });
        if (document) {
            const html = document.getElementsByTagName("html")[0];
            if (click) {
                html.classList.add('global-scrollblock')
            } else {
                html.classList.remove('global-scrollblock')
            }
        }
    }

    render() {
        const { click } = this.state;
        const { router, widget } = this.props;

        const menus = [
            { name: "文章", path: "/posts" },
            { name: "随笔", path: "/essay" },
            { name: "学习", path: "/learn" },
            { name: "编程", path: "/program" },
            // { name: "摄影", path: "/photo" },
            { name: "美图", path: "/picture" },
            { name: "归档", path: "/archive" },
            { name: "关于", path: "/about" },
        ]

        return (
            <div className="bg-gray-900 text-gray-300">
                <div className="md:container md:mx-auto h-12 lg:h-14 flex justify-between items-center px-3">
                    {/*左边*/}
                    <div className="flex items-center">
                        <Link href="/">
                            <a><img src="/img/logo.svg" alt="logo" width="40" height="40"/></a>
                        </Link>
                        <ul className="hidden sm:flex pl-6 lg:pl-10 xl:pl-12">
                            {menus.map((menu, i) => (
                                <li key={i} className="px-1.5 lg:px-5 xl:px-7">
                                    <a href={menu.path} className={router.asPath.startsWith(menu.path) ? styles.select : ''}>{menu.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/*右边*/}
                    <div>
                        {/*手机版显示部分*/}
                        <div className="block sm:hidden">
                            {/*菜单按钮*/}
                            <div className={`${styles.sm_menu} w-5 h-4 flex flex-wrap content-between`} onClick={this.stateChange}>
                                <div className={click ? styles.div1 : ''}/>
                                <div className={click ? styles.div2 : ''}/>
                                <div className={click ? styles.div3 : ''}/>
                            </div>
                        </div>
                    </div>
                </div>
                {/*小屏幕菜单区*/}
                {click && (
                    <div className="relative block sm:hidden z-20">
                        <div className="absolute inset-0 bg-gray-200 overflow-auto" style={{height: 'calc(100vh - 3rem)', width: '100vw'}}>
                            <div className="bg-gray-800">
                                {/*菜单*/}
                                <ol>
                                    {menus.map((menu, i, array) => (
                                        <Link key={menu.name} href={menu.path}>
                                            <li key={menu.path} className={`px-5 py-3 ${i+1 !== array.length ? 'border-b border-gray-600' : ''} ${router.asPath.startsWith(menu.path) ? styles.select : ''}`}>
                                                {menu.name}
                                            </li>
                                        </Link>
                                    ))}
                                </ol>
                                {/*其他小组件*/}
                                {widget}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }
})
