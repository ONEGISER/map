import Feature from "ol/Feature";
import { Coordinate } from "ol/coordinate";
import { Point } from "ol/geom";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import OlMap from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Translate as PointerTranslate } from "ol/interaction";
import Collection from "ol/Collection";
import startImg from "./imgs/起点.png";
import endImg from "./imgs/终点.png";
import middleImg from "./imgs/途径点.png";

import { transform } from "ol/proj";

export type ActionType = "position" | "add" | "delete";
export interface DrawAction {
  onChange?: (feature: Feature, features: Feature[], type: ActionType) => void;
}
export class Draw {
  map: OlMap;
  vectorLayer = new VectorLayer({
    source: new VectorSource(),
  });
  action: DrawAction;
  collection: Collection<Feature> = new Collection();
  constructor(map: OlMap, action: DrawAction) {
    this.map = map;
    this.map.addLayer(this.vectorLayer);
    this.action = action;
  }

  onChange(feature: Feature, type: ActionType) {
    if (this.action?.onChange) {
      this.action.onChange(feature, this.collection.getArray(), type);
    }
  }

  createMarkerPoint(coordinate: Coordinate, src: string, properties: Object) {
    const feature = new Feature({
      geometry: new Point(coordinate),
      properties,
    });
    feature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 0.96],
          src,
          crossOrigin: "anonymous",
          width: 50,
          height: 50,
        } as any),
      })
    );

    this.collection.push(feature);

    return feature;
  }

  addPoint(coordinate: Coordinate, img: string, properties: Object) {
    const feature = this.createMarkerPoint(coordinate, img, properties);
    this.onChange(feature, "add");
    this.vectorLayer.getSource()?.addFeature(feature);
    const iconTranslate = new PointerTranslate({
      features: new Collection([feature]),
    });
    this.map.addInteraction(iconTranslate);
    iconTranslate.on("translateend", (event) => {
      if (event.features) {
        const array = event.features.getArray();
        console.log(array);
        this.onChange(array[0], "position");
      }
    });
  }

  addStartP(coordinate: Coordinate) {
    this.addPoint(coordinate, startImg, {
      type: "起点",
    });
  }

  addMiddleP(coordinate: Coordinate) {
    this.addPoint(coordinate, middleImg, {
      type: "途径点",
    });
  }

  addEndP(coordinate: Coordinate) {
    this.addPoint(coordinate, endImg, {
      type: "终点",
    });
  }
}
