import "./map.css"
import "ol/ol.css"
import { useEffect, useState } from "react";
import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON';
import Layer from 'ol/layer/Layer';
import VectorSource from 'ol/source/Vector';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer';
import { packColor } from 'ol/renderer/webgl/shaders';
import { Chart } from "./chart";
import { Col, Row, Spin } from "antd";
import { Play } from "./play";

export const GradeColors: { [key: string]: string } = {
  '优': '#33cc33',
  '良': '#60fae7',
  '中': "#dfed73",
  '次': "#ffc691",
  '差': "#f95302",
  '无': "#fde981"


}
const hostUrl = `http://xx.xx.xx.xx:8080`
const provinceLayer = "hpa3:china_province"
const xinguanLayer = "hpa3:xinguan2"
const workspaace = "hpa3"
const tk = "你的key"


function getColors(color1: any, color2: any, colorLevel: number) {
  let colors = [];
  //默认的最深颜色 
  let red = color1.r, green = color1.g, blue = color1.b, a = color1.a ? color1.a : 1;
  //最浅颜色是239,239,239 比如：最浅颜色的red是 239 则差值为239-134=105 
  let maxRed = color2.r - red, maxGreen = color2.g - green, maxBlue = color2.b - blue;
  let level = colorLevel;
  while (level--) {
    colors.push({ r: red, g: green, b: blue, a });
    red += parseInt((maxRed / colorLevel).toString());
    green += parseInt((maxGreen / colorLevel).toString());
    blue += parseInt((maxBlue / colorLevel).toString());
  }
  return colors;
}

const colors = getColors({ r: 182, g: 215, b: 0 }, { r: 153, g: 51, b: 0 }, 20)

function getName(element: string) {
  return element.replace("市", "").replace("省", "").replace("壮族", "").replace("自治区", "").replace("回族", "").replace("维吾尔", "").replace("特别行政区", "")
}

function getColor(value: number) {
  let color
  if (value > 10000) {
    color = { r: 255, g: 0, b: 0 }
  } else if (value > 5000) {
    color = { r: 255, g: 0, b: 51 }
  } else if (value > 2000) {
    color = { r: 255, g: 0, b: 102 }
  } else {
    const index = parseInt((value / 100).toString())
    color = colors[index]
  }
  return color
}

let _datas: any = {}
export class WebGLLayer extends Layer {
  createRenderer(): any {
    let self: any = this
    return new WebGLVectorLayerRenderer(this, {
      fill: {
        attributes: {
          color: function (feature: any) {
            let color: any = { r: 238, g: 238, b: 238 };
            if (feature.values_) {
              const _name = feature.values_?.name
              const name = getName(_name)
              const value = _datas?.dataObj[name]
              const tempColor = getColor(value)
              if (tempColor) {
                color = tempColor
              }
            }
            const _color = [color.r, color.g, color.b, 1]
            return packColor(_color);
          },
          opacity: function () {
            return 0.6;
          },
        },
      },
      stroke: {
        attributes: {
          width: function () {
            return 1;
          },
          opacity: function () {
            return 1;
          },
        },
      },
    }) as any
  }
}


