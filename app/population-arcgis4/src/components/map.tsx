import "./map.css"
import EsriMap from "@arcgis/core/Map";
import { useEffect } from "react";
import SceneView from "@arcgis/core/views/SceneView"
import Graphic from "@arcgis/core/Graphic"
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import LabelClass from "@arcgis/core/layers/support/LabelClass"
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer"
import PolygonSymbol3D from "@arcgis/core/symbols/PolygonSymbol3D"
import ExtrudeSymbol3DLayer from "@arcgis/core/symbols/ExtrudeSymbol3DLayer"
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer"
import esriConfig from "@arcgis/core/config"
import Legend from "@arcgis/core/widgets/Legend"
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import React from "react";
import { Button, Card, Col, Row, Slider } from "antd";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel"
import * as promiseUtils from "@arcgis/core/core/promiseUtils";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine"
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
            bufferSize: 0
        }
    }
    componentDidMount(): void {
        this.init()
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
            self.setState({
                created: true
            }, () => {
                setTimeout(() => {
                    self.addLisener(view, self, self.populayer)
                }, 100);
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

        view.ui.add(legend, "bottom-right");

        view.ui.add(["queryDiv"], "top-right");

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


    createBuffer(view: any, self: any) {
        view.map.addMany([self.bufferLayer, self.sketchLayer]);
        view.whenLayerView(self.populayer).then((layerView: any) => {
            self.sceneLayerView = layerView;
            self.queryDiv = document.getElementById("queryDiv")
            self.queryDiv.style.display = "block";
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
            const statDefinitions = [
                {
                    onStatisticField:
                        "CASE WHEN buildingMaterial = 'concrete or lightweight concrete' THEN 1 ELSE 0 END",
                    outStatisticFieldName: "material_concrete",
                    statisticType: "sum"
                },
                {
                    onStatisticField:
                        "CASE WHEN buildingMaterial = 'brick' THEN 1 ELSE 0 END",
                    outStatisticFieldName: "material_brick",
                    statisticType: "sum"
                },
                {
                    onStatisticField:
                        "CASE WHEN buildingMaterial = 'wood' THEN 1 ELSE 0 END",
                    outStatisticFieldName: "material_wood",
                    statisticType: "sum"
                },
                {
                    onStatisticField:
                        "CASE WHEN buildingMaterial = 'steel' THEN 1 ELSE 0 END",
                    outStatisticFieldName: "material_steel",
                    statisticType: "sum"
                },
                {
                    onStatisticField:
                        "CASE WHEN buildingMaterial IN ('concrete or lightweight concrete', 'brick', 'wood', 'steel') THEN 0 ELSE 1 END",
                    outStatisticFieldName: "material_other",
                    statisticType: "sum"
                },
                {
                    onStatisticField:
                        "CASE WHEN (yearCompleted >= '1850' AND yearCompleted <= '1899') THEN 1 ELSE 0 END",
                    outStatisticFieldName: "year_1850",
                    statisticType: "sum"
                },
                {
                    onStatisticField:
                        "CASE WHEN (yearCompleted >= '1900' AND yearCompleted <= '1924') THEN 1 ELSE 0 END",
                    outStatisticFieldName: "year_1900",
                    statisticType: "sum"
                },
                {
                    onStatisticField:
                        "CASE WHEN (yearCompleted >= '1925' AND yearCompleted <= '1949') THEN 1 ELSE 0 END",
                    outStatisticFieldName: "year_1925",
                    statisticType: "sum"
                },
                {
                    onStatisticField:
                        "CASE WHEN (yearCompleted >= '1950' AND yearCompleted <= '1974') THEN 1 ELSE 0 END",
                    outStatisticFieldName: "year_1950",
                    statisticType: "sum"
                },
                {
                    onStatisticField:
                        "CASE WHEN (yearCompleted >= '1975' AND yearCompleted <= '1999') THEN 1 ELSE 0 END",
                    outStatisticFieldName: "year_1975",
                    statisticType: "sum"
                },
                {
                    onStatisticField:
                        "CASE WHEN (yearCompleted >= '2000' AND yearCompleted <= '2015') THEN 1 ELSE 0 END",
                    outStatisticFieldName: "year_2000",
                    statisticType: "sum"
                }
            ];
            const query = self.sceneLayerView.createQuery();
            query.geometry = self.sketchGeometry;
            query.distance = getBufferSize();
            // query.outStatistics = statDefinitions;

            return self.sceneLayerView.queryFeatures(query).then((result: any) => {
                const features = result.features
                const allStats = features[0].attributes;
                console.log(features, "oooo");

                // updateChart(materialChart, [
                //     allStats.material_concrete,
                //     allStats.material_brick,
                //     allStats.material_wood,
                //     allStats.material_steel,
                //     allStats.material_other
                // ]);
                // updateChart(yearChart, [
                //     allStats.year_1850,
                //     allStats.year_1900,
                //     allStats.year_1925,
                //     allStats.year_1950,
                //     allStats.year_1975,
                //     allStats.year_2000
                // ]);
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

    clearGeometry() {
        this.sketchGeometry = null;
        this.sketchViewModel.cancel();
        this.sketchLayer.removeAll();
        this.bufferLayer.removeAll();
        this.clearHighlighting();
        this.clearCharts();
        if (this.queryDiv)
            this.queryDiv.style.display = "none";
    }



    render(): React.ReactNode {
        const { scale, lnglat, created, bufferSize } = this.state
        return <div>
            <div className="lmap" id="map">

            </div>
            {scale && <Card size="small" className="scale">
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
            {created && <Card size="small" title={"图例"} id="legendDiv" style={{ padding: 10 }}></Card>}
            {/* 查询面板 */}
            {created && <Card size="small" title={"几何图形查询"} id="queryDiv" style={{ padding: 10 }}>
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
                    <Button id="clearGeometry" danger type="dashed">
                        清除
                    </Button>
                </Row>
            </Card>}
        </div>
    };
}

