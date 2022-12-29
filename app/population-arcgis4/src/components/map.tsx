import "./map.css"
import EsriMap from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView"
import Graphic from "@arcgis/core/Graphic"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
import LabelClass from "@arcgis/core/layers/support/LabelClass"
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer"
import esriConfig from "@arcgis/core/config"
import Legend from "@arcgis/core/widgets/Legend"
import React from "react";
import { Button, Card, Col, Modal, Row, Slider, Spin, Table, Typography } from "antd";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel"
import * as promiseUtils from "@arcgis/core/core/promiseUtils";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine"
import { DynamicChart } from "./dynamicChart";
import { ChartData, PieChart } from "./pieChart";

export interface MapProps {

}
export interface MapState {
    /**比例尺 */
    scale?: string
    /**
     * 经纬度
     */
    lnglat?: {
        lng?: string
        lat?: string
    }
    created?: boolean
    bufferSize?: number
    /**人口 */
    popuDatas?: ChartData[]
    /**密度 */
    densityDatas?: ChartData[]
    time?: number
    loading?: boolean
    //人口饼图数据
    piePopuDatas?: ChartData[]
    visible?: boolean
    dataSource?: DataSource[]
}

export interface DataSource {
    POPU?: number
    NAME?: string
    DENSITY?: number
    feature?: any
}
export class Map extends React.Component<MapProps, MapState>{
    populayer: any
    sketchViewModel: any
    sceneLayerView: any = null;
    sketchLayer = new GraphicsLayer();
    bufferLayer: any = new GraphicsLayer();
    queryDiv: any
    sketchGeometry: any = null;
    highlightHandle: any = null;

    constructor(props: MapProps) {
        super(props)
        this.state = {
            scale: "",
            lnglat: {},
            created: false,
            bufferSize: 0,
            popuDatas: [],
            densityDatas: [],
            time: this.getTime(),
            loading: true,
            piePopuDatas: [],
            visible: false,
            dataSource: []
        }
    }
    componentDidMount(): void {
        this.init()
    }


    getTime() {
        return new Date().getTime()
    }


    init() {
        esriConfig.apiKey = "AAPK449340f85b664e6b802d2d0e65eb4849vlSII8YqKpEj5Fn0hCy2qr4QyOAZRZSB6XWDc2-X8pFlNoRYoQoetUvFs1Y_JVKL"

        //渲染图层的方法
        const renderer: any = {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: {
                type: "polygon-3d", // autocasts as new PolygonSymbol3D()
                symbolLayers: [
                    {
                        type: "extrude" // autocasts as new ExtrudeSymbol3DLayer()
                    }
                ]
            },
            visualVariables: [
                {
                    type: "size",
                    field: "POPU",
                    legendOptions: {
                        title: "人口（万人）"
                    },
                    stops: [
                        {
                            value: 1,
                            size: 100,
                        },
                        {
                            value: 300,
                            size: 30000,
                        }
                    ]
                },
                {
                    type: "color",
                    field: "DENSITY",
                    legendOptions: {
                        title: "人口密度（人/km²）"
                    },
                    stops: [
                        {
                            value: 100,
                            color: "#70b6ba",
                            label: '100',
                        },
                        {
                            value: 500,
                            color: "#b7d5d7",
                            label: '500',
                        },
                        {
                            value: 1000,
                            color: "#fff0d0",
                            label: '1000',
                        },
                        {
                            value: 3000,
                            color: "#f9cbb3",
                            label: '3000',
                        },
                        {
                            value: 16000,
                            color: "#ec8787",
                            label: '16000',
                        }
                    ]
                }
            ]
        };

        //图层标注
        const labelClass = new LabelClass({
            symbol: {
                type: "label-3d",
                symbolLayers: [
                    {
                        type: "text",
                        material: {
                            color: "black"
                        },
                        size: 8
                    } as any
                ]
            },
            labelPlacement: "above-center",
            labelExpressionInfo: {
                expression: 'DefaultValue($feature.NAME, "no data")'
            }
        });

        // 人口图层，以geojson图层加载
        this.populayer = new GeoJSONLayer({
            id: "人口",
            url: "/datas/shandongpopu.geojson",//数据路径
            renderer: renderer,
            labelingInfo: [labelClass],
            elevationInfo: {
                mode: "on-the-ground"
            },
            popupTemplate: {
                title: "{name}",
                content: [{
                    type: "fields",
                    fieldInfos: [{
                        fieldName: "ENAME",
                        label: "行政区英文名称"
                    }, {
                        fieldName: "POPU",
                        label: "人口（万人）"
                    }, {
                        fieldName: "AREA",
                        label: "行政区面积(m²)"
                    }, {
                        fieldName: "DENSITY",
                        label: "人口密度（人/km²）"
                    }]
                }]
            },
            outFields: ["objectid", "code", "name", "type", "length", "yearcomple", "catagory"]
        });


        const map = new EsriMap({
            basemap: "arcgis-topographic", //基础地图服务   可以选择""dark-gray
            ground: "world-elevation", //高程服务
            layers: [this.populayer],
        });

        const view = new SceneView({
            container: "map",
            map: map,
            camera: {
                position: {
                    spatialReference: { wkid: 102100 },
                    x: 12964061.149533136,
                    y: 3447251.4087446583,
                    z: 819505.7301032562
                },
                heading: 9.384510690778026,
                tilt: 40.21595521917268
            }
        });


        //比例尺  经纬度相关
        const self = this
        view.when(function () {
            //延迟2s加载
            self.setState({
                created: true
            }, () => {
                setTimeout(() => {
                    //添加一些监听
                    self.addLisener(view, self, self.populayer)
                }, 50);
            })
        })
    }


