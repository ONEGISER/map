/*
 * @Author: pczheng 1305780485@qq.com
 * @Date: 2023-03-20 20:22:00
 * @LastEditors: pczheng
 * @LastEditTime: 2023-03-20 21:13:24
 * @Description: file content
 */
import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
const coordtransform = require("coordtransform-js");
const FileSaver = require("file-saver");
const Item = styled(Paper)(({ theme }: any) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
export interface BaiduPOIToWGS84Props {}

export interface BaiduPOIToWGS84State {
  datas?: any;
  newDatas?: any;
}
export default class BaiduPOIToWGS84 extends React.Component<
  BaiduPOIToWGS84Props,
  BaiduPOIToWGS84State
> {
  ref: any;
  constructor(props: BaiduPOIToWGS84Props) {
    super(props);
    this.state = {
      datas: {},
      newDatas: {},
    };
  }

  componentDidMount() {
    const url = "/datas/baidu_cdz.json";
    this.queryDatas(url);
  }

  componentWillReceiveProps(
    nextProps: Readonly<BaiduPOIToWGS84Props>,
    nextContext: any
  ): void {}

  async queryDatas(url: string) {
    const datas = await (await fetch(url)).json();
    console.log(datas);
    const features: any[] = [];

    for (let i in datas) {
      const data = datas[i];
      if (data.navi_x && data.navi_y) {
        const _data = coordtransform.DB09MctoBD09({
          lng: Number(data.navi_x),
          lat: Number(data.navi_y),
        });
        const _data2 = coordtransform.BD09toWGS84(_data);
        console.log(_data2);
        const coordinates = [_data2.lng, _data2.lat];
        const feature = {
          type: "Feature",
          properties: {
            addr: data.addr,
            area_name: data.area_name,
            city_name: data.city_name,
            di_tag: data.di_tag,
            name: data.name,
          },
          geometry: {
            type: "Point",
            coordinates: [Number(coordinates[0]), Number(coordinates[1])],
          },
        };
        features.push(feature);
      }
    }
    const jsons = {
      type: "FeatureCollection",
      features,
    };
    console.log(jsons);
  }

  render(): React.ReactNode {
    const { newDatas, datas } = this.state;
    return <div></div>;
  }
}