let vectorLayer: any
let map: any
let vectorSource: any
const view = new View({
  center: transform([104.555, 36.379], 'EPSG:4326', 'EPSG:3857'),
  zoom: 5
})
export const Map = () => {
  const [obj, setObj] = useState<any>(null)
  const [dates, setDates] = useState<any>([])
  const [provinces, setProvince] = useState<any>([])
  const [currentDate, setCurrentDate] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const TdtUrl = 'https://t{0-7}.tianditu.gov.cn';
    const layer = "vec_w"
    const layer2 = "cva_w"
    const options = {
      source: new XYZ({
        url: `${TdtUrl}/DataServer?T=${layer}&x={x}&y={y}&l={z}&tk=${tk}`,
      })
    }
    const options2 = {
      source: new XYZ({
        url: `${TdtUrl}/DataServer?T=${layer2}&x={x}&y={y}&l={z}&tk=${tk}`,
      })
    }
    map = new OlMap({
      target: 'map',
      layers: [
        new TileLayer(options),
        new TileLayer(options2),
      ],
      view
    });


    vectorSource = new VectorSource({
      url: getLayerUrl(),
      format: new GeoJSON(),
    })
    queryDatas()
  }, [])


  async function queryDatas() {
    //查询所有的数据
    const url = getXinGuanLayerUrl()
    const datas = await (await fetch(url)).json()
    console.log(datas);

    //查询所有的时间
    const dates = queryDates(datas)
    //查询所有的省级行政区划
    const provinces = await queryProvinces()
    //构造数据
    const obj: { [key: string]: any } = {}
    datas?.features.forEach((element: any) => {
      const { properties } = element
      if (properties.date && !obj[properties.date]) {
        obj[properties.date] = {}
      }
      obj[properties.date][properties.name] = properties
    });
    setObj(obj)
    setDates(dates)
    setProvince(provinces)
    let _currentDate = dates[dates.length - 1]
    setCurrentDate(_currentDate)
    _datas = getQzblDatas(_currentDate, dates, obj, provinces)
    addLayer(map)
    setLoading(false)
  }

  //查询所有的时间
  function queryDates(datas: any) {
    const dates: string[] = []
    if (datas.features) {
      datas.features.forEach((data: any) => {
        if (data.properties?.date) {
          dates.push(data.properties?.date)
        }
      })
    }
    return Array.from(new Set(dates)).sort()
  }

  async function queryProvinces() {
    const url = getLayerUrl()
    const provinces: string[] = []
    const datas = await (await fetch(url)).json()
    datas?.features.forEach((data: any) => {
      if (data.properties?.name) {
        const element = data.properties?.name
        const key = getName(element)
        provinces.push(key)
      }
    })
    return provinces
  }

  function getLayerUrl() {
    // const host = hostUrl + `/geoserver/${workspaace}/ows`
    // return `${host}?service=WFS&version=1.0.0&request=GetFeature&typeName=${provinceLayer}&&outputFormat=application/json`
    return "/province.json"
  }

  function getXinGuanLayerUrl() {
    // const host = hostUrl + "/geoserver/wfs"
    // const cql_filter = `1=1`
    // const url = `${host}?service=WFS&version=1.1.0&cql_filter=${cql_filter}&request=GetFeature&typename=${xinguanLayer}&outputFormat=application/json&srsname=EPSG:3857`
    // return url
    return "/xinguan.json"
  }

  async function addLayer(map: OlMap,) {
    vectorLayer = new WebGLLayer({
      source: vectorSource,
    });
    map.addLayer(vectorLayer);
  }


  function getDatas(date: string, index: string, dates?: string[], obj?: any, provinces?: any) {
    const datas: number[] = []
    const dataObj: { [key: string]: string } = {}
    if (date && obj && dates && dates.length > 0 && provinces.length > 0) {
      if (obj[date]) {
        const temp = obj[date]
        provinces.forEach((key: any) => {
          if (temp[key]) {
            const data = temp[key][index]
            datas.push(data)
            dataObj[key] = data
          }
        });
      }
    }
    return { datas, dataObj }
  }


  function getSwblDatas(_currentDate?: string, dates?: string[], obj?: any, provinces?: any) {
    return _currentDate ? getDatas(_currentDate, "ljsw", dates, obj, provinces) : { datas: [] }
  }

  function getQzblDatas(_currentDate?: string, dates?: string[], obj?: any, provinces?: any) {
    return _currentDate ? getDatas(_currentDate, "ljqzbl", dates, obj, provinces) : { datas: [] }
  }

  function onChange(date: string) {
    setCurrentDate(date)
    _datas = getQzblDatas(date, dates, obj, provinces)
    vectorLayer?.getSource().changed()
  }

  const swblDatas = getSwblDatas(currentDate, dates, obj, provinces)
  const qzblDatas = getQzblDatas(currentDate, dates, obj, provinces)
  const height = 40
  const width = 400
  return <Row style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
    <Col style={{ width: `calc(100% - ${width}px)`, height: "100%", position: "relative" }}>
      <div className="lmap" id="map">

      </div>
      <Row justify={"center"} style={{ width: "100%", position: "absolute", top: 10, }}>
        <h1 style={{ backgroundColor: "#fff", padding: 10 }}>累计确诊病例</h1>
      </Row>
    </Col>
    <Col style={{ width, height: "100%" }}>
      <div style={{ width: "100%", height: "100%", padding: 10 }}>
        <div style={{ width: "100%", height }}>
          {dates.length > 0 && <Play dates={dates} currentDate={currentDate} onChange={onChange} />}
        </div>
        <div style={{ width: "100%", height: `calc(100% - ${height}px)` }}>
          <div style={{ width: "100%", height: "50%" }}>
            {currentDate && <Chart name={"累计确诊病例"} data={qzblDatas?.datas} time={currentDate} yAxisDatas={provinces} color={"orange"} />}
          </div>
          <div style={{ width: "100%", height: "50%" }}>
            {currentDate && <Chart name={"累计死亡病例"} data={swblDatas?.datas} time={currentDate} yAxisDatas={provinces} color={"red"} />}
          </div>
        </div>
      </div>
    </Col>
    <Spin spinning={loading} tip={"正在加载数据......"} style={{ position: "absolute", top: "45%", left: "48%" }}>

    </Spin>
  </Row >
};