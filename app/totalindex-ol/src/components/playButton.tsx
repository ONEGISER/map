import React from "react"
import { Button, Col, Row, Select } from "antd"
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons"
export interface PlayButtonProps {
    currentYear?: string
    years: string[]
    onChange?: (date: string) => void
    speed?: number
}

export interface PlayButtonState {
    isPlay?: boolean
    currentYear?: string
    options?: any[]
}
export class PlayButton extends React.Component<PlayButtonProps, PlayButtonState> {
    isPlay: boolean = false
    constructor(props: PlayButtonProps) {
        super(props)
        this.state = {
            isPlay: false,
            currentYear: props.currentYear,
            options: this.getOptions(props.years)
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps: Readonly<PlayButtonProps>, nextContext: any): void {
        const { currentYear } = nextProps
        if (currentYear !== this.props.currentYear) {
            this.setState({
                currentYear
            })
        }
    }

    playData() {
        const { years, speed } = this.props
        const { currentYear } = this.state
        const _speed = speed ? speed : 1500
        if (years) {
            let i: number = years.findIndex((date: string) => {
                return date === currentYear
            })
            if (i === years.length - 1) {
                i = 0
            }
            const play = () => {
                if (this.isPlay) {
                    this.setState({ currentYear: years[i] }, () => {
                        this.onDateChange()
                    })
                    setTimeout(() => {
                        i++
                        if (i === years.length) {
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
        if (this.props.onChange && this.state.currentYear) {
            this.props.onChange(this.state.currentYear)
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
            currentYear: value
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

    getOptions(years: string[]) {
        const options: any[] = []
        years.map((date: any) => {
            options.push({ value: date, label: date })
        })
        return options
    }

    render(): React.ReactNode {
        const { options, currentYear, isPlay } = this.state
        return <Row align={"middle"} style={{ width: "100%", height: "100%" }}>
            <Col span={16} style={{ height: "100%" }}>
                {options && options.length > 0 && <Select disabled={isPlay} value={currentYear} style={{ width: "100%" }} options={options} onChange={this.onChange.bind(this)}>

                </Select>}
            </Col>
            <Col span={8} style={{ height: "100%", paddingLeft: 20 }}>
                <Row align={"middle"}  >
                    {isPlay ? <Button icon={<PauseCircleOutlined />} onClick={this.onPause.bind(this)}>暂停</Button> : <Button onClick={this.onPlay.bind(this)} icon={<PlayCircleOutlined />}>动态播放</Button>}
                </Row>
            </Col >
        </Row >
    }
}