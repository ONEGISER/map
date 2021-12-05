import axios from "axios";
import L from "leaflet";

export class MarkerOnMap {
    handler() {
        this.getDatas((trueMarkers: L.Marker[], goMarkers: L.Marker[]) => {
            // const trueMarkersG = L.layerGroup(trueMarkers)
            // const goMarkersG = L.layerGroup(goMarkers)
            // const baseLayers = {
            //     "矢量": defaultLayers,
            //     "影像": L.layerGroup([imgLayer, imgLabelLayer])
            // };

            // const overLayers = {
            //     "确诊": trueMarkersG,
            //     "轨迹": goMarkersG
            // };
            // const layerControl = L.control.layers(baseLayers, overLayers);
            // map.addControl(layerControl);
        })
    }

    getDatas(success: (trueMarkers: L.Marker[], goMarkers: L.Marker[]) => void) {
        axios.get("/index/index/get_data.html").then((response) => { //https://xgs.gsjlxkgc.com
            console.log(response);
            if (response.data?.data) {
                const { data } = response.data
                const trueMarkers = []
                const goMarkers = []
                for (let i in data) {
                    const _data = data[i]
                    const { latitude, longitude, name, address, type, occur_time } = _data
                    const isTrue = type === 1
                    const customColor = isTrue ? '#ff3333' : "#FF8C00"
                    const cutomBorderColor = isTrue ? "#ff0000" : "#FFA54F"
                    const markerHtmlStyles = `
                        background-color: ${customColor};
                        width: 1rem;
                        height: 1rem;
                        display: block;
                        position: relative;
                        border-radius: 3rem 3rem 0;
                        transform: rotate(45deg);
                        border: 2px solid ${cutomBorderColor}`

                    const icon = L.divIcon({
                        className: "my-custom-pin",
                        html: `<span style="${markerHtmlStyles}" />`
                    })
                    const marker = L.marker([latitude, longitude], { icon }).bindPopup(`<div style="font-weight:bold;font-size:14px;">${name}</div><div style="color:#545454;">${address}</div><div>${occur_time}</div>`)
                    if (isTrue) {
                        trueMarkers.push(marker)
                    } else {
                        goMarkers.push(marker)
                    }
                }
                success(trueMarkers, goMarkers)
            }
        })
    }
}
