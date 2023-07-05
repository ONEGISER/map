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
      "http://60.13.54.71:30119/arcgis/rest/services/GSshanhong/%E9%98%B2%E6%B2%BB%E5%8C%BA%E5%9F%BA%E6%9C%AC%E6%83%85%E5%86%B5_%E8%B0%83%E6%9F%A5%E8%AF%84%E4%BB%B7/MapServer/";
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
          tileSize: 32,
        })
      ),
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
    map.addLayer(vector);
  }

  return <div className="lmap" id="map"></div>;
};
