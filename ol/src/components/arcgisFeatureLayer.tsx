import "./map.css";
import "ol/ol.css";
import { useEffect } from "react";
import OlMap from "ol/Map";
import View from "ol/View";
import ImageLayer from "ol/layer/Image";
import XYZ from "ol/source/XYZ";
import ImageStatic from "ol/source/ImageStatic";
import { transformExtent, transform } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import EsriJSON from "ol/format/EsriJSON.js";
import Map from "ol/Map.js";
import VectorSource from "ol/source/Vector.js";
import { Fill, Stroke, Style } from "ol/style.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { createXYZ } from "ol/tilegrid.js";
import { fromLonLat } from "ol/proj.js";
import { tile as tileStrategy } from "ol/loadingstrategy.js";
export const ArcgisFeatureLayer = () => {
  useEffect(() => {
    const map = new OlMap({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          }),
        }),
      ],
      view: new View({
        center: transform([103, 36], "EPSG:4326", "EPSG:3857"),
        zoom: 7,
      }),
    });

    addLayer(map);
  }, []);

  async function addLayer(map: OlMap) {
    const serviceUrl =
      "https://services-eu1.arcgis.com/NPIbx47lsIiu2pqz/ArcGIS/rest/services/" +
      "Neptune_Coastline_Campaign_Open_Data_Land_Use_2014/FeatureServer/";
    const layer = "0";
    const vectorSource = new VectorSource({
      format: new EsriJSON(),
      url: function (extent, resolution, projection) {
        // ArcGIS Server only wants the numeric portion of the projection ID.
        const srid = projection
          .getCode()
          .split(/:(?=\d+$)/)
          .pop();

        const url =
          serviceUrl +
          layer +
          "/query/?f=json&" +
          "returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=" +
          encodeURIComponent(
            '{"xmin":' +
              extent[0] +
              ',"ymin":' +
              extent[1] +
              ',"xmax":' +
              extent[2] +
              ',"ymax":' +
              extent[3] +
              ',"spatialReference":{"wkid":' +
              srid +
              "}}"
          ) +
          "&geometryType=esriGeometryEnvelope&inSR=" +
          srid +
          "&outFields=*" +
          "&outSR=" +
          srid;

        return url;
      },
      strategy: tileStrategy(
        createXYZ({
          tileSize: 512,
        })
      ),
      attributions:
        "University of Leicester (commissioned by the " +
        '<a href="https://www.arcgis.com/home/item.html?id=' +
        'd5f05b1dc3dd4d76906c421bc1727805">National Trust</a>)',
    });

    const vector = new VectorLayer({
      source: vectorSource,
      // style: function (feature) {
      //   const classify = feature.get('LU_2014');
      //   const color = fillColors[classify] || [0, 0, 0, 0];
      //   style.getFill().setColor(color);
      //   return style;
      // },
      opacity: 0.7,
    });
    // map.addLayer(vector);
  }

  return <div className="lmap" id="map"></div>;
};
