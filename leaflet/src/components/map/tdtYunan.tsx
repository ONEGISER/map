import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { TiledMapLayer } from "esri-leaflet";
export const TdtYunan = () => {
  // const [value, setValue] = React.useState<string | number>('99');
  useEffect(() => {
    const map:any = L.map("map", {
      minZoom: 2,
    }).setView([103, -30], 2); //Latitude, longitude
    new TiledMapLayer({
      url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/New_York_Housing_Density/MapServer",
      pane: "overlayPane",
    }).addTo(map);
  }, []);

  return <div className="lmap" id="map"></div>;
};
