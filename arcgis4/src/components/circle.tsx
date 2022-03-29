import "./map.css"
import EsriMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer"
import { useEffect } from "react";
import esriConfig from "@arcgis/core/config"
import esriRequest from "@arcgis/core/request";
import Circle from "@arcgis/core/geometry/Circle"
import Graphic from "@arcgis/core/Graphic";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import Point from "@arcgis/core/geometry/Point";
import Polyline from "@arcgis/core/geometry/Polyline";
export const Map = () => {
    useEffect(() => {
        esriConfig.apiKey = 'AAPKbe175e40b15e49058dfe57b996e86af16d-YTr6r1PEO-Bee2LIXdl4I18UosHFG-QpjVeefCk5g_xld_VynBEGSUwLAj4PC'
        esriRequest("/mapbox/styles/v1/mapbox/streets-v11").then((response) => {
            if (response.data) {
                const res = response.data
                res.sources.composite = {
                    type: "vector",
                    tiles: ["/mapbox/v4/mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2/{z}/{x}/{y}.vector.pbf"],
                }
                res.sprite = "/mapbox/styles/v1/mapbox/streets-v11/sprite"
                res.glyphs = "/mapbox/fonts/v1/mapbox/{fontstack}/{range}.pbf"
                const vectorTileLayer = new VectorTileLayer({ style: res });
                const map = new EsriMap();

                const lng = 103.8486246
                const lat = 36.0573194
                const radius = 110

                const view = new MapView({
                    map: map,
                    center: [lng, lat],
                    zoom: 17,
                    container: "map",
                });
                map.add(vectorTileLayer)

                //esri绘制圆
                const proS = new SpatialReference({ wkid: 102100 })
                const color = [226, 119, 40]

                //圆心
                const xy = webMercatorUtils.lngLatToXY(lng, lat)
                const point = new Point({
                    x: xy[0],
                    y: xy[1],
                    spatialReference: proS
                })
                const markerSymbol = {
                    type: "simple-marker",
                    color: color,
                    outline: {
                        color: [255, 255, 255],
                        width: 1
                    }
                }

                const pointGraphic = new Graphic({
                    geometry: point,
                    symbol: markerSymbol
                })
                view.graphics.add(pointGraphic)

                //圆
                const circleGeometry = new Circle({
                    center: point,
                    numberOfPoints: 100,
                    radius: radius,
                    radiusUnit: "meters",
                    spatialReference: proS
                });
                view.graphics.add(new Graphic({
                    geometry: circleGeometry,
                    symbol: {
                        type: "simple-fill",
                        style: "none",
                        outline: {
                            width: 1,
                            color
                        }
                    }
                } as any));

                const add = (x: number, y: number) => {
                    const geo2 = webMercatorUtils.xyToLngLat(x, y)

                    //测试点，用于计算半径
                    const pointT = new Point({
                        x: x,
                        y: y,
                        spatialReference: proS
                    })
                    console.log(pointT.distance(point));

                    const point2 = new Point({
                        x: geo2[0],
                        y: geo2[1],
                        spatialReference: new SpatialReference({ wkid: 4326 })
                    })

                    const pointGraphic2 = new Graphic({
                        geometry: point2,
                        symbol: markerSymbol
                    });

                    view.graphics.add(pointGraphic2)
                }

                //正方向的四个点
                const pro = webMercatorUtils.lngLatToXY(lng, lat);
                const x2 = pro[0] + radius
                const y2 = pro[1]
                add(x2, y2)


                const x3 = pro[0] - radius
                const y3 = pro[1]
                add(x3, y3)


                const x1 = pro[0]
                const y1 = pro[1] - radius
                add(x1, y1)

                const x4 = pro[0]
                const y4 = pro[1] + radius
                add(x4, y4)

                const polyline = new Polyline({
                    paths: [xy as any, [x2, y2]],
                    spatialReference: proS,
                })
                const polylineGraphic = new Graphic({
                    geometry: polyline,
                    symbol: {
                        type: "simple-line", // autocasts as SimpleLineSymbol()
                        color,
                        width: 1
                    } as any
                });

                view.graphics.add(polylineGraphic)

                //标注
                const symbol1 = {
                    type: "text",
                    color,
                    text: `半径${radius}米`,
                    xoffset: 0,
                    yoffset: 10, //3d地图不起作用
                    font: {
                        size: 12,
                    },
                };

                const point2 = new Point({
                    x: xy[0] + radius / 2,
                    y: xy[1],
                    spatialReference: proS
                })
                const pointGraphic2 = new Graphic({
                    geometry: point2,
                    symbol: symbol1
                })
                view.graphics.add(pointGraphic2)
            }
        })
    })
    return <div className="lmap" id="map">

    </div>
};