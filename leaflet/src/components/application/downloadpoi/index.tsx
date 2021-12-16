import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, TextField } from '@mui/material';
import { useState } from 'react';
import { SpecifySelect } from './specifySelect';
import { Count, POIResults, TdtPoi } from './tdtPoi';
import { TypeSelect } from './typeSelect';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function DownloadPoi() {
    const [specify, setSpecify] = useState('')
    const [type, setType] = useState('')
    const [jsons, setJsons] = useState('')
    const [datas, setDatas] = useState<POIResults[]>([])
    const [text, setText] = useState('')
    const [count, setCount] = useState(0)
    const [total, setTotal] = useState(0)
    const [open, setOpen] = useState(false);

    const poi = new TdtPoi()
    function specifyChange(specify: string) {
        setSpecify(specify)
    }

    function typeChange(type: string) {
        setType(type)
    }


    function finish(datas: POIResults[]) {
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
        const str = JSON.stringify(jsons)
        setJsons(str)
        console.log(str)
    }

    function query() {
        setJsons("")
        setCount(0)
        setTotal(0)
        poi.queryPoi(true, specify, type, text, (datas, count, total) => {
            if (count === Count) {
                setOpen(true)
            }
            if (count === total) {
                finish(datas)
            }
            setDatas(datas)
            setTotal(total)
            setCount(count)
        })
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

    const progress = Number((count / total * 100).toFixed(0))
    return <div style={{ padding: 10 }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TextField id="outlined-basic" label="关键字" variant="outlined" onChange={onTextChange} />
        </FormControl>
        <SpecifySelect onChange={specifyChange} />
        <TypeSelect onChange={typeChange} />
        <Alert style={{ margin: 10 }} severity="info">默认行政区为中国!</Alert>
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
        <Dialog
            open={open}
            onClose={handleClose}
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
    </div>
}