    addLisener(view: any, self: any, popuLayer: any) {
        self.getScale(view)
        //点击地图的监听事件
        view.on("click", function (e: any) {
            //获取初始化视角
            // let activeViewpoint = view.viewpoint.clone();
            // console.log(activeViewpoint);
            //转换当前点击的坐标为地理坐标
            // const geom = webMercatorUtils.xyToLngLat(e.mapPoint.x, e.mapPoint.y);
            // console.log(geom[0], geom[1], e.mapPoint.x, e.mapPoint.y);
        });

        //双击事件
        view.on('double-click', function (evt: any) {
            evt.stopPropagation();
        });

        //滚轮事件
        view.on('mouse-wheel', function () {
            //鼠标滚轮缩放
            self.getScale(view)
        });

        //鼠标移动
        view.on("pointer-move", function (evt: any) { //鼠标移动事件
            view.hitTest(evt).then(function (respond: any) {
                if (respond?.results[0]) {
                    const result = respond.results[0];
                    const lng = result.mapPoint.longitude.toFixed(4);
                    const lat = result.mapPoint.latitude.toFixed(4);
                    self.setState({
                        lnglat: {
                            lng,
                            lat
                        }
                    })
                }
            })
        });


        //比例尺
        const legend = new Legend({
            container: "legendDiv",
            view: view,
            layerInfos: [
                {
                    layer: popuLayer,
                    title: "人口"
                }
            ],
        });

        //图例
        view.ui.add(legend, "bottom-right");

        //查询面板
        view.ui.add(["queryDiv"], "top-right");

        //创建缓冲区
        self.createBuffer(view, self)
    }

    getScale(view: SceneView) {
        const scale = view.scale;
        const _scale = scale.toFixed(0);
        const self = this
        self.setState({
            scale: _scale
        })
    }

    queryAllFeatures() {
        //查询图层里面所有的要素，用于加载所有数据
        const query = this.sceneLayerView.createQuery();
        query.where = "1=1"
        return this.sceneLayerView.queryFeatures(query).then((result: any) => {
            this.getChartDatas(result)
        }, console.error);
    }


