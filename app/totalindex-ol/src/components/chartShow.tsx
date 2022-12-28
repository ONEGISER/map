import * as  echarts from "echarts"
import React from "react"
export interface ChartProps {
    color?: string
    name?: string
    time?: string
    data?: any
    yAxisDatas?: string[]
}

export interface ChartState {
    data: any
    time?: string
    yAxisDatas?: string[]
}
export class ChartShow extends React.Component<ChartProps, ChartState> {
    ref: any
    myChart: any
    constructor(props: ChartProps) {
        super(props)
        this.state = {
            data: props.data,
            time: props.time,
            yAxisDatas: props.yAxisDatas
        }
    }

    componentDidMount() {
        if (this.ref) {
            this.myChart = echarts.init(this.ref)
            this.setOption()
        }
    }

    componentWillReceiveProps(nextProps: Readonly<ChartProps>, nextContext: any): void {
        const { data, time, yAxisDatas } = nextProps
        if (time !== this.props.time) {
            this.setState({
                data,
                time,
                yAxisDatas
            }, () => {
                this.setOption()
            })
        }
    }

    setOption() {
        const { yAxisDatas, data } = this.state
        const option: any = {
            xAxis: {
                max: 'dataMax',
                axisLabel: {
                    fontSize: 8
                }
            },
            yAxis: {
                type: 'category',
                data: yAxisDatas,
                inverse: true,
                animationDuration: 100,
                animationDurationUpdate: 100,
                axisLabel: {
                    fontSize: 8
                }
                // max: 2 // only the largest 3 bars will be displayed
            },
            grid: {
                left: 150,
                top: 30,
                right: 70
            },
            series: [
                {
                    realtimeSort: true,
                    name: this.props.name,
                    type: 'bar',
                    data: data,
                    label: {
                        show: true,
                        position: 'right',
                        valueAnimation: true,
                        fontSize: 8
                    },
                    itemStyle: {
                        color: this.props.color,
                    }
                }
            ],
            legend: {
                show: true,
            },
            animationDuration: 0,
            animationDurationUpdate: 100,
            animationEasing: 'linear',
            animationEasingUpdate: 'linear',
        };

        this.myChart.setOption(option)
    }


    render(): React.ReactNode {
        return <div ref={(ref) => this.ref = ref} style={{ width: "100%", height: "100%" }
        }></div >
    }
}