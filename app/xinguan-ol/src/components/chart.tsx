import { useEffect, useRef, useState } from "react"
import * as  echarts from "echarts"
import React from "react"
/**属性 */
export interface ChartProps {
    /**图表颜色 */
    color?: string
    /**图例名称 */
    name?: string
    /**时间，作为数据变化的依据 */
    time?: string
    /**展示的数据*/
    data?: any
    /**y轴的数据 */
    yAxisDatas?: string[]
}

/**状态 */
export interface ChartState {
    /**展示的数据*/
    data: any
    /**时间，作为数据变化的依据 */
    time?: string
    /**y轴的数据*/
    yAxisDatas?: string[]
}
/**
 * 图表组件
 */
export class Chart extends React.Component<ChartProps, ChartState> {
    /**节点 */
    ref: any
    /**图表 */
    myChart: any
    constructor(props: ChartProps) {
        super(props)
        this.state = {
            data: props.data,//属性赋值
            time: props.time,
            yAxisDatas: props.yAxisDatas
        }
    }

    componentDidMount() {
        if (this.ref) {
            //dom构造好后初始化echarts图表
            this.myChart = echarts.init(this.ref)
            //配置选项
            this.setOption()
        }
    }

    componentWillReceiveProps(nextProps: Readonly<ChartProps>, nextContext: any): void {
        const { data, time, yAxisDatas } = nextProps
        /**数据发生变化后更新图表的数据 */
        if (time !== this.props.time) {
            this.setState({
                data,
                time,
                yAxisDatas
            }, () => {
                //修改图表的数据
                this.setOption()
            })
        }
    }

    setOption() {
        const { yAxisDatas, data } = this.state//状态中的数据
        //echarts的配置项
        const option: any = {
            //x轴
            xAxis: {
                max: 'dataMax',
                axisLabel: {
                    fontSize: 8
                }
            },
            //y轴
            yAxis: {
                type: 'category',
                data: yAxisDatas,
                inverse: true,
                animationDuration: 100,
                animationDurationUpdate: 100,
                axisLabel: {
                    fontSize: 8
                }
            },
            //坐标网格
            grid: {
                left: 60,
                top: 30,
                right: 70
            },
            //数据展示
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

        //通过图表实例更新选项
        this.myChart.setOption(option)
    }


    /**渲染图表 */
    render(): React.ReactNode {
        return <div ref={(ref) => this.ref = ref} style={{ width: "100%", height: "100%" }}></div >
    }
}