    createBuffer(view: any, self: any) {
        view.map.addMany([self.bufferLayer, self.sketchLayer]);
        view.whenLayerView(self.populayer).then((layerView: any) => {
            self.sceneLayerView = layerView;
            self.queryDiv = document.getElementById("queryDiv")
            self.queryDiv.style.display = "block"
            //查询所有的要素
            setTimeout(() => {
                self.populayer.when(() => {
                    self.queryAllFeatures()
                })
            }, 3000);
        });

        // use SketchViewModel to draw polygons that are used as a query
        self.sketchViewModel = new SketchViewModel({
            layer: self.sketchLayer,
            defaultUpdateOptions: {
                tool: "reshape",
                toggleToolOnClick: false
            },
            view: view,
            defaultCreateOptions: { hasZ: false }
        });

        self.sketchViewModel.on("create", (event: any) => {
            if (event.state === "complete") {
                self.sketchGeometry = event.graphic.geometry;
                runQuery();
            }
        });

        self.sketchViewModel.on("update", (event: any) => {
            if (event.state === "complete") {
                self.sketchGeometry = event.graphics[0].geometry;
                runQuery();
            }
        });

        // Set the renderer with objectIds
        function highlightBuildings(objectIds: string[]) {
            // Remove any previous highlighting
            self.clearHighlighting();
            const objectIdField = self.populayer.objectIdField;
            // document.getElementById("count").innerHTML = objectIds.length;
            console.log(objectIds);

            self.highlightHandle = self.sceneLayerView.highlight(objectIds);
        }


        function updateSceneLayer() {
            const query = self.sceneLayerView.createQuery();
            query.geometry = self.sketchGeometry;
            query.distance = getBufferSize();
            return self.sceneLayerView.queryObjectIds(query).then(highlightBuildings);
        }


        function getBufferSize() {
            return self.state.bufferSize ? self.state.bufferSize * 1000 : 0
        }

        // set the geometry query on the visible SceneLayerView
        const debouncedRunQuery = promiseUtils.debounce(() => {
            if (!self.sketchGeometry) {
                return;
            }

            self.queryDiv.style.display = "block";
            updateBufferGraphic(getBufferSize());
            return promiseUtils.eachAlways([
                queryStatistics(),
                updateSceneLayer()
            ]);
        });

        function runQuery() {
            debouncedRunQuery().catch((error: any) => {
                if (error.name === "AbortError") {
                    return;
                }

                console.error(error);
            });
        }

        function queryStatistics() {
            const query = self.sceneLayerView.createQuery();
            query.geometry = self.sketchGeometry;
            query.distance = getBufferSize();
            self.setState({
                loading: true
            })
            return self.sceneLayerView.queryFeatures(query).then((result: any) => {
                self.getChartDatas(result)
            }, console.error);
        }

        // update the graphic with buffer
        function updateBufferGraphic(buffer: any) {
            // add a polygon graphic for the buffer
            if (buffer > 0) {
                const bufferGeometry = geometryEngine.geodesicBuffer(
                    self.sketchGeometry,
                    buffer,
                    "meters"
                );
                if (self.bufferLayer.graphics.length === 0) {
                    self.bufferLayer.add(
                        new Graphic({
                            geometry: bufferGeometry,
                            symbol: self.sketchViewModel.polygonSymbol
                        } as any)
                    );
                } else {
                    self.bufferLayer.graphics.getItemAt(0).geometry = bufferGeometry;
                }
            } else {
                self.bufferLayer.removeAll();
            }
        }
    }

    clearHighlighting() {
        if (this.highlightHandle) {
            this.highlightHandle.remove();
            this.highlightHandle = null;
        }
    }

    clearCharts() {
        this.queryAllFeatures()
    }

    onSliderChange(value: number) {
        this.setState({
            bufferSize: value
        })
    }

    geometryButtonsClickHandler(geometryType: string, event: any) {
        this.clearGeometry();
        this.sketchViewModel.create(geometryType);
    }

    clearGeometry(showUi?: boolean) {
        this.sketchGeometry = null;
        this.sketchViewModel.cancel();
        this.sketchLayer.removeAll();
        this.bufferLayer.removeAll();
        this.clearHighlighting();
        this.clearCharts();
        if (!showUi) {
            //清除UI
            if (this.queryDiv)
                this.queryDiv.style.display = "none";
        }
    }


    clearHandler() {
        this.clearGeometry(true)
    }


