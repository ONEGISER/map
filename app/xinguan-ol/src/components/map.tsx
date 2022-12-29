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
import { Overlay } from "ol";
import { Vector as VectorLayer } from 'ol/layer'
import { Fill, Style, Text, Stroke } from 'ol/style';
import React from "react";

const hostUrl = `http://xx.xx.xx.xx:8080`
const provinceLayer = "hpa3:china_province"
const xinguanLayer = "hpa3:xinguan2"
const workspaace = "hpa3"


export function getColors(color1: any, color2: any, colorLevel: number) {
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

export const colors = getColors({ r: 182, g: 215, b: 0 }, { r: 153, g: 51, b: 0 }, 20)

function getName(element: string) {
  return element.replace("市", "").replace("省", "").replace("壮族", "").replace("自治区", "").replace("回族", "").replace("维吾尔", "").replace("特别行政区", "").replace("土家族苗族自治州", "")
}


function getColor(value: number) {
  let color: any
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
  return color ? color : { r: 182, g: 215, b: 0 }
}



let _datas: any = {}
let _getColor: any = getColor

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
              const tempColor = _getColor(value)
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
function getStyle(feature: any) {
  const fillStyle = new Style({
    fill: new Fill({
      color: '#eeeeee',
    }),
    stroke: new Stroke({
      width: 1,
      color: '#fff',
    })
  });
  if (feature.values_) {
    const _name = feature.values_?.name
    const name = getName(_name)
    const value = _datas?.dataObj[name]
    const color = _getColor(value)
    const _color = [color.r, color.g, color.b, 0]
    fillStyle.getFill().setColor(_color);
  }
  return fillStyle;
}

function getHightStyle() {
  const color: any = { r: 0, g: 255, b: 255, a: 0.8 };
  const fillStyle = new Style({
    fill: new Fill({
      color: [color.r, color.g, color.b, color.a]
    }),
  });
  return fillStyle
}



export interface MapProps {
  dates?: string[]
  provinceUrl?: string
  xinguanUrl?: string
  tk?: string
  speed?: number
  mapOption?: {
    lng?: number
    lat?: number
    zoom?: number
  }
  getColor?: (value: number) => void
}

export interface MapState {
  obj?: any
  dates?: any[]
  provinces?: any[]
  currentDate?: string
  loading?: boolean
}
export class Map extends React.Component<MapProps, MapState>{
  vectorLayer: any
  map: any
  vectorSource: any
  isMapClick: boolean = true
  highFeature: any
  layerId = "xinguan"
  constructor(props: MapProps) {
    _getColor = props.getColor ? props.getColor : getColor
    super(props)
    this.state = {
      obj: null,
      dates: [],
      provinces: [],
      currentDate: undefined,
      loading: true
    }
  }

  componentDidMount(): void {
    const TdtUrl = 'https://t{0-7}.tianditu.gov.cn';
    const layer = "vec_w"
    const layer2 = "cva_w"
    const options = {
      source: new XYZ({
        url: `${TdtUrl}/DataServer?T=${layer}&x={x}&y={y}&l={z}&tk=${this.props.tk}`,
      })
    }
    const options2 = {
      source: new XYZ({
        url: `${TdtUrl}/DataServer?T=${layer2}&x={x}&y={y}&l={z}&tk=${this.props.tk}`,
      })
    }


    const { mapOption } = this.props

    const lng = mapOption?.lng ? mapOption?.lng : 104.555
    const lat = mapOption?.lat ? mapOption?.lat : 36.379
    const zoom = mapOption?.zoom ? mapOption?.zoom : 5


    const view = new View({
      center: transform([lng, lat], 'EPSG:4326', 'EPSG:3857'),
      zoom
    })

    this.map = new OlMap({
      target: 'map',
      layers: [
        new TileLayer(options),
        new TileLayer(options2),
      ],
      view
    });



    this.vectorSource = new VectorSource({
      url: this.getLayerUrl(),
      format: new GeoJSON(),
    })
    this.queryDatas()

    this.addPopup()
  }


  async queryDatas() {
    //查询所有的数据
    const url = this.getXinGuanLayerUrl()
    const datas = await (await fetch(url)).json()

    //查询所有的时间
    const dates = this.props.dates ? this.props.dates : this.queryDates(datas)
    //查询所有的省级行政区划
    const provinces = await this.queryProvinces()
    //构造数据
    const obj: { [key: string]: any } = {}
    datas?.features.forEach((element: any) => {
      const { properties } = element
      if (properties.date && !obj[properties.date]) {
        obj[properties.date] = {}
      }
      obj[properties.date][properties.name] = properties
    });
    let _currentDate = dates[dates.length - 1]
    _datas = this.getQzblDatas(_currentDate, dates, obj, provinces)
    this.addLayer(this.map)
    this.setState({
      loading: false,
      currentDate: _currentDate,
      provinces,
      dates,
      obj
    })
  }

  //查询所有的时间
  queryDates(datas: any) {
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

  async queryProvinces() {
    const url = this.getLayerUrl()
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

  getLayerUrl() {
    // const host = hostUrl + `/geoserver/${workspaace}/ows`
    // return `${host}?service=WFS&version=1.0.0&request=GetFeature&typeName=${provinceLayer}&&outputFormat=application/json`
    return this.props.provinceUrl ? this.props.provinceUrl : "/datas/province.json"
  }

  getXinGuanLayerUrl() {
    // const host = hostUrl + "/geoserver/wfs"
    // const cql_filter = `1=1`
    // const url = `${host}?service=WFS&version=1.1.0&cql_filter=${cql_filter}&request=GetFeature&typename=${xinguanLayer}&outputFormat=application/json&srsname=EPSG:3857`
    // return url
    return this.props.xinguanUrl ? this.props.xinguanUrl : "/datas/xinguan.json"
  }

  async addLayer(map: OlMap,) {
    const webglLayer = new WebGLLayer({
      source: this.vectorSource,
    });
    map.addLayer(webglLayer);


    this.vectorLayer = new VectorLayer({
      properties: { layerId: this.layerId },
      source: this.vectorSource,
      style: getStyle,
      opacity: 0.8
    });
    map.addLayer(this.vectorLayer);


    //标记图层
    const style = new Style({
      text: new Text({
        font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
        fill: new Fill({
          color: 'black',
        }),
      }),
    });

    const vectorSource2 = new VectorSource({
      url: this.getLayerUrl(),
      format: new GeoJSON(),
    })

    const labelLayer = new VectorLayer({
      declutter: true,
      source: vectorSource2,
      style: function (feature) {
        style.getText().setText(feature.get('name'));
        return style;
      },
    })
    this?.map.addLayer(labelLayer);
  }


  getDatas(date: string, index: string, dates?: string[], obj?: any, provinces?: any) {
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


  addPopup() {
    //获取弹窗dom
    const container: any = document.getElementById('popup');
    const content: any = document.getElementById('popup-content');
    const closer: any = document.getElementById('popup-closer');
    //构造弹窗
    const overlay = new Overlay({
      element: container,
      autoPan: true,
      positioning: 'bottom-center',
      stopEvent: false,
    } as any);
    //将弹窗添加到地图
    this.map.addOverlay(overlay);

    //关闭弹窗的方法
    const close = () => {
      //将弹窗位置置空
      overlay.setPosition(undefined);
      closer.blur();
      //隐藏弹窗
      content.style.display = "none"
      //通过延时处理，将弹窗游标打开
      setTimeout(() => {
        self.isMapClick = true
      }, 500);
      return false;
    }
    closer.onclick = function () {
      //将地图点击游标置为false，为了阻止弹窗再次被点击
      self.isMapClick = false
      //关闭弹窗
      close()
    };
    //存储this,方便监听中使用
    let self = this
    //地图点击的监听
    this.map.on('singleclick', async (e: any) => {
      //点击地图的位置
      const coordinate = e.coordinate;
      //状态存储的数据：当前时间和时间对应的数据对象
      const { currentDate, obj } = self.state
      //判断弹窗游标是否可用
      if (self.isMapClick) {
        //获取是否有要素被点击
        if (this.map.hasFeatureAtPixel(e.pixel)) {
          //获取点击获取到的要素
          const features = this.map.getFeaturesAtPixel(e.pixel, { hitTolerance: 1 });
          if (features && features[0]) {
            //取第一个要素的数据，将行政区名称记录下来
            const name = features[0]?.values_.name
            //判断当前的时间是否存在
            if (currentDate) {
              //获取当前时间的数据
              const data = obj[currentDate]
              const _name = getName(name)
              //获取当前选中行政区的的数据值
              const prop = data[_name]
              if (prop) {
                //显示弹窗的dom
                content.style.display = "block"
                //弹窗内容
                content.innerHTML = `
                  名称：${name}<br/>
                  日期：${prop.date}<br/>
                  新增确诊病例：${prop.xzqzbl}<br/>
                  累计确诊病例：${prop.ljqzbl}<br/>
                  累计死亡病例：${prop.ljzy}<br/>
                  累计治愈病例：${prop.ljsw}<br/>
                  `;
                //设置弹窗的位置为点击的地图位置
                overlay.setPosition(coordinate);
              }
            }
          }
        }
      } else {
        //如果游标不可用 关闭弹窗
        close()
      }
    });

    //移动鼠标的监听
    this.map.on('pointermove', function (evt: any) {
      //获取鼠标移入的要素
      const features = self.map.forEachFeatureAtPixel(evt.pixel, function (feature: any, layer: any) {
        return {
          feature: feature,
          layer: layer
        };
      });
      if (self.highFeature) {
        //还原鼠标之前移入要素的样式
        self.highFeature.setStyle(getStyle(self.highFeature))
        // self.highFeature = null
      }
      //当前图层
      const layer: any = features?.layer
      //如果是指定图层
      if (features && layer && layer?.values_.layerId === self.layerId) {
        //记录选中的高亮要素
        self.highFeature = features.feature;
        //将选中的要素高亮
        self.highFeature.setStyle(getHightStyle())
      }
    })
  }



  getSwblDatas(_currentDate?: string, dates?: string[], obj?: any, provinces?: any) {
    return _currentDate ? this.getDatas(_currentDate, "ljsw", dates, obj, provinces) : { datas: [] }
  }

  getQzblDatas(_currentDate?: string, dates?: string[], obj?: any, provinces?: any) {
    return _currentDate ? this.getDatas(_currentDate, "ljqzbl", dates, obj, provinces) : { datas: [] }
  }

  onChange(date: string) {
    const { dates, provinces, obj } = this.state
    this.setState({
      currentDate: date
    }, () => {
      _datas = this.getQzblDatas(date, dates, obj, provinces)
      this.vectorLayer?.getSource().changed()
    })
  }

  render(): React.ReactNode {
    const { currentDate, loading, dates, provinces, obj } = this.state
    const swblDatas = this.getSwblDatas(currentDate, dates, obj, provinces)
    const qzblDatas = this.getQzblDatas(currentDate, dates, obj, provinces)
    const height = 40
    const width = 400


    return <Row style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
      <div id="popup" className="ol-popup">
        <a href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div id="popup-content"></div>
      </div>
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
            {dates && dates.length > 0 && <Play speed={this.props.speed} dates={dates} currentDate={currentDate} onChange={this.onChange.bind(this)} />}
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
  }
};