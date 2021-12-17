import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { ISpecifyDatas, SpecifyDatas } from './specifyDatas';
export interface SpecifySelectProps {
    onChange?: (value: string) => void
}
export function SpecifySelect(props: SpecifySelectProps) {
    function sort(datas: ISpecifyDatas[]) {
        datas.sort((a, b) => {
            if (a.gbCode && b.gbCode) {
                return a.gbCode.localeCompare(b.gbCode)
            } else {
                return -1
            }
        })
    }

    function getProvinces() {
        const datas: ISpecifyDatas[] = []
        SpecifyDatas.forEach((data) => {
            const codeStr = data.gbCode.substring(5)
            const codeMiddleStr = data.gbCode.substring(3, 5)
            if (codeStr === '0000' && codeMiddleStr !== '00') {
                datas.push(data)
            }
        })
        sort(datas)
        return datas
    }

    function getCities(province: string) {
        const datas: ISpecifyDatas[] = []
        SpecifyDatas.forEach((data) => {
            const gbCode = data.gbCode
            if (province === "156110000") {
                const codeStr = gbCode.substring(0, 5)
                const cityPreStr = province.substring(0, 5)
                if (gbCode !== province && codeStr === cityPreStr) {
                    datas.push(data)
                }
            } else {
                const codeStr = gbCode.substring(0, 5)
                const codeSubStr = gbCode.substring(7)
                const cityPreStr = province.substring(0, 5)
                if (gbCode !== province && codeStr === cityPreStr && codeSubStr === '00') {
                    datas.push(data)
                }
            }
        })
        sort(datas)
        return datas
    }

    function getCounties(city: string) {
        const datas: ISpecifyDatas[] = []
        SpecifyDatas.forEach((data) => {
            const gbCode = data.gbCode.toString()
            const catgoryStr = city.toString()
            const codeStr = gbCode.substring(0, 7)
            const catgoryPreStr = catgoryStr.substring(0, 7)
            if (gbCode !== catgoryStr && codeStr === catgoryPreStr) {
                datas.push(data)
            }
        })
        sort(datas)
        return datas
    }



    const [provinces] = useState(getProvinces())
    const [province, setProvince] = useState('')

    const [cities, setCities] = useState([] as ISpecifyDatas[])
    const [city, setCity] = useState('')

    const [county, setCounty] = useState('')
    const [counties, setCounties] = useState([] as ISpecifyDatas[])

    const handleProvinceChange = (event: any) => {
        const { value } = event.target
        const county = getCities(value)
        setCities(county)
        setProvince(value)
        setCity('')
        setCounty('')
        setCounties([])
        if (props?.onChange)
            props.onChange(value)
    };

    const handleCityChange = (event: any) => {
        const { value } = event.target
        const counties = getCounties(value)
        setCounties(counties)
        setCounty('')
        setCity(value)
        if (props?.onChange)
            props.onChange(value)
    }

    const handleCountyChange = (event: any) => {
        const { value } = event.target
        setCounty(value)
        if (props?.onChange)
            props.onChange(value)
    }

    return <div>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">一级</InputLabel>
            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={province}
                onChange={handleProvinceChange}
            >
                {provinces?.map((data, i) => {
                    return <MenuItem key={i} value={data?.gbCode}>{data?.name}</MenuItem>
                })
                }
            </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label-2">二级</InputLabel>
            <Select
                disabled={cities.length === 0}
                labelId="demo-simple-select-helper-label-2"
                id="demo-simple-select-helper-2"
                value={city}
                onChange={handleCityChange}
            >
                {cities?.map((data, i) => {
                    return <MenuItem key={i} value={data?.gbCode}>{data?.name}</MenuItem>
                })
                }
            </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label-3">三级</InputLabel>
            <Select
                disabled={counties.length === 0}
                labelId="demo-simple-select-helper-label-3"
                id="demo-simple-select-helper-3"
                value={county}
                onChange={handleCountyChange}
            >
                {counties?.map((data, i) => {
                    return <MenuItem key={i} value={data?.gbCode}>{data?.name}</MenuItem>
                })
                }
            </Select>
        </FormControl>
    </div>
}