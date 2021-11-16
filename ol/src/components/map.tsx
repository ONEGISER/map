import "./map.css"
import "ol/src/ol.css"
import { useEffect } from "react";
import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
export const Map = () => {
    // const [value, setValue] = React.useState<string | number>('99');
    useEffect(() => {
        new OlMap({
            target: 'map',
            layers: [
              new TileLayer({
                source: new XYZ({
                  url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                })
              })
            ],
            view: new View({
              center: [0, 0],
              zoom: 2
            })
          });

        // getDatas(map)
    })

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
};