import React from "react"
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import newImage from "./img/new.jpg"
import oldImage from "./img/old.jpg"
import ReactJson from 'react-json-view'
import { Alert, Link } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import moment from "moment"

const FileSaver = require('file-saver');
const Item = styled(Paper)(({ theme }: any) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));
export interface ArcgisDynamicDataProps {

}

export interface ArcgisDynamicDataState {
    datas?: any
    newDatas?: any
}
export class ArcgisDynamicData extends React.Component<ArcgisDynamicDataProps, ArcgisDynamicDataState> {
    ref: any
    constructor(props: ArcgisDynamicDataProps) {
        super(props)
        this.state = {
            datas: {},
            newDatas: {}
        }
    }

    componentDidMount() {
        // const url = "/datas/新疆气温.geojson"
        // this.queryDatas(url)
    }

    componentWillReceiveProps(nextProps: Readonly<ArcgisDynamicDataProps>, nextContext: any): void {

    }


    async queryDatas(url: string) {
        const datas = await (await fetch(url)).json()
        console.log(datas);
    }

    onChange(e: any) {
        this.setState({
            datas: {},
            newDatas: {}
        })
        let self = this
        const files = e.target.files
        if (files.length) {
            let file = files[0];
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (_this) {
                self.setState({
                    datas: JSON.parse(reader.result as string)
                })
            };
        }
    }

    handlerDatas(datas?: any) {
        const newDatas: any = {

        }
        const years: string[] = ["F1999", "F2000", "F2001", "F2001", "F2002", "F2003", "F2004", "F2005", "F2006", "F2007", "F2008", "F2009", "F2010", "F2011", "F2012", "F2013", "F2014", "F2015", "F2016", "F2017", "F2018"]
        const saveFileds: string[] = ["地州"]
        const timeField = "时间"
        const resultField = "气温"
        const replaceStr = "F"
        if (datas && datas.features) {
            const newFeatures: any[] = []
            years.forEach((year: string) => {
                datas.features.forEach((feature: any) => {
                    const properties = feature.properties
                    const newProperties: any = {}
                    saveFileds.forEach((field: string) => {
                        newProperties[field] = properties[field]
                    })
                    newProperties[timeField] = year && replaceStr ? year.replace(replaceStr, "") : year
                    newProperties[resultField] = properties[year]
                    const newFeature = { geometry: feature.geometry, properties: newProperties }
                    newFeatures.push(newFeature)
                });
            })

            newDatas.crs = datas.crs
            newDatas.name = datas.name
            newDatas.type = datas.type
            newDatas.features = newFeatures
        }
        return newDatas
    }

    onClick() {
        const { datas } = this.state
        const newDatas = this.handlerDatas(datas)
        this.setState({
            newDatas
        })
    }

    onClickHander() {
        const { newDatas } = this.state
        if (newDatas) {
            const blob = new Blob([JSON.stringify(newDatas)], { type: "text/plain;charset=utf-8" });
            FileSaver.saveAs(blob, `${moment().format("YYYY-MM-DD hh:mm:ss")}.json`);
        }
    }


    render(): React.ReactNode {
        const { newDatas, datas } = this.state
        return <div ref={(ref) => this.ref = ref} style={{ width: "100%", height: "100%", padding: 10 }
        }>
            <Alert severity="info">将如下左边的数据结构转换为右边的数据结构，为ArcMap的时态数据做准备</Alert>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Item>
                        <img src={oldImage}></img>
                    </Item>
                </Grid>
                <Grid item xs={6}>
                    <Item>
                        <img src={newImage}></img>
                    </Item>
                </Grid>
            </Grid>
            <div style={{ padding: 10 }}>
                <Button variant="contained" component="label">
                    上传文件
                    <input hidden accept="application/json" multiple type="file" onChange={this.onChange.bind(this)} />
                </Button>

                {datas && Object.keys(datas).length > 0 && <Button variant="contained" style={{ marginLeft: 20 }} component="label" onClick={this.onClick.bind(this)}>
                    处理文件
                </Button>}

                {newDatas && Object.keys(newDatas).length > 0 && <Alert severity="success">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", height: 30 }} >数据处理成功！ <Link href="javascript:void(0)" variant="body2" underline="hover">
                            <p onClick={this.onClickHander.bind(this)} style={{ display: "flex", alignItems: "center" }}><ArrowDownwardIcon />下载 </p>
                        </Link>
                        </div>
                    </div>
                </Alert>}
                {Object.keys(newDatas).length > 0 && <div><Alert style={{ marginTop: 10 }} severity="info">预览数据</Alert> <ReactJson src={newDatas} /></div>}
            </div>
        </div >
    }
}