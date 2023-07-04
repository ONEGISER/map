import "./map.css"
import "ol/ol.css"
import { useEffect } from "react";
import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from "ol/layer/Image"
import XYZ from 'ol/source/XYZ';
import ImageStatic from 'ol/source/ImageStatic';
import { transformExtent, transform } from 'ol/proj'
import GeoJSON from 'ol/format/GeoJSON';
import url from "./1.png"
import Vector from "ol/source/Vector";
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import Layer from 'ol/layer/Layer';
import VectorSource from 'ol/source/Vector';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer';
import { asArray } from 'ol/color';
import { packColor, parseLiteralStyle } from "ol/webgl/styleparser.js";

export const GradeColors: { [key: string]: string } = {
  '优': '#33cc33',
  '良': '#60fae7',
  '中': "#dfed73",
  '次': "#ffc691",
  '差': "#f95302",
  '无': "#fde981"
}
export class WebGLLayer extends Layer {
  createRenderer(): any {
    let self: any = this
    return new WebGLVectorLayerRenderer(this, {
      stroke: {
        attributes: {
          color: function (feature: any) {
            const _index = self.values_?._index
            const properties = feature?.values_
            const grade = properties[`${_index}Grade`]
            const _color = GradeColors[grade] ? GradeColors[grade] : GradeColors.无
            const color = asArray(_color);
            color[3] = 1;
            return packColor(color);
          },
          width: function () {
            return 3;
          },
          opacity: function () {
            return 1;
          },
        },
      },
    } as any) as any
  }
}

export const Map2 = () => {
  // const [value, setValue] = React.useState<string | number>('99');
  useEffect(() => {
    const map = new OlMap({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: transform([119.363083141000047, 29.103464222000067], 'EPSG:4326', 'EPSG:3857'),
        zoom: 13
      })
    });

    const layer = new ImageLayer()
    map.addLayer(layer)
    const extent = transformExtent([103.70859, 36.04174, 103.83822, 36.09699], 'EPSG:4326', 'EPSG:3857')
    const imageSource = new ImageStatic({
      url: "data:image/png;base64,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",
      projection: 'EPSG:3857',
      imageExtent: extent
    })
    layer.setSource(imageSource);
  

  }, [])

  // function getDatas(map: any,) {
  //     axios.get("/index/index/get_data.html").then((response) => { //https://xgs.gsjlxkgc.com
  //         if (response.data?.data) {
  //             const { data } = response.data
  //             for (let i in data) {
  //                 const _data = data[i]
  //                 const { latitude, longitude, name, address, type, occur_time } = _data
  //                 const isTrue = type === 1
  //                 const customColor = isTrue ? '#ff3333' : "#FF8C00"
  //                 const cutomBorderColor = isTrue ? "#ff0000" : "#FFA54F"
  //                 const markerContainer = document.createElement("div")
  //                 markerContainer.className = "marker"
  //                 markerContainer.style.backgroundColor = `${customColor}`
  //                 markerContainer.style.border = `2px solid ${cutomBorderColor}`
  //                 const html = `<div style="font-weight:bold;font-size:14px;">${name}</div><div style="color:#545454;">${address}</div><div>${occur_time}</div>`
  //                 const lnglat: [number, number] = [Number(longitude), Number(latitude)]
  //                 const popup = new mapboxgl.Popup({ className: 'my-class' })
  //                     .setLngLat(lnglat)
  //                     .setHTML(html)
  //                     .setMaxWidth("300px")
  //                     .addTo(map);
  //                 new mapboxgl.Marker(markerContainer, { rotation: 45 }).setLngLat(lnglat).setPopup(popup)
  //                     .addTo(map);
  //                 markerContainer.addEventListener('click', (e: any) => {

  //                 });
  //             }
  //         }
  //     })
  // }
  return <div className="lmap" id="map">

  </div>
  // return <HomeSub1 />
};