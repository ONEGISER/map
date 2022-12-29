import React from "react"
import { Col, Row, Select } from "antd"
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons"

//属性
export interface PlayProps {
    /**当前播放的时间 */
    currentDate?: string
    /**所有要播放的时间 */
    dates: string[]
    /**时间改变的回调 */
    onChange?: (date: string) => void
    /**播放的速度，单位是毫秒 */
    speed?: number
}
//状态
export interface PlayState {
    /**是否播放 */
    isPlay?: boolean
    currentDate?: string
    options?: any[]
}

//时间播放组件
export class Play extends React.Component<PlayProps, PlayState> {
    //存储是否播放
    isPlay: boolean = false
    constructor(props: PlayProps) {
        super(props)
        this.state = {
            isPlay: false,
            currentDate: props.currentDate,
            options: this.getOptions(props.dates)
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps: Readonly<PlayProps>, nextContext: any): void {
        const { currentDate } = nextProps
        if (currentDate !== this.props.currentDate) {
            this.setState({
                currentDate
            })
        }
    }

    playData() {
        const { dates, speed } = this.props
        const { currentDate } = this.state
        const _speed = speed ? speed : 1000
        if (dates) {
            let i: number = dates.findIndex((date: string) => {
                return date === currentDate
            })
            if (i === dates.length - 1) {
                i = 0
            }
            const play = () => {
                if (this.isPlay) {
                    this.setState({ currentDate: dates[i] }, () => {
                        this.onDateChange()
                    })
                    setTimeout(() => {
                        i++
                        if (i === dates.length) {
                            this.isPlay = false
                            this.setState({
                                isPlay: false
                            })
                        } else {
                            play()
                        }
                    }, _speed)
                }
            }
            play()
        }
    }

    onDateChange() {
        if (this.props.onChange && this.state.currentDate) {
            this.props.onChange(this.state.currentDate)
        }
    }


    onPause() {
        this.isPlay = false
        this.setState({
            isPlay: false
        })
    }


    onChange(value: string) {
        this.setState({
            currentDate: value
        }, () => {
            this.onDateChange()
        })
    }


    onPlay() {
        this.isPlay = true
        this.setState({ isPlay: true }, () => {
            this.playData()
        })
    }

    getOptions(dates: string[]) {
        //构造时间选择器所需要的数据
        const options: any[] = []
        dates.map((date: any) => {
            options.push({ value: date, label: date })
        })
        return options
    }

    render(): React.ReactNode {
        const { options, currentDate, isPlay } = this.state
        return <Row align={"middle"} style={{ width: "100%", height: "100%" }}>
            <Col span={16} style={{ height: "100%" }}>
                { /**时间选择器 */}
                {options && options.length > 0 && <Select disabled={isPlay} value={currentDate} style={{ width: "100%" }} options={options} onChange={this.onChange.bind(this)}>

                </Select>}
            </Col>
            <Col span={8} style={{ height: "100%", paddingLeft: 20 }}>
                {/* 播放按钮 */}
                <Row align={"middle"} style={{ color: "#1890ff", height: "100%" }} >
                    {isPlay ?
                        <Row style={{ cursor: "pointer" }} onClick={this.onPause.bind(this)}><PauseCircleOutlined style={{ fontSize: 20 }} />暂停</Row> : <Row style={{ cursor: "pointer" }} onClick={this.onPlay.bind(this)}><PlayCircleOutlined style={{ fontSize: 20 }} />播放</Row>}
                </Row>
            </Col>
        </Row>
    }
}