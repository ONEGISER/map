import "leaflet/dist/leaflet.css"
import { useEffect } from 'react';
import L from "leaflet"
import { DynamicMapLayer,TiledMapLayer } from "esri-leaflet"
export const Test = () => {
    // const [value, setValue] = React.useState<string | number>('99');
    useEffect(() => {
        const map:any = L.map("map").setView([ 40.672827, -73.957901], 11);

        new TiledMapLayer({
            url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/New_York_Housing_Density/MapServer",
            pane: "overlayPane"
          })
          .addTo(map);
        require("./map.css")
    }, [])

    return <div className="lmap" id="map">

    </div>
};