import "leaflet/dist/leaflet.css"
import { useEffect, useState } from 'react';
import L, { LatLng } from "leaflet"
import axios from "axios";
import logo from "./img/logo.png"
import { AutoComplete, Col, Input, Row } from "antd";
import "antd/dist/antd.css"
interface QueryResults {
    type: "route" | "station",
    name: string
    data: any
}
let map: L.Map
let queryShowLayer: L.GeoJSON//全局查询高亮图层
const weight = 4//线的宽度
export const MapCenterPoint = {
    x: 114.316200103,
    y: 30.5810841269,
    z: 10
}
const tk="0b79a07d2808103ab84aa56485c331a8"
//路线颜色
const colors: { [key: string]: any } = {
    '轨道交通1号线': { color: "#3080b7", weight, },
    '轨道交通2号线': { color: "#eb81b9", weight, },
    '轨道交通3号线': { color: "#dac17d", weight, },
    '轨道交通4号线': { color: "#86b81c", weight, },
    '轨道交通5号线': { color: "#0000ff", weight, },
    '轨道交通6号线': { color: "#018237", weight, },
    '轨道交通7号线': { color: "#ee782e", weight, },
    '轨道交通8号线': { color: "#99adac", weight, },
    '轨道交通11号线': { color: "#fcd600", weight, },
    '轨道交通21号线(阳逻线)': { color: "#d10195", weight },
}
export const Map = () => {
    const [routerData, setRouterData] = useState<any>(undefined);
    const [stationData, setStationData] = useState<any>(undefined);
    const [routeResults, setRouteResults] = useState<QueryResults[]>([]);
    const [stationResults, setStationResults] = useState<QueryResults[]>([]);
    const routerNameKey = "路线"
    const statitonNameKey = "站点"
    function getDIVContent(properties: any) {
        //路线信息
        return `<div style="font-weight:bold;">${properties.LineName}</div>始发站：${properties.From}<br/>终点站：${properties.To}`;
    }

    useEffect(() => {
        //从GEOJSON获取数据
        getDatas((routerData: any, stationData: any) => {
            //路线图层
            const routerLayer = L.geoJSON(routerData, {
                style: (feature: any) => {
                    return colors[feature.properties.LineName]//根据名称设置样式
                }
            } as any).bindPopup(function (layer: any) {
                const properties = layer.feature.properties
                return getDIVContent(properties)//设置气泡内容
            })
            //站点图层
            const stationDataLayer = L.geoJSON(stationData, {
                pointToLayer: (feature: any, latlng: LatLng) => {
                    const label = String(feature.properties.StationNam)
                    return new L.CircleMarker(latlng, {
                        radius: 4,
                        color: "#fff",
                    }).bindTooltip(label, { opacity: 0.7, direction: "top" })
                }
            } as any)
            const overLayers = {
                "路线": routerLayer,
                "站点": stationDataLayer
            };
            //创建地图
            createMap(overLayers)
            //保存数据
            setRouterData(routerData)
            setStationData(stationData)
        })
    }, [])




    function getDatas(success: (routerData: any, stationData: any) => void) {
        //查询数据
        axios.get("/datas/router.geojson").then((response) => {
            if (response.data) {
                const data = response.data
                axios.get("/datas/station.geojson").then((response) => {
                    if (response.data) {
                        success(data, response.data)
                    }
                })
            }
        })
    }

    function createMap(overLayers?: any) {
        const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"]
        const key = Keys.tdt
        const attribution = '&copy; <a href="https://www.tianditu.gov.cn/">天地图</a> 提供地图'
        const opacity = 0.5

        //天地图影像
        const imgLayer = L.tileLayer("http://t{s}.tianditu.com/img_c/wmts?layer=img&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 17,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            attribution,
            opacity
        })

        //天地图影像标注
        const imgLabelLayer = L.tileLayer("http://t{s}.tianditu.com/cia_c/wmts?layer=cia&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 17,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            opacity
        })

        //天地图矢量
        const vecLayer = L.tileLayer("http://t{s}.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 17,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            attribution,
            opacity
        })

        //天地图矢量标注
        const vecLabelLayer = L.tileLayer("http://t{s}.tianditu.com/cva_c/wmts?layer=cva&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 17,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            opacity
        })

        //初始化图层
        const layers = [vecLayer, vecLabelLayer,]
        if (overLayers && overLayers[routerNameKey] && overLayers[statitonNameKey]) {
            layers.push(overLayers[routerNameKey], overLayers[statitonNameKey])
        }

        const defaultLayers = L.layerGroup(layers)

        //构造地图
        map = L.map('map', {
            crs: L.CRS.EPSG4326,
            zoomControl: false,
            attributionControl: true,
            layers: [defaultLayers] as any
        }).setView([MapCenterPoint.y, MapCenterPoint.x], MapCenterPoint.z);

        //构造图层列表
        const baseLayers = {
            "矢量": defaultLayers,
            "影像": L.layerGroup([imgLayer, imgLabelLayer])
        };
        const layerControl = L.control.layers(baseLayers, overLayers);
        map.addControl(layerControl);

        //导入样式
        require("./map.css")

        //缩放控件
        const zoom = L.control.zoom({ position: "bottomright" })
        map.addControl(zoom)
        //比例尺
        const scale = L.control.scale({ position: "bottomleft" })
        map.addControl(scale)
    }

    function handleSearch(value: string) {
        //搜索逻辑
        const routerR: QueryResults[] = []
        if (value && routerData && routerData.features) {
            for (let i in routerData.features) {
                const feature = routerData.features[i]
                if (feature.properties.LineName?.indexOf(value) > -1) {
                    routerR.push({
                        type: "route",
                        data: feature,
                        name: feature.properties.LineName
                    })
                }
            }
        }
        setRouteResults(routerR)

        const stationR: QueryResults[] = []
        if (value && stationData && stationData.features) {
            for (let i in stationData.features) {
                const feature = stationData.features[i]
                if (feature.properties.StationNam?.indexOf(value) > -1) {
                    stationR.push({
                        type: "station",
                        data: feature,
                        name: feature.properties.StationNam
                    })
                }
            }

        }
        setStationResults(stationR)
        if (!value) {
            //移除高亮图层
            queryShowLayer?.remove()
        }
    }

    function onSelect(value: string, option: any) {
        queryShowLayer?.remove() //移除高亮图层
        if (option?.data?.data) {
            const feature = option?.data?.data
            if (feature) {
                if (option.data.type === "station") {
                    //高亮点构造
                    queryShowLayer = L.geoJSON(
                        {
                            "type": "FeatureCollection",
                            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
                            "features": [feature]
                        } as any, {
                            pointToLayer: (feature: any, latlng: LatLng) => {
                                const label = String(feature.properties.StationNam)
                                return new L.CircleMarker(latlng, {
                                    radius: 5,
                                    color: "#00FFFF",
                                }).bindTooltip(label, { opacity: 1, direction: "top", permanent: true, }).openTooltip()
                                // const label = String(feature.properties.StationNam) // Must convert to string, .bindTooltip can't use straight 'feature.properties.attribute'
                                //.bindTooltip(label, { permanent: true, opacity: 0.7 }).openTooltip();
                            }
                        } as any)
                    map.addLayer(queryShowLayer)
                    map.flyToBounds(queryShowLayer.getBounds())//飞至范围
                } else if (option.data.type === "route") {
                    //添加查询图层
                    queryShowLayer = L.geoJSON()
                    map.addLayer(queryShowLayer)
                    queryShowLayer.addData(feature)
                    queryShowLayer.setStyle({
                        color: "#00FFFF",
                        weight: 5
                    })
                    queryShowLayer.bindPopup(getDIVContent(feature.properties)).openPopup()//打开标注
                    map.flyToBounds(queryShowLayer.getBounds())//飞至范围
                }
            }
        }
    }


    function renderOptions() {
        //搜索选项UI
        const options: any[] = []
        const routers = {
            label: "路线",
            options: routeResults.map((data, i) => {
                return {
                    value: data.name,
                    data,
                    label: (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span>
                                <a

                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {data.name}
                                </a>
                            </span>
                            <span>{data.data.properties.From}-{data.data.properties.To}</span>
                        </div>
                    ),
                };
            })
        }
        if (routeResults.length > 0) {
            options.push(routers)
        }
        const stations = {
            label: "站点",
            options: stationResults.map((data, i) => {
                return {
                    value: data.name,
                    data,
                    label: (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {data.name}
                                </a>
                            </span>
                        </div>
                    ),
                };
            })
        }
        if (stationResults.length > 0) {
            options.push(stations)
        }
        return options
    }

    function renderLegend() {
        //图例UI
        const backgroundColor = `rgba(255,255,255,0.85)`
        const jsxs = []
        for (let i in colors) {
            const jsx = <Row justify="center" align="middle" style={{ padding: 10 }}>
                <Col>
                    <Row justify="center">
                        <div style={{ width: 30, height: 5, background: colors[i].color, paddingRight: 20 }}></div>
                    </Row>
                    <Row justify="center" style={{ textAlign: "center" }}>
                        {i}
                    </Row>
                </Col>
            </Row>
            jsxs.push(jsx)
        }
        return <Row justify="center" style={{ backgroundColor }}>
            {jsxs}
        </Row>
    }

    return <div style={{ height: "100%", width: "100%", position: "absolute" }}>
        {/* 地图容器 */}
        <div className="lmap" id="map">

        </div>
        {/* logo容器 */}
        <div style={{ position: "absolute", left: 10, top: 10, zIndex: 1000 }}>
            <img style={{ height: 100, zIndex: 10 }} src={logo} />
        </div>
        {/* 搜索容器 */}
        <div style={{ position: "absolute", right: 80, top: 10, zIndex: 1000 }}>
            <AutoComplete
                dropdownMatchSelectWidth={252}
                style={{ width: 300, height: 44 }}
                options={renderOptions()}
                onSelect={onSelect}
                onSearch={handleSearch}
            >

                <Input.Search style={{ height: "100%" }} bordered size="large" placeholder="请输入地铁线路或站点名称" enterButton />
            </AutoComplete>
        </div>
        {/* 图例容器 */}
        <Row justify="center" style={{ position: "absolute", width: "100%", bottom: 10, zIndex: 1000 }}>
            {renderLegend()}
        </Row>
    </div>
};