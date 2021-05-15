import React from "react";
import styles from "./carousel.module.scss"

interface Props {
    /**
     * 轮播图。
     */
    listImg: string[],
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
    constructor(props) {
        super(props);
        this.state = {showIndex: 0}
    }

    interval: NodeJS.Timeout

    // 下一页
    nextChange = () => {
        if (this.state.showIndex === this.props.listImg.length - 1) {
            this.setState({showIndex: 0})
        } else {
            this.setState({showIndex: this.state.showIndex + 1})
        }
    }
    // 上一页
    prevChange = () => {
        if (this.state.showIndex === 0) {
            this.setState({showIndex: this.props.listImg.length - 1})
        } else {
            this.setState({showIndex: this.state.showIndex - 1})
        }
    }
    // 跳转到指定索引的轮播页
    indexChange = index => this.setState({showIndex: index});
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
        const {listImg} = this.props;
        const {showIndex} = this.state;

        return (
            <div className="overflow-hidden aspect-w-3 aspect-h-1">
                <div className="block h-full w-full" onMouseOver={this.stopCarousel} onMouseOut={this.startCarousel}>
                    <div className={`${styles.carousel} relative flex justify-center bg-gray-300 rounded-sm w-full h-full`}>
                        {/*轮播图*/}
                        <ul className="flex-1">
                            {listImg.map((img, i) => (
                                <li key={i} className={`absolute bg-pink-200 w-full h-full ${styles.item} ${showIndex === i ? styles.show : styles.hidden}`}>
                                    <img src={img} className="object-cover w-full h-full" alt="轮播图"/>
                                </li>
                            ))}
                        </ul>
                        {/*小圆点*/}
                        <ul className={styles.bullet}>
                            {listImg.map((img, i) => (
                                <li key={i}
                                    className={`${showIndex === i ? 'bg-blue-500' : 'bg-gray-500 bg-opacity-30'}`}
                                    onClick={() => this.indexChange(i)}
                                />
                            ))}
                        </ul>
                        {/*切换按钮*/}
                        <div className={`${styles.customer} ${styles.prev}`}>
                            <div onClick={this.prevChange}/>
                        </div>
                        <div className={`${styles.customer} ${styles.next}`}>
                            <div onClick={this.nextChange}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
