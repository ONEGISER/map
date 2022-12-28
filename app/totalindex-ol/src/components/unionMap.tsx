import "./unionMap.less"
import React from "react";
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
import { ChartShow } from "./chartShow";
import { Col, Modal, Row, Spin } from "antd";
import { PlayButton } from "./playButton";
import { Vector as VectorLayer } from 'ol/layer'
import { Fill, Style, Text, Stroke } from 'ol/style';
import { Typography } from 'antd';

const { Title } = Typography;

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
  return color ? color : { r: 0, g: 51, b: 255 }
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
              const name = feature.values_?.name
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
    const name = feature.values_?.name
    const value = _datas?.dataObj[name]
    const color = _getColor(value)
    const _color = [color.r, color.g, color.b, 0]
    fillStyle.getFill().setColor(_color);
  }
  return fillStyle;
}

function getHightStyle() {
  const color: any = { r: 255, g: 255, b: 0, a: 0.5 };
  const fillStyle = new Style({
    fill: new Fill({
      color: [color.r, color.g, color.b, color.a]
    }),
  });
  return fillStyle
}



export interface UnionMapProps {
  years?: string[]
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

export interface UnionMapState {
  years?: any[]
  //区划
  regions?: any[]
  //地区生产总值
  dqsczzObj?: any
  //城市园林绿化
  csyllhObj?: any
  //建筑用地
  jzydObj?: any
  //经济数据
  techObj?: any
  //人口数据
  popuObj?: any
  currentYear?: string
  loading?: boolean
  //当前数据
  showObj?: any
}


const popuUrl = "/data/人口.json"
const techUrl = "/data/经济.json"
const dqsczzUrl = "/data/地区生产总值.json"
const csyllhUrl = "/data/城市园林绿化.json"
const jzydUrl = "/data/建筑用地.json"
const regionUrl = "/data/重庆市.json"

const popuRegionStr = "Field19"
const popuYearStr = "Field1"
const techRegionStr = "Field14"
const techYearStr = "Field1"
const bussRegionStr = "Field1"
const bussYearStr = "Field3"


const dqsczzYFields = ["地区生产总值(亿元)", "第二产业增加值(亿元)", "工业增加值(亿元)", "建筑业增加值(亿元)", "交通运输、仓储和邮政业增加值(亿元)", "住宿和餐饮业增加值(亿元)", "金融业增加值(亿元)", "房地产业增加值(亿元)", "其他行业增加值(亿元)", "第三产业增加值(亿元)", "第一产业增加值(亿元)", "批发和零售业增加值(亿元)"]
const csyllhYFields = ["公共绿地面积(公顷)", "绿化覆盖面积(公顷)", "建成区绿化覆盖面积(公顷)", "园林绿地面积(公顷)", "建成区园林绿地面积(公顷)", "动物园、公园面积(公顷)"]
const jzydYFields = ["建成区面积(平方公里)", "建设用地面积(平方公里)", "居住用地(平方公里)", "公共管理与公共服务用地(平方公里)", "工业用地(平方公里)", "交通设施用地(平方公里)", "公用设施用地(平方公里)", "绿地(平方公里)", "物流仓储用地(平方公里)", "商业服务业设施用地(平方公里)"]

export class UnionMap extends React.Component<UnionMapProps, UnionMapState>{
  vectorLayer: any
  map: any
  vectorSource: any
  isMapClick: boolean = true
  highFeature: any
  layerId = "union"
  constructor(props: UnionMapProps) {
    _getColor = props.getColor ? props.getColor : getColor
    super(props)
    this.state = {
      popuObj: null,
      techObj: null,
      jzydObj: null,
      csyllhObj: null,
      years: [],
      regions: [],
      currentYear: undefined,
      loading: true,
      showObj: null
    }
  }

