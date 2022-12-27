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
import { Col, Row } from "antd";

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
}
export class Map extends React.Component<MapProps, MapState>{
    constructor(props: MapProps) {
        super(props)
        this.state = {
            scale: "",
            lnglat: {}
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
                            color: "#33ffff",
                            label: '100',
                        },
                        {
                            value: 2300,
                            color: [51, 0, 255],
                            label: '2300',
                        },
                        {
                            value: 16000,
                            color: [255, 0, 0],
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
        const popuLayer = new GeoJSONLayer({
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
                    fieldInfos: [ {
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
            layers: [popuLayer],
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
            view.on('double-click', function (evt) {
                evt.stopPropagation();
            });

            //滚轮事件
            view.on('mouse-wheel', function () {
                //鼠标滚轮缩放
                self.getScale(view)
            });

            //鼠标移动
            view.on("pointer-move", function (evt) { //鼠标移动事件
                view.hitTest(evt).then(function (respond) {
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
                view: view,
                layerInfos: [
                    {
                        layer: popuLayer,
                        title: "人口"
                    }
                ],
            });

            view.ui.add(legend, "bottom-right");
        })
    }

    getScale(view: SceneView) {
        const scale = view.scale;
        const _scale = scale.toFixed(0);
        const self = this
        self.setState({
            scale: _scale
        })
    }



    render(): React.ReactNode {
        const { scale, lnglat } = this.state
        return <div>
            <div className="lmap" id="map">

            </div>
            {scale && <Row className="scale">
                <Col>
                    <Row>
                        <Col>比例尺</Col>
                        <Col>1:{scale}</Col>
                    </Row>
                </Col>
                {lnglat?.lng && <Col style={{ paddingLeft: 10 }}>经度：{lnglat.lng}</Col>}
                {lnglat?.lat && <Col style={{ paddingLeft: 10 }}>纬度：{lnglat.lat}</Col>}
            </Row>}
        </div>
    };
}

