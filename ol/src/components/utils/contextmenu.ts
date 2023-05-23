import "./contextmenu.css";
import { Overlay } from "ol";
import OlMap from "ol/Map";
interface ContextmenuAction {
  onClick?: (e: any) => void;
}
export class Contextmenu {
  map: OlMap;
  el: HTMLElement;
  action?: ContextmenuAction;
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
    });

    this.map.on("singleclick", () => {
      this.close();
    });
    el.addEventListener("click", (e) => {
      console.log(e);
      this.close();
      if (this.action?.onClick) {
        this.action?.onClick(e);
      }
    });
  }

  close() {
    this.el.style.display = "none";
  }
}