  componentDidMount(): void {
    const { mapOption } = this.props
    const lng = mapOption?.lng ? mapOption?.lng : 107.9038//106.5521,29.6418
    const lat = mapOption?.lat ? mapOption?.lat : 30.1223
    const zoom = mapOption?.zoom ? mapOption?.zoom : 8

    const view = new View({
      center: transform([lng, lat], 'EPSG:4326', 'EPSG:3857'),
      zoom
    })

    //构造地图

    this.map = new OlMap({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view
    });



    this.vectorSource = new VectorSource({
      url: regionUrl,
      format: new GeoJSON(),
    })
    this.queryDatas()

    this.addMapLisener()
  }


  async queryDatas() {
    //查询人口数据
    const datas = await (await fetch(popuUrl)).json()
    //获取所有的年份
    const years = this.queryDates(datas)
    const regions: string[] = ["沙坪坝区", "南岸区", "九龙坡区", "大渡口区", "江北区", "北碚区", "渝中区", "渝北区", "巴南区"] //await this.queryRegions() //获取所有的行政区划
    //构造人口数据
    const popuObj: { [key: string]: any } = {}
    datas?.features.forEach((element: any) => {
      const { properties } = element
      if (properties[popuYearStr] && !popuObj[properties[popuYearStr]]) {
        popuObj[properties[popuYearStr]] = {}
      }
      popuObj[properties[popuYearStr]][properties[popuRegionStr]] = properties
    });
    let _currentYear = years[years.length - 1]
    _datas = this.getTempDatas(_currentYear, years, popuObj, regions)


    //查询经济数据
    const techdatas = await (await fetch(techUrl)).json()
    //构造经济数据
    const techObj: { [key: string]: any } = {}
    techdatas?.features.forEach((element: any) => {
      const { properties } = element
      if (properties[techYearStr] && !techObj[properties[techYearStr]]) {
        techObj[properties[techYearStr]] = {}
      }
      techObj[properties[techYearStr]][properties[techRegionStr]] = properties
    });

    //查询地区生产总值数据
    const dqsczzDatas = await (await fetch(dqsczzUrl)).json()
    const dqsczzObj: { [key: string]: any } = {}
    dqsczzDatas?.features.forEach((element: any) => {
      const { properties } = element
      if (properties[bussYearStr] && !dqsczzObj[properties[bussYearStr]]) {
        dqsczzObj[properties[bussYearStr]] = {}
      }
      dqsczzObj[properties[bussYearStr]][properties[bussRegionStr]] = properties
    });


    //查询城市园林绿化数据
    const csyllhDatas = await (await fetch(csyllhUrl)).json()
    const csyllhObj: { [key: string]: any } = {}
    csyllhDatas?.features.forEach((element: any) => {
      const { properties } = element
      if (properties[bussYearStr] && !csyllhObj[properties[bussYearStr]]) {
        csyllhObj[properties[bussYearStr]] = {}
      }
      csyllhObj[properties[bussYearStr]][properties[bussRegionStr]] = properties
    });


    //查询建筑用地数据
    const jzydDatas = await (await fetch(jzydUrl)).json()
    const jzydObj: { [key: string]: any } = {}
    jzydDatas?.features.forEach((element: any) => {
      const { properties } = element
      if (properties[bussYearStr] && !jzydObj[properties[bussYearStr]]) {
        jzydObj[properties[bussYearStr]] = {}
      }
      jzydObj[properties[bussYearStr]][properties[bussRegionStr]] = properties
    });


    this.addLayer(this.map)
    this.setState({
      loading: false,
      currentYear: _currentYear,
      regions,
      years,
      popuObj,
      techObj,
      jzydObj,
      csyllhObj,
      dqsczzObj
    })
  }

  //查询所有的时间
  queryDates(datas: any) {
    const years: string[] = []
    if (datas.features) {
      datas.features.forEach((data: any) => {
        if (data.properties[popuYearStr]) {
          years.push(data.properties[popuYearStr])
        }
      })
    }
    return Array.from(new Set(years)).sort()
  }

