'use client'

import React from "react";
import styles from "./carousel.module.scss"
import Link from "next/link";

interface Props {
  /**
   * 轮播图。
   */
  data: Array<{
    img: string,    // 轮博图
    blank?: boolean, // 是否在空白页打开
    url: string     // 点击后跳斩的url
  }>,
}

interface State {
  /**
   * 当前显示的轮播图索引。
   */
  showIndex: number
}

/**
 * 通过逐隐效果实现的轮播组件。
 */
export default class Carousel extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { showIndex: 0 }
  }

  interval: NodeJS.Timeout | undefined

  // 下一页
  nextChange = () => {
    if (this.state.showIndex === this.props.data.length - 1) {
      this.setState({ showIndex: 0 })
    } else {
      this.setState({ showIndex: this.state.showIndex + 1 })
    }
  }
  // 上一页
  prevChange = () => {
    if (this.state.showIndex === 0) {
      this.setState({ showIndex: this.props.data.length - 1 })
    } else {
      this.setState({ showIndex: this.state.showIndex - 1 })
    }
  }
  // 跳转到指定索引的轮播页
  indexChange = (index: number) => this.setState({ showIndex: index });
  // 开启定时轮播
  startCarousel = () => this.interval = setInterval(this.nextChange, 5000);
  // 停止定时轮播
  stopCarousel = () => clearInterval(this.interval);

  componentDidMount() {
    // 开启定时轮播
    this.startCarousel();
  }

  componentWillUnmount() {
    // 停止定时轮播
    this.stopCarousel();
  }

  render() {
    const { data } = this.props;
    const { showIndex } = this.state;

    return (
      <div className="overflow-hidden aspect-w-3 aspect-h-1">
        <div className="block h-full w-full" onMouseOver={this.stopCarousel} onMouseOut={this.startCarousel}>
          <div className={`${styles.carousel} relative flex justify-center bg-gray-300 rounded-sm w-full h-full`}>
            {/*轮播图*/}
            <ul className="flex-1">
              {data.map(({ img, url, blank }, i) => (
                <li key={i} className={`absolute w-full h-full ${styles.item} ${showIndex === i ? styles.show : styles.hidden}`}>
                  {blank ? (
                    <a href={url} target="_blank"><img src={img} className="object-cover w-full h-full" alt="轮播图" /></a>
                  ) : (
                    <Link href={url}>
                      <img src={img} className="object-cover w-full h-full" alt="轮播图" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            {/*小圆点*/}
            <ul className={styles.bullet}>
              {data.map((img, i) => (
                <li key={i}
                  className={`${showIndex === i ? 'bg-blue-500' : 'bg-gray-500 bg-opacity-30'}`}
                  onClick={() => this.indexChange(i)}
                />
              ))}
            </ul>
            {/*切换按钮*/}
            <div className={`${styles.customer} ${styles.prev}`}>
              <div onClick={this.prevChange} />
            </div>
            <div className={`${styles.customer} ${styles.next}`}>
              <div onClick={this.nextChange} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
