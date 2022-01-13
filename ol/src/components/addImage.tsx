import "./map.css"
import "ol/src/ol.css"
import { useEffect } from "react";
import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from "ol/layer/Image"
import XYZ from 'ol/source/XYZ';
import ImageStatic from 'ol/source/ImageStatic';
import { transformExtent, transform } from 'ol/proj'
import url from "./1.png"
export const AddImage = () => {
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
        center: transform([103.76325, 36.06873], 'EPSG:4326', 'EPSG:3857'),
        zoom: 13
      })
    });

    const layer = new ImageLayer()
    map.addLayer(layer)
    const extent = transformExtent([103.70859, 36.04174, 103.83822, 36.09699], 'EPSG:4326', 'EPSG:3857')
    const imageSource = new ImageStatic({
      url,
      projection: 'EPSG:3857',
      imageExtent: extent
    })
    layer.setSource(imageSource);

    // getDatas(map)
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