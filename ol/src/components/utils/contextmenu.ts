import "./contextmenu.css";
import { Overlay } from "ol";
import OlMap from "ol/Map";
import { Coordinate } from "ol/coordinate";
import { transform } from "ol/proj";
interface ContextmenuAction {
  onClick?: (e: any, coordinate: Coordinate) => void;
}
export class Contextmenu {
  map: OlMap;
  el: HTMLElement;
  action?: ContextmenuAction;
  coordinate?: Coordinate;
  constructor(map: OlMap, el: HTMLElement, action?: ContextmenuAction) {
    this.map = map;
    this.el = el;
    this.action = action;
    this.init(el);
  }

  init(el: HTMLElement) {
    this.map?.getViewport().addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const isFeature = this.map.hasFeatureAtPixel([event.x, event.y]);
      if (isFeature) {
        return;
      }

      const coordinate = this.map.getEventCoordinate(event);
      if (el?.style) el.style.display = "block";
      const menu_overlay = new Overlay({
        element: el,
        // positioning: "top-left",
        offset: [0, -20],
      });
      menu_overlay.setMap(this.map);
      menu_overlay.setPosition(coordinate);
      this.coordinate = coordinate;
    });

    this.map.on("singleclick", () => {
      this.close();
    });
    el.addEventListener("click", (e) => {
      this.close();
      if (this.action?.onClick && this.coordinate) {
        const coord = transform(this.coordinate, "EPSG:3857", "EPSG:4326");
        this.action?.onClick(e, coord);
      }
    });

    this.map.on("pointermove", (evt) => {
      this.map.getTargetElement().style.cursor = this.map.hasFeatureAtPixel(
        evt.pixel
      )
        ? "grab"
        : "";
    });
  }

  close() {
    this.el.style.display = "none";
  }
}
