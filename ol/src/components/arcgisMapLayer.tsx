import "./map.css";
import "ol/ol.css";
import { useEffect } from "react";
import OlMap from "ol/Map";
import View from "ol/View";
import XYZ from "ol/source/XYZ";
import { transform } from "ol/proj";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import TileArcGISRest from "ol/source/TileArcGISRest";
//点击arcgisserver服务获取属性信息的方法
export const ArcgisMapLayer = () => {
  useEffect(() => {
    const url =
      "http://10.62.210.43:6080/arcgis/rest/services/GSshanhong/%E9%98%B2%E6%B4%AA%E8%83%BD%E5%8A%9B%E7%8E%B0%E7%8A%B6_%E8%B0%83%E6%9F%A5%E8%AF%84%E4%BB%B7/MapServer";
    const url2 =
      "http://10.62.210.43:6080/arcgis/rest/services/GSshanhong/%E9%98%B2%E6%B2%BB%E5%8C%BA%E7%BB%8F%E6%B5%8E_%E4%BC%81%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D_%E8%B0%83%E6%9F%A5%E8%AF%84%E4%BB%B7new/MapServer";
    const view = new View({
      center: transform([103.76325, 36.06873], "EPSG:4326", "EPSG:3857"),
      zoom: 13,
    });
    const map = new OlMap({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          }),
        }),
        new TileLayer({
          source: new TileArcGISRest({
            url: url,
          }),
          datas: {
            self: "test",
          },
        } as any),
        new TileLayer({
          source: new TileArcGISRest({
            url: url2,
          }),
          datas: {
            self: "test",
          },
        } as any),
      ],
      view,
    });

    const displayFeatureInfo = async function (evt: any) {
      if (evt.dragging) {
        return;
      }
      const coord = map.getCoordinateFromPixel(evt.pixel);
      const zoom = map.getView().getZoom();
      let padding = 20;
      if (zoom) {
        if (zoom < 6) {
          padding = 500;
        } else if (zoom < 15) {
          padding = 100;
        } else if (zoom < 17) {
          padding = 50;
        }
      }
      const topL = [coord[0] - padding, coord[1] + padding];
      const topR = [coord[0] + padding, coord[1] + padding];
      const bottomL = [coord[0] - padding, coord[1] - padding];
      const bottomR = [coord[0] + padding, coord[1] - padding];

      const topL4326 = transform(topL, "EPSG:3857", "EPSG:4326");
      const topR4326 = transform(topR, "EPSG:3857", "EPSG:4326");
      const bottomL4326 = transform(bottomL, "EPSG:3857", "EPSG:4326");
      const bottomR4326 = transform(bottomR, "EPSG:3857", "EPSG:4326");
      let result: any;
      const layers = map.getAllLayers();
      const queryInfo: any = async (datas: any, index: number, url: string) => {
        const data = datas[index];
        if (data?.id !== undefined) {
          if (!result) {
            const queryUrl = `${url}/${data.id}/query`;
            const submit = new FormData();
            submit.append("geometryType", "esriGeometryPolygon");
            submit.append("inSR", "4326");
            submit.append("outSR", "4326");
            submit.append("outFields", "*");
            submit.append(
              "geometry",
              JSON.stringify({
                type: "polygon",
                rings: [[topL4326, topR4326, bottomL4326, bottomR4326]],
              })
            );
            submit.append("f", "pjson");
            const _result = await (
              await fetch(queryUrl, {
                method: "POST",
                body: submit,
              })
            ).json();
            if (_result?.features && _result?.features[0]) {
              return _result?.features[0];
            } else {
              index++;
              if (index < datas.length) {
                return await queryInfo(datas, index, url);
              }
            }
          }
        }
        return null;
      };

      const query = async (datas: any, index: number) => {
        if (!result) {
          const layer = datas[index];
          const source: any = layer.getSource();
          const queryTemp = async () => {
            index++;
            if (index < datas.length) {
              await query(datas, index);
            }
          };
          if (source) {
            const urls = source.urls;
            const url = (urls && urls[0] ? urls[0] : "") || source.url_;
            if (url.indexOf("/rest/services") > -1) {
              const url = urls[0];
              const queryResult = await (await fetch(`${url}?f=json`)).json();
              if (
                queryResult?.layers &&
                queryResult.capabilities.indexOf("Query") > -1
              ) {
                const { layers } = queryResult;
                const temp = await queryInfo(layers, 0, url);
                if (temp) {
                  result = temp;
                } else {
                  await queryTemp();
                }
              }
            } else {
              await queryTemp();
            }
          }
        }
      };

      if (layers && layers.length > 0) await query(layers, 0);

      return result;
    };

    map.on(["click"], async function (evt: any) {
      const result = await displayFeatureInfo(evt);
      console.log(result, "--------------------------");
    });
  }, []);

  return <div className="lmap" id="map"></div>;
};
