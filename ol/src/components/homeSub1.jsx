import React from "react";
let renderCount = 0;
let queryCount = 0;
export class HomeSub1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: undefined
        };
    }
    componentDidMount() {
        this.queryDatas2();
        console.log("did mount");
    }

    queryDatas() {
        console.log("我被调用了！");
        queryCount++;
        fetch(
            "https://elevation3d.arcgis.com/arcgis/rest/services/World_Imagery/MapServer?f=json"
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                this.setState({
                    datas: data
                });
            });
    }

    async queryDatas2() {
        console.log("我被调用了！");
        queryCount++;
        const response = await fetch("https://elevation3d.arcgis.com/arcgis/rest/services/World_Imagery/MapServer?f=json")
        const data = await response.json()
        console.log("result-====");
        this.setState({
            datas: data
        })
    }

    onRefresh() {
        this.queryDatas();
    }

    render() {
        renderCount++;
        console.log(renderCount);
        return (
            <div>
                <div>查询次数{queryCount}</div>
                <div>查询数据{this.state.datas?.currentVersion}</div>
                <div>渲染次数{renderCount}</div>
                <button onClick={this.onRefresh.bind(this)}>刷新数据 </button>
            </div>
        );
    }
}