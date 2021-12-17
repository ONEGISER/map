import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { IPoiTypes, PoiTypes } from './poiTypes';
export interface TypeSelectProps {
    onChange?: (value: string) => void
}
export function TypeSelect(props: TypeSelectProps) {
    function getKinds() {
        const datas: IPoiTypes[] = []
        PoiTypes.forEach((data) => {
            const codeStr = data.gbCode.substring(2)
            if (codeStr === '0000') {
                datas.push(data)
            }
        })
        return datas
    }
    function getCategories(kind: string) {
        const datas: IPoiTypes[] = []
        PoiTypes.forEach((data) => {
            const gbCode = data.gbCode
            const codeStr = gbCode.substring(0, 2)
            const codeSubStr = gbCode.substring(4)
            const kindPreStr = kind.substring(0, 2)
            if (gbCode !== kind && codeStr === kindPreStr && codeSubStr === '00') {
                datas.push(data)
            }
        })
        return datas
    }

    function getTypes(catgory: string) {
        const datas: IPoiTypes[] = []
        PoiTypes.forEach((data) => {
            const gbCode = data.gbCode
            const codeStr = gbCode.substring(0, 4)
            const catgoryPreStr = catgory.substring(0, 4)
            if (gbCode !== catgory && codeStr === catgoryPreStr) {
                datas.push(data)
            }
        })
        return datas
    }

    const [kinds] = useState(getKinds())
    const [kind, setKind] = useState('')

    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([] as IPoiTypes[])

    const [types, setTypes] = useState([] as IPoiTypes[])
    const [type, setType] = useState('')

    const handleKindChange = (event: any) => {
        const { value } = event.target
        const categories = getCategories(value)
        setCategories(categories)
        setKind(value)
        setTypes([])
        setCategory('')
        setType('')
        if (props?.onChange)
            props.onChange(value)
    };

    const handleCategoryChange = (event: any) => {
        const { value } = event.target
        const types = getTypes(value)
        setTypes(types)
        setCategory(value)
        setType('')
        if (props?.onChange)
            props.onChange(value)
    }

    const handleTypeChange = (event: any) => {
        const { value } = event.target
        setType(value)
        if (props?.onChange)
            props.onChange(value)
    };

    return <div>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">大类</InputLabel>
            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={kind}
                onChange={handleKindChange}
            >
                {kinds?.map((data, i) => {
                    return <MenuItem key={i} value={data?.gbCode}>{data?.name}</MenuItem>
                })
                }
            </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label-2">中类</InputLabel>
            <Select
                disabled={categories.length === 0}
                labelId="demo-simple-select-helper-label-2"
                id="demo-simple-select-helper-2"
                value={category}
                onChange={handleCategoryChange}
            >
                {categories?.map((data, i) => {
                    return <MenuItem key={i} value={data?.gbCode}>{data?.name}</MenuItem>
                })
                }
            </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label-3">小类</InputLabel>
            <Select
                disabled={types.length === 0}
                labelId="demo-simple-select-helper-label-3"
                id="demo-simple-select-helper-3"
                value={type}
                onChange={handleTypeChange}
            >
                {types?.map((data, i) => {
                    return <MenuItem key={i} value={data?.gbCode}>{data?.name}</MenuItem>
                })
                }
            </Select>
        </FormControl>
    </div>
}