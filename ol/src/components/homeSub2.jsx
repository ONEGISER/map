import { useEffect, useState } from "react";
let renderCount = 0;
let queryCount = 0;
export function HomeSub2() {
  const [datas, setDatas] = useState(undefined);
  function queryDatas() {
    console.log("我被调用了！");
    queryCount++;
    fetch(
      "https://elevation3d.arcgis.com/arcgis/rest/services/World_Imagery/MapServer?f=json"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDatas(data);
      });
  }



  useEffect(() => {
    const queryDatas2 = async () => {
      console.log("我被调用了！");
      queryCount++;
      console.log(queryCount);

      const response = await fetch("https://elevation3d.arcgis.com/arcgis/rest/services/World_Imagery/MapServer?f=json")
      const data = await response.json()
      setDatas(data)
    }
    queryDatas2();
  }, []);

  function onRefresh() {
    queryDatas();
  }
  renderCount++;
  return (
    <div>
      <div>查询次数{queryCount}</div>
      <div>查询数据{datas?.currentVersion}</div>
      <div>渲染次数{renderCount}</div>
      <button onClick={onRefresh}>刷新数据 </button>
    </div>
  );
}