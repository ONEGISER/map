import { Alert, Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Link, TextField } from '@mui/material';
import { useState } from 'react';
import { SpecifySelect } from './specifySelect';
import { Count, POIResults, TdtPoi } from './tdtPoi';
import { TypeSelect } from './typeSelect';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CurrencyYenOutlinedIcon from '@mui/icons-material/CurrencyYenOutlined';
import ReactJson from 'react-json-view'
import moment from "moment"
const FileSaver = require('file-saver');
const onmap_tdt_key = "onmap-tdt-key"
export default function DownloadPoi() {
    const [specify, setSpecify] = useState('')
    const [type, setType] = useState('')
    const [jsons, setJsons] = useState({})
    const [previewJsons, setPreviewJsons] = useState({})
    const [datas, setDatas] = useState<POIResults[]>([])
    const [text, setText] = useState('')
    const [count, setCount] = useState(0)
    const [total, setTotal] = useState(0)
    const [open, setOpen] = useState(false);
    const [key, setKey] = useState<string | undefined | null>(localStorage.getItem(onmap_tdt_key));

    const poi = new TdtPoi()
    function specifyChange(specify: string) {
        setSpecify(specify)
    }

    function typeChange(type: string) {
        setType(type)
    }


    function finish(datas: POIResults[]) {
        setJsons(getGeoJson(datas))
    }


    function save(jsons: any) {
        if (jsons) {
            const blob = new Blob([JSON.stringify(jsons)], { type: "text/plain;charset=utf-8" });
            const str = `${specify ? specify : ""}_${type ? type : ""}_${text ? text : ""}`
            FileSaver.saveAs(blob, `${str}_${moment().format("YYYY-MM-DD hh:mm:ss")}.json`);
        }
    }


    function getGeoJson(datas: POIResults[]) {
        const features: any[] = []
        for (let i in datas) {
            const data = datas[i]
            if (data?.lonlat) {
                const coordinates = data.lonlat.split(",")
                const feature = {
                    type: "Feature",
                    properties: { ...data, type, specify, text },
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
        return jsons
    }

    function query() {
        setJsons({})
        setDatas([])
        setJsons({})
        setCount(0)
        setTotal(0)
        if (key) {
            poi.queryPoi(true, specify, type, text, key, (datas, count, total) => {
                if (count <= Count) {
                    if (count === Count) {
                        setOpen(true)
                    }
                    setPreviewJsons(getGeoJson(datas))
                }

                if (count === total) {
                    finish(datas)
                }
                setDatas(datas)
                setTotal(total)
                setCount(count)
            })
        }
    }

    function onTextChange(event: any) {
        const { value } = event.target
        setText(value)
    }

    const handleClose = () => {
        setOpen(false)
    };

    const handleCancel = () => {
        setOpen(false)
        poi.stopDownload()
        finish(datas)
    }

    const onClickHander = () => {
        save(jsons)
    }


    function onKeyChange(event: any) {
        const { value } = event.target
        localStorage.setItem(onmap_tdt_key, value)
        setKey(value)
    }

    const progress = total > 0 ? Number((count / total * 100).toFixed(0)) : 0
    return <div style={{ padding: 10 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <h1>天地图兴趣点下载</h1>
            <h4 style={{ marginLeft: 20 }}> <Link href="https://github.com/ONEGISER/map/tree/master/tools" target={"_blank"} variant="body2" underline="hover">github</Link></h4>
        </div>
        <br />
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TextField value={key} id="outlined-key" label="天地图key" variant="outlined" onChange={onKeyChange} />
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Link href="https://blog.csdn.net/qq_19689967/article/details/128060849" target={"_blank"} variant="body2" underline="hover">
                <div style={{ height: 56, display: "flex", alignItems: "center" }}><HelpOutlineOutlinedIcon />如何生成？ </div>
            </Link>
        </FormControl>
        <br />
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TextField id="outlined-basic" label="关键字" variant="outlined" onChange={onTextChange} />
        </FormControl>
        <SpecifySelect onChange={specifyChange} />
        <TypeSelect onChange={typeChange} />
        <Alert style={{ margin: 10 }} severity="info">默认行政区为中国!</Alert>
        <Button disabled={!key} variant="contained" style={{ margin: 10 }} onClick={query}>查询</Button>
        <Button disabled={progress === 0} variant="contained" style={{ margin: 10 }} onClick={handleCancel}>停止</Button>
        {count > 0 && <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{progress}%</Typography>
            </Box>
        </Box>}
        {count > 0 && <Alert severity="success">
            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center" }}>已查询{count}条数据，总计{total}条数据。</div>
                {jsons && total > 0 && <div style={{ display: "flex", alignItems: "center", height: 30 }} >数据查询成功！ <Link href="javascript:void(0)" variant="body2" underline="hover">
                    <p onClick={onClickHander} style={{ display: "flex", alignItems: "center" }}><ArrowDownwardIcon />下载 </p>
                </Link>
                </div>}
            </div>
        </Alert>}
        <Dialog
            open={open}
            onClose={handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"确认是否继续下载?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    总共{total}条数据，是否继续？
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>取消</Button>
                <Button onClick={handleClose} autoFocus>
                    继续
                </Button>
            </DialogActions>
        </Dialog>
        {Object.keys(previewJsons).length > 0 && <div><Alert style={{ marginTop: 10 }} severity="info">预览数据</Alert> <ReactJson src={previewJsons} /></div>}
        <br />
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Card style={{ width: 140 }}>
                <CardMedia
                    component="img"
                    image="/shoukuama.png"
                    alt=""
                />
                <CardContent>
                    <Typography style={{ display: "flex",alignItems: "center" }} variant="body2" color="text.secondary">
                        <CurrencyYenOutlinedIcon /> 打赏作者
                    </Typography>
                </CardContent>
            </Card>
        </FormControl>
    </div>
}