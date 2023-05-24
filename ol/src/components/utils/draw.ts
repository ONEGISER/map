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
  iconTranslate: PointerTranslate;
  collection: Collection<Feature> = new Collection();
  constructor(map: OlMap, action: DrawAction) {
    this.map = map;
    this.map.addLayer(this.vectorLayer);
    this.iconTranslate = new PointerTranslate({
      features: this.collection,
    });
    this.map.addInteraction(this.iconTranslate);
    this.iconTranslate.on("translateend", (event) => {
      if (event.features) {
        const array = event.features.getArray();
        console.log(array);
        this.onChange(array[0], "position");
      }
    });
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

  addStartP(coordinate: Coordinate) {
    const feature = this.createMarkerPoint(coordinate, startImg, {
      type: "起点",
    });
    this.onChange(feature, "add");
    this.vectorLayer.getSource()?.addFeature(feature);
  }
}
