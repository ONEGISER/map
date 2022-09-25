import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { ArcType, Cartesian3, Color, ConstantProperty, PolylineGraphics, Viewer } from 'cesium';
import { EarthPolylineTrailLinkMaterialProperty } from './earthPolylineTrailLinkMaterialProperty';

function App() {

  useEffect(() => {
    const viewer = new Viewer("cesium")
    console.log("dis");
    let roadColor = Color.fromCssColorString("#0cfd11");
    // 创建流动线对象
    viewer.entities.add({
      polyline: new PolylineGraphics({
        material: new EarthPolylineTrailLinkMaterialProperty({duration:1000,repeat:{x:1,y:1}, color: roadColor, image: require("./arrow.png") }) as any,
        // width: 10,// 线宽
        width: new ConstantProperty(25),
        arcType: ArcType.GEODESIC,
        positions: Cartesian3.fromDegreesArrayHeights([110, 36, 200, 113, 37, 200])//positions道路经过的坐标点集合
      })
    });
  }, [])


  return (
    <div id="cesium" style={{ position: "absolute", top: 0, bottom: 0, width: "100%", height: "100%" }} className="App">

    </div>
  );
}

export default App;