    getChartDatas(queryFeatures: any) {
        //构造echarts数据
        if (queryFeatures?.features) {
            const features = queryFeatures.features
            const tempPopuDatas: ChartData[] = []
            const tempDensityDatas: ChartData[] = []
            const tempPopuCalcDatas: ChartData[] = []

            const dataSource: DataSource[] = []

            const popuObj: { [key: string]: number } = {
                "<40": 0,
                "40-80": 0,
                "80-160": 0,
                ">=160": 0,
            }

            features.forEach((feature: any) => {
                const { attributes } = feature
                // DENSITY: 816 NAME: "微山县" POPU: 68
                if (attributes) {
                    const { DENSITY, POPU, NAME } = attributes
                    tempPopuDatas.push({ value: POPU ? Number(POPU) : 0, name: NAME })
                    tempDensityDatas.push({ value: DENSITY ? Number(DENSITY) : 0, name: NAME })
                    dataSource.push({
                        DENSITY,
                        POPU,
                        NAME,
                        feature
                    })
                    //分级统计人口
                    if (POPU < 40) {
                        popuObj["<40"]++
                    } else if (POPU >= 40 && POPU < 80) {
                        popuObj["40-80"]++
                    } else if (POPU >= 80 && POPU < 160) {
                        popuObj["80-160"]++
                    } else if (POPU >= 160) {
                        popuObj[">=160"]++
                    }
                }
            });

            if (popuObj) {
                for (let i in popuObj) {
                    tempPopuCalcDatas.push({
                        name: i,
                        value: popuObj[i]
                    })
                }
            }

            tempPopuDatas.sort((a, b) => { return b.value - a.value })
            tempDensityDatas.sort((a, b) => { return b.value - a.value })
            dataSource.sort((a: any, b: any) => { return b.POPU - a.POPU })

            this.setState({
                popuDatas: tempPopuDatas,
                densityDatas: tempDensityDatas,
                time: this.getTime(),
                loading: false,
                piePopuDatas: tempPopuCalcDatas,
                dataSource
            })
        }
    }

    getDatas(data: ChartData[], count?: number) {
        const datas: number[] = []
        const names: string[] = []
        for (let i in data) {
            if (count) {
                if (Number(i) > count - 1) {
                    break;
                }
            }
            const { name, value } = data[i]
            datas.push(value)
            names.push(name)
        }
        return { datas, names }
    }


    onView() {
        this.setState({
            visible: true
        })
    }

    onClose() {
        this.setState({
            visible: false
        })
    }



