import "mapbox-gl/dist/mapbox-gl.css"
import "./map.css"

import { useEffect } from 'react';
import axios from "axios";
import mapboxgl from "mapbox-gl";
export const Map = () => {
    // const [value, setValue] = React.useState<string | number>('99');
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoicGN6aGVuZyIsImEiOiJjanVjamJ3b28wNGdtNDRyMTBsdGUwZmd0In0.Md_NflCXHCTzzp6wGWZJxg';
        const attribution = '&copy; <a href="https://gsjlxkgc.com/">甘肃记录小康工程</a> 提供数据'
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [103.742546, 36.06], // starting position [lng, lat]
            zoom: 11,// starting zoom
            attributionControl: false
        })

        map.addControl(new mapboxgl.AttributionControl({
            customAttribution: attribution
        }));
        map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('body') }));
        const nav = new mapboxgl.NavigationControl({ visualizePitch: true });
        map.addControl(nav, 'top-left');
        const scale = new mapboxgl.ScaleControl({
            maxWidth: 80,
        });
        map.addControl(scale);

        getDatas(map)
    })

    function getDatas(map: any,) {
        axios.get("/index/index/get_data.html").then((response) => { //https://xgs.gsjlxkgc.com
            if (response.data?.data) {
                const { data } = response.data
                for (let i in data) {
                    const _data = data[i]
                    const { latitude, longitude, name, address, type, occur_time } = _data
                    const isTrue = type === 1
                    const customColor = isTrue ? '#ff3333' : "#FF8C00"
                    const cutomBorderColor = isTrue ? "#ff0000" : "#FFA54F"
                    const markerContainer = document.createElement("div")
                    markerContainer.className = "marker"
                    markerContainer.style.backgroundColor = `${customColor}`
                    markerContainer.style.border = `2px solid ${cutomBorderColor}`
                    const html = `<div style="font-weight:bold;font-size:14px;">${name}</div><div style="color:#545454;">${address}</div><div>${occur_time}</div>`
                    const lnglat: [number, number] = [Number(longitude), Number(latitude)]
                    const popup = new mapboxgl.Popup({ className: 'my-class' })
                        .setLngLat(lnglat)
                        .setHTML(html)
                        .setMaxWidth("300px")
                        .addTo(map);
                    new mapboxgl.Marker(markerContainer, { rotation: 45 }).setLngLat(lnglat).setPopup(popup)
                        .addTo(map);
                    markerContainer.addEventListener('click', (e: any) => {

                    });
                }
            }
        })
    }
    return <div className="lmap" id="map">

    </div>
};