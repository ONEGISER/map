import {
  Viewer,
  Cartesian3,
  GeographicTilingScheme,
  WebMapTileServiceImageryProvider,
  CesiumTerrainProvider,
} from "cesium";
export class InitCesium {
  container: Element | string;
  constructor(container: Element | string) {
    this.container = container;
  }

  init() {
    const TDT_tk = "4267820f43926eaf808d61dc07269beb";
    const TDT_IMG_C =
      "http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
      "&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
      "&style=default&format=tiles&tk=" +
      TDT_tk;
    const viewer: Viewer = new Viewer(this.container, {
      imageryProvider: new WebMapTileServiceImageryProvider({
        url: TDT_IMG_C,
        layer: "tdtImg_c",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "c",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        tilingScheme: new GeographicTilingScheme(),
        tileMatrixLabels: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
        ],
        maximumLevel: 50,
      }),
      terrainProvider: new CesiumTerrainProvider({
        url: "http://www.freexgis.com/web-data/terrain", //此地址在超图API中无法使用
      }),
      infoBox: false,
      selectionIndicator: false,
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      homeButton: false,
      navigationHelpButton: false,
      scene3DOnly: true,
      fullscreenButton: false,
    });
    viewer.cesiumWidget.creditContainer.style.display = "none";
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.geocoder.container.style.display = "none";
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(113.55065, 28.03802, 100000),
    });
    return viewer;
  }
}