    render(): React.ReactNode {
        const { scale, lnglat, created, bufferSize, popuDatas, densityDatas, time, loading, piePopuDatas, visible, dataSource } = this.state
        const width = 340
        const count = 10
        const height = 40
        const popuData = popuDatas ? this.getDatas(popuDatas, count) : { datas: [], names: [] }
        const densityData = densityDatas ? this.getDatas(densityDatas, count) : { datas: [], names: [] }
        const columns = [
            {
                title: '名称',
                dataIndex: 'NAME',
                key: 'nAME',
            },
            {
                title: '人口(万人)',
                dataIndex: 'POPU',
                key: 'POPU',
            },
            {
                title: '人口密度(人/km²)',
                dataIndex: 'DENSITY',
                key: 'DENSITY',
            },
        ];

        return <div>
            <div className="lmap" id="map">

            </div>
            {scale && <Card size="small" className="scale" style={{ width }}>
                <Row >
                    <Col>
                        <Row>
                            <Col>比例尺</Col>
                            <Col>1:{scale}</Col>
                        </Row>
                    </Col>
                    {lnglat?.lng && <Col style={{ paddingLeft: 10 }}>经度：{lnglat.lng}</Col>}
                    {lnglat?.lat && <Col style={{ paddingLeft: 10 }}>纬度：{lnglat.lat}</Col>}
                </Row></Card>}

            {/* 图例 */}
            {created && <Card size="small" title={"图例"} id="legendDiv" style={{ padding: 10, width: 220 }}></Card>}
            {/* 查询面板 */}
            {created && <Card size="small" title={"几何图形查询"} id="queryDiv" style={{ padding: 10,width:220 }}>
                <Row style={{ width: "100%" }} >
                    <Button
                        style={{ marginLeft: 10 }}
                        type="primary"
                        // className="esri-widget--button esri-icon-map-pin geometry-button"
                        id="point-geometry-button"
                        value="point"
                        title="按点选择"
                        onClick={this.geometryButtonsClickHandler.bind(this, "point")}
                    >
                        点
                    </Button>
                    <Button
                        style={{ marginLeft: 10 }}
                        type="primary"
                        // className="esri-widget--button esri-icon-polyline geometry-button"
                        id="line-geometry-button"
                        value="polyline"
                        title="按折线选择"
                        onClick={this.geometryButtonsClickHandler.bind(this, "polyline")}
                    >
                        线
                    </Button>
                    <Button
                        style={{ marginLeft: 10 }}
                        type="primary"
                        // className="esri-widget--button esri-icon-polygon geometry-button"
                        id="polygon-geometry-button"
                        value="polygon"
                        title="按多边形选择"
                        onClick={this.geometryButtonsClickHandler.bind(this, "polygon")}
                    >
                        面
                    </Button>
                </Row>
                <Row style={{ width: "100%" }}>
                    <div style={{ padding: "10px 0" }}>设置缓冲区半径(km):</div>
                    <Slider value={bufferSize} style={{ width: "100%" }} min={0} max={500} onChange={this.onSliderChange.bind(this)}></Slider>
                </Row>
                <Row justify={"center"} style={{ width: "100%" }}>
                    <Button id="clearGeometry" danger type="dashed" onClick={this.clearHandler.bind(this)}>
                        清除
                    </Button>
                </Row>
            </Card>}

            <Row justify={"center"} style={{ position: "absolute", left: 300, top: 15, right: 300 }}>
                <Card >
                    <div style={{ fontSize: 24 }}>
                        山东省人口查询展示系统
                    </div>
                </Card>
            </Row>

            <Row style={{ width, position: "absolute", left: 10, top: 210, bottom: 90 }}>
                <Card title={"统计数据展示"} style={{ width: "100%", height: "100%", position: "relative" }} bodyStyle={{ width: "100%", height: `calc(100% - 40px)`, padding: 10 }} size="small">
                    <Row justify={"center"} style={{ height, width: "100%" }}>
                        {popuDatas && popuDatas.length > 0 && <Row align={"middle"}>
                            <Col>{`总计${popuDatas ? popuDatas.length : 0}个要素`}</Col>
                            <Col>
                                <Button type="link" size="small" onClick={this.onView.bind(this)}>查看数据信息</Button>
                            </Col>
                        </Row>}
                    </Row>
                    <Row style={{ height: `calc(100% - ${height}px)` }}>
                        <Spin style={{ left: "40%", position: "absolute", top: "45%" }} spinning={loading} tip={"加载数据中...."}>

                        </Spin>
                        <Row style={{ height: "33%", width: "100%" }}>
                            {popuData.datas.length > 0 && <DynamicChart color={"#f7e2c5"} yAxisDatas={popuData.names} data={popuData.datas} time={time?.toString()} name={`人口前${count}名数据统计(万人)`} />}
                        </Row>
                        <Row style={{ height: "33%", width: "100%" }}>
                            {densityData.datas.length > 0 && <DynamicChart color={"#b5d1d3"} yAxisDatas={densityData.names} data={densityData.datas} time={time?.toString()} name={`人口密度前${count}名数据统计(万人)`} />}
                        </Row>
                        <Row style={{ height: "33%", width: "100%" }}>
                            {piePopuDatas && piePopuDatas.length > 0 && <PieChart data={piePopuDatas} time={time?.toString()} name={`人口分级统计区县(个)`} />}
                        </Row>
                    </Row>
                </Card>
            </Row>
            <Modal centered title={"数据列表"} footer={null} width={400} open={visible} onCancel={this.onClose.bind(this)}>
                <Table dataSource={dataSource} pagination={false} scroll={{ y: 500 }} columns={columns} />
            </Modal>
        </div>
    };
}

