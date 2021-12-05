import { Alert, Button } from '@mui/material';
import { useState } from 'react';
import { SpecifySelect } from './specifySelect';
import { TdtPoi } from './tdtPoi';
import { TypeSelect } from './typeSelect';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function DownloadPoi() {
    const [specify, setSpecify] = useState('')
    const [type, setType] = useState('')
    const [jsons, setJsons] = useState('')
    const [count, setCount] = useState(0)
    const [total, setTotal] = useState(0)


    const poi = new TdtPoi()
    function specifyChange(specify: string) {
        setSpecify(specify)
    }

    function typeChange(type: string) {
        setType(type)
    }

    function query() {
        if (specify && type) {
            poi.queryPoi(true, specify, type, (datas, count, total) => {
                if (count === total) {
                    setJsons('')
                    const features: any[] = []
                    for (let i in datas) {
                        const data = datas[i]
                        if (data.lonlat) {
                            const coordinates = data.lonlat.split(",")
                            const feature = {
                                type: "Feature",
                                properties: data,
                                geometry: {
                                    type: "Point",
                                    coordinates: [Number(coordinates[0]), Number(coordinates[1])]
                                }
                            }
                            features.push(feature)
                        }

                    }
                    const jsons = {
                        type: "FeatureCollection",
                        features
                    }
                    const str=JSON.stringify(jsons)
                    setJsons(str)
                    console.log(str)
                }
                setTotal(total)
                setCount(count)
            })
        }
    }
    const progress = Number((count / total * 100).toFixed(0))
    return <div style={{ padding: 10 }}>
        <SpecifySelect onChange={specifyChange} />
        <TypeSelect onChange={typeChange} />
        {!specify && <Alert style={{ margin: 10 }} severity="warning">请选择行政区!</Alert>}
        {!type && <Alert style={{ margin: 10 }} severity="warning">请选择类型!</Alert>}
        <Button variant="contained" style={{ margin: 10 }} onClick={query}>查询</Button>
        {count > 0 && <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{progress}%</Typography>
            </Box>
        </Box>}
        {count > 0 && <Alert style={{ margin: 10 }} severity="success">
            已查询{count}条数据，总计{total}条数据
            {jsons && total > 0 && <div>数据查询成功！请在控制台复制</div>}
        </Alert>}
    </div>
}