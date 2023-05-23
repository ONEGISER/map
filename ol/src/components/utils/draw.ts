import Feature from "ol/Feature";
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import OlMap from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import startImg from "./imgs/起点.png";
export class Draw {
  map: OlMap;
  vectorLayer = new VectorLayer({
    source: new VectorSource(),
  });
  constructor(map: OlMap) {
    this.map = map;
    this.map.addLayer(this.vectorLayer);
  }

  createMarkerPoint(coordinate: Coordinate, src: string) {
    const feature = new Feature({
      geometry: new Point(coordinate),
    });
    feature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 0.96],
          src,
          crossOrigin: "anonymous",
          width: 50,
          height: 50,
        }as any),
      })
    );
    return feature;
  }

  addStartP(coordinate: Coordinate) {
    const feature = this.createMarkerPoint(coordinate, "/imgs/起点.png");
    this.vectorLayer.getSource()?.addFeature(feature);
  }
}
