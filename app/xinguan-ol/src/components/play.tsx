import React from "react"
import { Col, Row, Select } from "antd"
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons"
export interface PlayProps {
    currentDate?: string
    dates: string[]
    onChange?: (date: string) => void
}

export interface PlayState {
    isPlay?: boolean
    currentDate?: string
    options?: any[]
}
export class Play extends React.Component<PlayProps, PlayState> {
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
        const { dates } = this.props
        const { currentDate } = this.state
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
                    }, 1000)
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
                {options && options.length > 0 && <Select disabled={isPlay} value={currentDate} style={{ width: "100%" }} options={options} onChange={this.onChange.bind(this)}>

                </Select>}
            </Col>
            <Col span={8} style={{ height: "100%", paddingLeft: 20 }}>
                <Row align={"middle"} style={{ color: "#1890ff", height: "100%" }} >
                    {isPlay ?
                        <Row style={{ cursor: "pointer" }} onClick={this.onPause.bind(this)}><PauseCircleOutlined style={{ fontSize: 20 }} />暂停</Row> : <Row style={{ cursor: "pointer" }} onClick={this.onPlay.bind(this)}><PlayCircleOutlined style={{ fontSize: 20 }} />播放</Row>}
                </Row>
            </Col>
        </Row>
    }
}