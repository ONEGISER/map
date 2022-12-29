import * as  echarts from "echarts"
import React from "react"
export interface PieChartProps {
    color?: string
    name?: string
    time?: string
    data?: ChartData[]
}

export interface ChartData {
    name: string
    value: number
}

export interface PieChartState {
    data?: ChartData[]
    time?: string
    yAxisDatas?: string[]
}
/**
 * 饼图
 */
export class PieChart extends React.Component<PieChartProps, PieChartState> {
    ref: any
    myChart: any
    constructor(props: PieChartProps) {
        super(props)
        this.state = {
            data: props.data,
            time: props.time,
        }
    }

    componentDidMount() {
        if (this.ref) {
            this.myChart = echarts.init(this.ref)
            this.setOption()
        }
    }

    componentWillReceiveProps(nextProps: Readonly<PieChartProps>, nextContext: any): void {
        const { data, time } = nextProps
        if (time !== this.props.time) {
            this.setState({
                data,
                time,
            }, () => {
                this.setOption()
            })
        }
    }

    setOption() {
        const { data } = this.state
        const option: any = {
            title: {
                subtext: this.props.name,
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
            },
            legend: {
                // orient: 'vertical',
                // left: 'left',
                // top:"bottom",
                bottom: 0,
                left: 'center',
                textStyle:{
                    fontSize:10
                },
                itemWidth:16,
                itemHeight:12
            },
            grid: {
                left: 140,
                top: 40,
                right: 0,
                bottom: 0
            },
            series: [
                {
                    name: this.props.name,
                    type: 'pie',
                    radius: '60%',
                    data,
                    label: {
                        show: false,
                        position: 'center'
                      },
                }
            ]
        };

        this.myChart.setOption(option)
    }


    render(): React.ReactNode {
        return <div ref={(ref) => this.ref = ref} style={{ width: "100%", height: "100%" }
        }></div >
    }
}