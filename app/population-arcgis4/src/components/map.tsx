import "./map.css"
import EsriMap from "@arcgis/core/Map";
import { useEffect } from "react";
import SceneView from "@arcgis/core/views/SceneView"
import Graphic from "@arcgis/core/Graphic"
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import LabelClass from "@arcgis/core/layers/support/LabelClass"
export const Map = () => {
    useEffect(() => {
        const map = new EsriMap({
            basemap: "dark-gray",
        });

        const view = new SceneView({
            container: "map",
            map: map,
            camera: {
                position: {
                    spatialReference: { wkid: 102100 },
                    x: -8238359,
                    y: 4967229,
                    z: 686
                },
                heading: 353,
                tilt: 66
            }
        });

        // const symbol = {
        //     type: "picture-marker",
        //     url: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1337419192,366595857&fm=26&gp=0.jpg",
        //     width: "50px",
        //     height: "50px",
        //     outline: {
        //         style: "solid"
        //     },
        // };

        const point1: any = {
            type: "point",
            x: -74.01,
            y: 40.71,
            z: 0,
            SpatialReference: 4326
        };

        const symbol1 = {
            angle: 90,
            type: "text",
            color: "white",
            text: "兰州",
            xoffset: 100,
            yoffset: 100, //3d地图不起作用
            font: {
                size: 12,
            },
        };

        const symbol2: any = {
            type: "point-3d",
            symbolLayers: [
                {
                    type: "icon",
                    size: 12,
                    resource: {
                        primitive: "square"
                    },
                    material: {
                        color: "orange"
                    },
                    outline: {
                        color: "white",
                        size: 1
                    }
                }
            ]
        };

        const graphicsLayer = new GraphicsLayer()
        const pointGraphic1 = new Graphic({
            geometry: point1,
            symbol: symbol1,
        });
        const pointGraphic2 = new Graphic({
            geometry: point1,
            symbol: symbol2,
        });
        graphicsLayer.add(pointGraphic2);
        graphicsLayer.add(pointGraphic1);
        map.add(graphicsLayer);

        const iconSymbol = {
            type: "point-3d", // autocasts as new PointSymbol3D()
            symbolLayers: [
                {
                    type: "icon", // autocasts as new IconSymbol3DLayer()
                    size: 12,
                    resource: {
                        primitive: "square"
                    },
                    material: {
                        color: "orange"
                    },
                    outline: {
                        color: "white",
                        size: 1
                    }
                }
            ]
        };

        const iconSymbolRenderer: any = {
            type: "simple",
            symbol: iconSymbol,
        };

        const labelClass = new LabelClass({
            symbol: {
                type: "label-3d",
                symbolLayers: [
                    {
                        type: "text",
                        material: {
                            color: "white"
                        },
                        size: 10
                    } as any
                ]
            },
            labelPlacement: "above-center",
            labelExpressionInfo: {
                expression: 'DefaultValue($feature.place, "no data")'
            }
        });
        const point = {
            type: "point",
            x: -74.00897626922108,
            y: 40.70374571999779,
            SpatialReference: 4326
        };
        const pointGraphic = new Graphic({
            geometry: point,
            attributes: {
                place: "兰州"
            }
        } as any);

        const featureLayer = new FeatureLayer({
            source: [pointGraphic],
            renderer: iconSymbolRenderer,
            outFields: ["place"],
            maxScale: 0,
            minScale: 0,
            fields: [{
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid"
            }, {
                name: "place",
                alias: "Place",
                type: "string"
            }],
            objectIdField: "ObjectID",
            geometryType: "point",
            labelingInfo: [labelClass]
        });
        map.add(featureLayer);

        view.on("click", function (e) {
            const geom = webMercatorUtils.xyToLngLat(e.mapPoint.x, e.mapPoint.y);
            console.log(geom[0], geom[1], e.mapPoint.x, e.mapPoint.y);
        });
    }, [])
    return <div className="lmap" id="map">

    </div>
};