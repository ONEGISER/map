import axios from "axios";
const count = 10
export interface POIResults {
    address: string
    hotPointID: string
    lonlat: string//"103.842300,36.047410"
    name: string//"甘肃建投七建集团耿家庄住宅小区"
    phone: string
    poiType: string
    source: string
}
export class TdtPoi {
    private start = 0
    private total = 0
    private datas = []
    queryPoi(isInit: boolean, specify: string, dataTypes: string, success: (datas: POIResults[], count: number, total: number) => void) {
        if (isInit) {
            this.start = 0
            this.total = 0
            this.datas = []
        }
        if (specify && dataTypes) {
            const obj = {
                queryType: '13',
                show: '1',
                start: this.start.toString(),
                dataTypes,
                specify,
                count,
                mapBound: "-180,-90,180,90"
            }
            const url = `http://api.tianditu.gov.cn/v2/search?postStr=${JSON.stringify(obj)}&type=query&tk=${Keys.tdt}`
            axios.get(url).then((results) => {
                if (results.data) {
                    if (!this.total) {
                        this.total = Number(results.data.count)
                    }
                    this.start += count
                    this.datas = this.datas.concat(results.data.pois)
                    if (this.total > this.datas.length) {
                        if (this.total)
                            success([], this.datas.length, this.total)
                        const time = Math.random() * 10
                        setTimeout(() => {
                            this.queryPoi(false, specify, dataTypes, success)
                        }, time * 1000);
                    } else {
                        success(this.datas, this.datas.length, this.total)
                    }
                }
            })
        }
    }
}