  async queryRegions() {
    const url = regionUrl
    const regions: string[] = []
    const datas = await (await fetch(url)).json()
    datas?.features.forEach((data: any) => {
      if (data.properties?.name) {
        const element = data.properties?.name
        regions.push(element)
      }
    })
    return regions
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
        font: 'bold 10px "Open Sans", "Arial Unicode MS", "sans-serif"',
        fill: new Fill({
          color: 'red',
        }),
      }),
    });

    const vectorSource2 = new VectorSource({
      url: regionUrl,
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


  getDatas(date: string, index: string, years?: string[], obj?: any, regions?: any) {
    const datas: number[] = []
    const dataObj: { [key: string]: string } = {}
    if (date && obj && years && years.length > 0 && regions.length > 0) {
      if (obj[date]) {
        const temp = obj[date]
        regions.forEach((key: any) => {
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


  addMapLisener() {
    let self = this
    this.map.on('singleclick', async (e: any) => {
      const coordinate = e.coordinate;
      const { currentYear, popuObj, techObj } = self.state
      if (self.isMapClick) {
        if (this.map.hasFeatureAtPixel(e.pixel)) {
          const features = this.map.getFeaturesAtPixel(e.pixel, { hitTolerance: 1 });
          if (features && features[0]) {
            const name = features[0]?.values_.name
            if (currentYear) {
              const popuData = popuObj[currentYear]
              const popu = popuData[name]
              const techData = techObj[currentYear]
              const tech = techData[name]
              if (popu) {
                self.setState({
                  showObj: {
                    popu,
                    tech,
                    name,
                    year: currentYear
                  }
                })
              }
            }
          }
        }
      }
    });

    this.map.on('pointermove', function (evt: any) {
      const features = self.map.forEachFeatureAtPixel(evt.pixel, function (feature: any, layer: any) {
        return {
          feature: feature,
          layer: layer
        };
      });
      if (self.highFeature) {
        self.highFeature.setStyle(getStyle(self.highFeature))
      }
      const layer: any = features?.layer
      if (features && layer && layer?.values_.layerId === self.layerId) {
        self.highFeature = features.feature;
        self.highFeature.setStyle(getHightStyle())
      }
    })
  }

  getTempDatas(_currentYear?: string, years?: string[], obj?: any, regions?: any) {
    return _currentYear ? this.getDatas(_currentYear, "Field2", years, obj, regions) : { datas: [] }
  }

  onChange(year: string) {
    const { years, regions, popuObj } = this.state
    this.setState({
      currentYear: year
    }, () => {
      _datas = this.getTempDatas(year, years, popuObj, regions)
      this.vectorLayer?.getSource().changed()
    })
  }

  onCancle() {
    this.setState({
      showObj: null
    })
  }


  renderItem(name: string, value: string) {
    return <Row style={{ width: "100%", padding: 2 }}>
      <Col span={18}>
        <Row justify={"end"} style={{ width: "100%" }}><Col>{name}</Col><Col style={{ paddingLeft: 2, paddingRight: 2 }}>:</Col>
        </Row>
      </Col>
      <Col span={6}>
        {value}
      </Col>
    </Row>
  }


  render(): React.ReactNode {
    const { currentYear, loading, years, showObj, csyllhObj, dqsczzObj, jzydObj } = this.state
    const dqsczzDatas = this.getTempDatas(currentYear, years, dqsczzObj, dqsczzYFields)
    const csyllhDatas = this.getTempDatas(currentYear, years, csyllhObj, csyllhYFields)
    const jzydDatas = this.getTempDatas(currentYear, years, jzydObj, jzydYFields)

    const height = 40
    const width = 450

    const popu = showObj ? showObj.popu : null
    const tech = showObj ? showObj.tech : null


    return <Row style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
      <Col style={{ width: `calc(100% - ${width}px)`, height: "100%", position: "relative" }}>
        <div className="lmap" id="map">

        </div>
      </Col>
      <Col style={{ width, height: "100%" }}>
        <Row justify={"center"} style={{ width: "100%", height: "100%", paddingBottom: 10, paddingTop: 10 }}>
          <Row justify={"center"} style={{ width: "100%", height }}>
            {years && years.length > 0 && <PlayButton speed={this.props.speed} years={years} currentYear={currentYear} onChange={this.onChange.bind(this)} />}
          </Row>
          <div style={{ width: "100%", height: `calc(100% - ${height}px)` }}>
            <div style={{ width: "100%", height: "35%" }}>
              {currentYear && <ChartShow name={"地区生产总值"} data={dqsczzDatas?.datas} time={currentYear} yAxisDatas={dqsczzYFields} color={"#ccff00"} />}
            </div>
            <div style={{ width: "100%", height: "30%" }}>
              {currentYear && <ChartShow name={"城市园林绿化"} data={csyllhDatas?.datas} time={currentYear} yAxisDatas={csyllhYFields} color={"#FFD700"} />}
            </div>
            <div style={{ width: "100%", height: "35%" }}>
              {currentYear && <ChartShow name={"建筑用地"} data={jzydDatas?.datas} time={currentYear} yAxisDatas={jzydYFields} color={"#FF7F00"} />}
            </div>
          </div>
        </Row>
      </Col>
      <Spin spinning={loading} tip={"正在加载数据......"} style={{ position: "absolute", top: "45%", left: "48%" }}>

      </Spin>
      {showObj && <Modal width={600} centered open={!!showObj} footer={null} title={`【${showObj.year}年${showObj.name}】信息`} onCancel={this.onCancle.bind(this)}>
        <Row style={{ width: "100%" }}>
          <Col span={12}>
            <Row style={{ width: "100%", padding: 10 }}>
              <Title level={4}>人口</Title>
            </Row>
            {popu && <Row style={{ width: "100%" }}>
              {this.renderItem("户籍户数(万户)", popu["Field3"])}
              {this.renderItem("户籍人口数(万人)", popu["Field15"])}
              {this.renderItem("户籍死亡人数(万人)", popu["Field17"])}
              {this.renderItem("户籍非农业人口数(万人)", popu["Field4"])}
              {this.renderItem("户籍女性人口数(万人)", popu["Field5"])}
              {this.renderItem("0-18岁人口数(万人)", popu["Field6"])}
              {this.renderItem("18-35岁人口数(万人)", popu["Field13"])}
              {this.renderItem("35-60岁人口数(万人)", popu["Field16"])}
              {this.renderItem("60岁以上人口数(万人)", popu["Field7"])}
              {this.renderItem("户籍出生人数(万人)", popu["Field8"])}
              {this.renderItem("常住人口数(万人)", popu["Field11"])}
              {this.renderItem("常住城镇人口数(万人)", popu["Field12"])}
              {this.renderItem("户籍自然增长人数(万人)", popu["Field14"])}
              {this.renderItem("户籍自然增长率(‰)", popu["Field2"])}
              {this.renderItem("户籍出生率(‰)", popu["Field9"])}
              {this.renderItem("户籍死亡率(‰)", popu["Field10"])}
              {this.renderItem("城镇化率(%)", popu["Field18"])}
            </Row>}
          </Col>
          <Col span={12}>
            <Row style={{ width: "100%", padding: 10 }}>
              <Title level={4}>经济</Title>
            </Row>
            {tech && <Row style={{ width: "100%", padding: 10 }}>
              {this.renderItem("地区生产总值(亿元)", tech["Field11"])}
              {this.renderItem("第一产业增加值(亿元)", tech["Field4"])}
              {this.renderItem("第二产业增加值(亿元)", tech["Field2"])}
              {this.renderItem("第三产业增加值(亿元)", tech["Field6"])}
              {this.renderItem("人均地区生产总值(元)", tech["Field12"])}
              {this.renderItem("地区生产总值指数(%)", tech["Field3"])}
              {this.renderItem("工业增加值(亿元)", tech["Field5"])}
              {this.renderItem("第一产业指数(%)", tech["Field7"])}
              {this.renderItem("第二产业指数(%)", tech["Field8"])}
              {this.renderItem("第三产业指数(%)", tech["Field10"])}
              {this.renderItem("工业指数(%)", tech["Field9"])}
              {this.renderItem("人均地区生产总值指数(%)", tech["Field13"])}
            </Row>}
          </Col>
        </Row>
      </Modal>}
    </Row >
  }
};