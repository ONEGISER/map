import React from "react";

import TileGrid from "ol/tilegrid/TileGrid";
import TileImage from "ol/source/TileImage";
import Map from "ol/Map";
import View from "ol/View";
import XYZ from "ol/source/XYZ";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import * as olProj from "ol/proj";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Translate as PointerTranslate } from "ol/interaction";
import Collection from "ol/Collection";
import startImg from "./utils/imgs/起点.png";

import "ol/ol.css"


const lngCenter = "116.397428";
const latCenter = "39.90923";
const mapURL = {
  "aMap-img-d":
    "http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&scale=1&x={x}&y={y}&z={z}",
  "aMap-img":
    "http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&scale=2&x={x}&y={y}&z={z}",
  "aMap-vec-d":
    "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scl=1&style=8&x={x}&y={y}&z={z}",
  "aMap-vec":
    "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scl=2&style=8&x={x}&y={y}&z={z}",
  "aMap-roadLabel":
    "http://webst0{1-4}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
};

export interface Props {}
class TestMap extends React.Component {
  vectorLayer?: any;
  map:any
  iconFeature:any
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.loadMap();
  }

  loadMap = () => {
    // 添加点位图层
    var vectorSource = new VectorSource({
      features: [],
    });

    this.vectorLayer = new VectorLayer({
      source: vectorSource,
      zIndex: 100,
    });

    // 需要转换坐标系 - 将4326转化为3857坐标系
    let m_center:any = [lngCenter, latCenter]; //地图中心点-经纬度坐标
    m_center = olProj.transform(m_center, "EPSG:4326", "EPSG:3857");
    this.map = new Map({
      target: "testMap",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: mapURL["aMap-vec-d"],
          }),
        }),
        this.vectorLayer,
      ],
      view: new View({
        center: m_center,
        zoom: 10,
        minZoom: 5,
        maxZoom: 18,
        expandZoomRange: true,
        projection: "EPSG:3857",
      } as any),
    });
    this.mapClick();
  };

  /**
   * @name: mapClick
   * @desc: 点击地图出现点位图片 - 点位可移动
   */
  mapClick = () => {
    this.map.on("singleclick", (e:any) => {
      // 获取当前点位坐标
      let point = e.coordinate;
      if (this.iconFeature) {
        // 将地图回中
        // this.map.getView().setCenter(point);
        // 将点位清除再绘制
        // this.vectorLayer.getSource().clear();
        // 直接修改点位位置
        this.iconFeature.setGeometry(new Point([point[0], point[1]]));
        // 将点位转成EPSG:4326坐标系
        let clickPoint = olProj.transform(point, "EPSG:3857", "EPSG:4326");
        console.log(clickPoint);
      } else {
        // 新增点位Feature
        this.iconFeature = new Feature({
          geometry: new Point([point[0], point[1]]),
          name: "Map Point",
          population: 4000,
          rainfall: 500,
        });
        // 为Feature增加样式
        let iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: startImg
          }),
        });
        this.iconFeature.setStyle(iconStyle);
        // 在点位layer中加上Feature
        this.vectorLayer.getSource().addFeature(this.iconFeature);

        // 增加可移动点位元素
        let iconTranslate = new PointerTranslate({
          features: new Collection([this.iconFeature]),
        });
        this.map.addInteraction(iconTranslate);
        // 为元素增加事件
        iconTranslate.on("translateend", () => {
          let clickPoint = this.iconFeature.getGeometry().flatCoordinates;
          // 将点位转成EPSG:4326坐标系
          clickPoint = olProj.transform(clickPoint, "EPSG:3857", "EPSG:4326");
          console.log(clickPoint);
        });
      }
    });
  };

  render() {
    return <div id="testMap" style={{ width: "100vw", height: "100vh" }}></div>;
  }
}
export default TestMap;
