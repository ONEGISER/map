import "cesium/Build/Cesium/Widgets/widgets.css";
import { Viewer } from "cesium";
import { InitCesium } from "./InitCesium";

export class TMap {
  viewer: Viewer;
  constructor(
    container: Element | string,
    options: Viewer.ConstructorOptions
  ) {
    this.viewer = new InitCesium(container).init();
  }
}
