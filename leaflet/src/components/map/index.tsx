import "leaflet/dist/leaflet.css"
import { useEffect, useState } from 'react';
import L, { LatLng } from "leaflet"
import axios from "axios";
import logo from "./img/logo.png"
import { AutoComplete, Input } from "antd";
import "antd/dist/antd.css"
interface QueryResults {
    type: "route" | "station",
    name: string
    data: any
}
export const Map = () => {
    const [routerData, setRouterData] = useState<any>(undefined);
    const [stationData, setStationData] = useState<any>(undefined);
    const [queryResults, setQueryResults] = useState<QueryResults[]>([]);

    const routerName = "路线"
    const statitonName = "站点"

    useEffect(() => {
        getDatas((routerData: any, stationData: any) => {
            const routerLayer = L.geoJSON(routerData, {
                style: (feature: any) => {
                    const weight = 4
                    const fill = false
                    switch (feature.properties.LineName) {
                        case '轨道交通1号线': return { color: "#3080b7", weight, fill };
                        case '轨道交通2号线': return { color: "#eb81b9", weight, fill };
                        case '轨道交通3号线': return { color: "#dac17d", weight, fill };
                        case '轨道交通4号线': return { color: "#86b81c", weight, fill };
                        case '轨道交通5号线': return { color: "#0000ff", weight, fill };
                        case '轨道交通6号线': return { color: "#018237", weight, fill };
                        case '轨道交通7号线': return { color: "#ee782e", weight, fill };
                        case '轨道交通8号线': return { color: "#99adac", weight, fill };
                        case '轨道交通11号线': return { color: "#fcd600", weight, fill };
                        case '轨道交通21号线(阳逻线)': return { color: "#d10195", weight, fill };
                    }
                }
            } as any).bindPopup(function (layer: any) {
                const properties = layer.feature.properties
                return `<div style="font-weight:bold;">${properties.LineName}</div>始发站：${properties.From}<br/>终点站：${properties.To}`;
            })
            const stationDataLayer = L.geoJSON(stationData, {
                pointToLayer: (feature: any, latlng: LatLng) => {
                    const label = String(feature.properties.StationNam)
                    return new L.CircleMarker(latlng, {
                        radius: 4,
                        color: "#fff",
                    }).bindTooltip(label, { opacity: 0.7, direction: "top" })
                    // const label = String(feature.properties.StationNam) // Must convert to string, .bindTooltip can't use straight 'feature.properties.attribute'
                    //.bindTooltip(label, { permanent: true, opacity: 0.7 }).openTooltip();
                }
            } as any)
            const overLayers = {
                "路线": routerLayer,
                "站点": stationDataLayer
            };
            createMap(overLayers)
            setRouterData(routerData)
            setStationData(stationData)
        })
    }, [])




    function getDatas(success: (routerData: any, stationData: any) => void) {
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


    function addMarkers(map: any, name: string) {
        var myIcon = L.divIcon({
            html: name,
            className: 'my-div-icon',
            iconSize: 30
        } as any);
        L.marker([30.5749, 114.2946], { icon: myIcon }).addTo(map)
    }

    function createMap(overLayers?: any) {
        const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"]
        const key = Keys.tdt
        const attribution = '&copy; <a href="https://www.tianditu.gov.cn/">天地图</a> 提供地图'
        const opacity = 1
        const imgLayer = L.tileLayer("http://t{s}.tianditu.com/img_c/wmts?layer=img&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 17,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            attribution,
            opacity
        })
        const imgLabelLayer = L.tileLayer("http://t{s}.tianditu.com/cia_c/wmts?layer=cia&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 17,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            opacity
        })

        const vecLayer = L.tileLayer("http://t{s}.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 17,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            attribution,
            opacity
        })
        const vecLabelLayer = L.tileLayer("http://t{s}.tianditu.com/cva_c/wmts?layer=cva&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=" + key, {
            maxZoom: 17,
            tileSize: 256,
            zoomOffset: 1,
            subdomains,
            opacity
        })
        const layers = [vecLayer, vecLabelLayer,]
        if (overLayers && overLayers[routerName] && overLayers[statitonName]) {
            layers.push(overLayers[routerName], overLayers[statitonName])
        }

        const defaultLayers = L.layerGroup(layers)

        const map = L.map('map', {
            crs: L.CRS.EPSG4326,
            zoomControl: false,
            attributionControl: true,
            layers: [defaultLayers] as any
        }).setView([MapCenterPoint.y, MapCenterPoint.x], MapCenterPoint.z);

        const baseLayers = {
            "矢量": defaultLayers,
            "影像": L.layerGroup([imgLayer, imgLabelLayer])
        };
        const layerControl = L.control.layers(baseLayers, overLayers);
        map.addControl(layerControl);

        require("./map.css")

        //缩放控件
        const zoom = L.control.zoom({ position: "bottomright" })
        map.addControl(zoom)
        //比例尺
        const scale = L.control.scale({ position: "bottomleft" })
        map.addControl(scale)
    }

    function handleSearch(value: string) {
        const datas: QueryResults[] = []
        if (stationData && stationData.features) {
            for (let i in stationData.features) {
                const feature = stationData.features[i]
                if (feature.properties.StationNam?.indexOf(value) > -1) {
                    datas.push({
                        type: "station",
                        data: feature,
                        name: feature.properties.StationNam
                    })
                }
            }
        }
        setQueryResults(datas)
    }


    function renderOptions() {
        return queryResults.map((data) => {
            return {
                value: data.name,
                label: (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>
                            {/* Found {query} on{' '} */}
                            <a
                                // href={`https://s.taobao.com/search?q=${query}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {data.name}
                            </a>
                        </span>
                        {/* <span>{getRandomInt(200, 100)} results</span> */}
                    </div>
                ),
            };
        });
    }



    return <div style={{ height: "100%", width: "100%", position: "absolute" }}>
        <div className="lmap" id="map">

        </div>
        <div style={{ position: "absolute", left: 10, top: 10 }}>
            <img style={{ height: 100, zIndex: 10 }} src={logo} />
        </div>
        <div style={{ position: "absolute", right: 80, top: 10 }}>
            <AutoComplete
                dropdownMatchSelectWidth={252}
                style={{ width: 340, height: 44 }}
                options={renderOptions()}
                // onSelect={onSelect}
                onSearch={handleSearch}
            >

                <Input.Search style={{ height: "100%" }} bordered size="large" placeholder="请输入关键词查询地铁线路或站点" enterButton />
            </AutoComplete>
        </div>
    </div>
};