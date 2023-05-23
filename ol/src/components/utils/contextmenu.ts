import "./contextmenu.css";
import { Overlay } from "ol";
import OlMap from "ol/Map";
import { transform } from "ol/proj";
interface ContextmenuAction {
  onClick?: (e: any, coordinate: [number, number]) => void;
}
export class Contextmenu {
  map: OlMap;
  el: HTMLElement;
  action?: ContextmenuAction;
  coordinate?: [number, number];
  constructor(map: OlMap, el: HTMLElement, action?: ContextmenuAction) {
    this.map = map;
    this.el = el;
    this.action = action;
    this.init(el);
  }

  init(el: HTMLElement) {
    this.map?.getViewport().addEventListener("contextmenu", (event: any) => {
      event.preventDefault();
      const coordinate = this.map.getEventCoordinate(event);
      if (el?.style) el.style.display = "block";
      const menu_overlay = new Overlay({
        element: el,
        // positioning: "top-left",
      });
      menu_overlay.setMap(this.map);
      menu_overlay.setPosition(coordinate);
      this.coordinate = coordinate as [number, number];
    });

    this.map.on("singleclick", () => {
      this.close();
    });
    el.addEventListener("click", (e) => {
      this.close();
      if (this.action?.onClick) {
        const coord = transform(
          this.coordinate as any,
          "EPSG:3857",
          "EPSG:4326"
        );
        this.action?.onClick(e, coord as [number, number]);
      }
    });
  }

  close() {
    this.el.style.display = "none";
  }
}
