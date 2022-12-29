import * as  echarts from "echarts"
import React from "react"
export interface DynamicChartProps {
    color?: string
    name?: string
    time?: string
    data?: any
    yAxisDatas?: string[]
}

export interface DynamicChartState {
    data: any
    time?: string
    yAxisDatas?: string[]
}
export class DynamicChart extends React.Component<DynamicChartProps, DynamicChartState> {
    ref: any
    myChart: any
    constructor(props: DynamicChartProps) {
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

    componentWillReceiveProps(nextProps: Readonly<DynamicChartProps>, nextContext: any): void {
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
            title: {
                subtext: this.props.name,
                left: 'center'
            },
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
                left: 50,
                top: 30,
                right: 70,
                bottom: 30
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
                show: false,
            },
            animationDuration: 0,
            animationDurationUpdate: 100,
            animationEasing: 'linear',
            animationEasingUpdate: 'linear',
            // graphic: {
            //     elements: [
            //         {
            //             type: 'text',
            //             right: 0,
            //             bottom: 0,
            //             style: {
            //                 text: "111",
            //                 font: 'bolder 80px monospace',
            //                 fill: 'rgba(100, 100, 100, 0.25)'
            //             },
            //             z: 100
            //         }
            //     ]
            // }
        };

        this.myChart.setOption(option)
    }


    render(): React.ReactNode {
        return <div ref={(ref) => this.ref = ref} style={{ width: "100%", height: "100%" }
        }></div >
    }
}