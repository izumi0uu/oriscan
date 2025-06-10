import Table from '@/components/table/Table'
import BigNumber from 'bignumber.js'
import zeroEllipsis from '../ZeroEllipsis'
import { TriangleUpIcon, TriangleDownIcon } from '@radix-ui/react-icons'

import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { formatCurrency } from '@/utils'
import useRolling from '@/hooks/useRolling'
import { ENV } from '@/utils/env'
import { Images } from '@/utils/images'

const Ratio: FC<{ value: number }> = ({ value }) => {
  const bn = new BigNumber(value)
  return <span className={!bn.lt(0) ? 'text-[#15ae1b]' : 'text-[#ef3232]'}>{bn.toFixed(2) + '%'}</span>
}
export function transferToNumber(inputNumber: any) {
  if (isNaN(inputNumber)) {
    return inputNumber
  }
  inputNumber = '' + inputNumber
  inputNumber = parseFloat(inputNumber)
  let eformat = inputNumber.toExponential() // 转换为标准的科学计数法形式（字符串）
  let tmpArray = eformat.match(/\d(?:\.(\d*))?e([+-]\d+)/) // 分离出小数值和指数值
  let number = inputNumber.toFixed(Math.max(0, (tmpArray[1] || '').length - tmpArray[2]))
  return number
}
export const getKline = (nums: number[] = [], size: { x: number; y: number }) => {
  const min = Math.min(...nums),
    max = Math.max(...nums),
    points = [],
    percentage = (max - min) / 100,
    lattice = (size.x / (nums.length - 1)) >> 0,
    full = nums[0] > nums[nums.length - 1]

  for (let i = 0, len = nums.length; i < len; ++i) {
    let current_percentage = ((nums[i] - min) / percentage) >> 0
    points.push(`${lattice * i}, ${(size.y / 100) * current_percentage}`)
  }
  return (
    <div className=" ml-10">
      <svg
        style={{ transform: 'rotateX(180deg)' }}
        width={size.x}
        height={size.y}
        version="1.1"
        xmlns="http://www./2000/svg"
      >
        <polyline fill="none" stroke={full ? '#ED6969' : '#04B03E'} points={points.join(' ')} />
      </svg>
    </div>
  )
}

const Brc20TransferList = ({ setLastUpdateTime }: any) => {
  const [price, setPrice] = useState(0)
  useEffect(() => {
    const fetchBtcPrice = async () => {
      const response = await fetch(`${ENV.backend}/btc-price`)
      const res = await response.json()
      setPrice(res.data.price)
    }
    fetchBtcPrice()
  }, [])

  const columns = [
    {
      name: '#',
      key: 'ind',
      align: 'left',
      width: '40px',
      render: (_: any, index: number) => `${index + 1}`,
      itemStyle: { color: '#000', paddingLeft: '20px' },
      headStyle: { color: '#000', fontWeight: 500, paddingLeft: '20px' },
    },
    {
      name: 'Tick',
      key: 'tick',
      align: 'left',
      width: '70px',
      itemStyle: { color: '#000' },
      headStyle: { color: '#000', fontWeight: 500 },
      render: (data: any) => (
        <div>
          <div className="flex sm:items-center max-sm:flex-col gap-x-2">
            {data?.icon ? (
              <div
                style={{ backgroundImage: `url("${data.icon || ''}")` }}
                className="w-[20px] h-[20px] rounded-full bg-center bg-no-repeat bg-cover"
              />
            ) : (
              <div className="w-[20px] h-[20px] rounded-full bg-black text-white text-center uppercase">
                {data?.tick_show?.slice(0, 1)}
              </div>
            )}

            <span className="font-medium mr-2"> {data?.tick_show || ''}</span>
          </div>
        </div>
      ),
    },
    {
      name: 'Price',
      key: 'price_btc',
      align: 'right',
      width: 275,
      itemStyle: { color: '#000' },
      headStyle: { color: '#000', fontWeight: 500 },
      render: (data: any) => {
        return data.price_btc ? <>$ {zeroEllipsis(transferToNumber(Number(data.price_btc) * price).toString())}</> : '-'
      },
    },
    {
      name: '1d',
      key: 'one_day_price_ratio',
      align: 'right',
      width: '109px',
      itemStyle: { color: '#000' },
      headStyle: { color: '#000', fontWeight: 500 },
      render: (data: any) =>
        data.one_day_price_ratio === '--' ? (
          '--'
        ) : (
          <div className=" flex items-center justify-end">
            {!new BigNumber(data.one_day_price_ratio).lt(0) ? (
              <TriangleUpIcon className="w-4 text-[#15ae1b]" />
            ) : (
              <TriangleDownIcon className="w-4 text-[#ef3232]" />
            )}
            <Ratio value={data.one_day_price_ratio} />
          </div>
        ),
    },
    {
      name: '7d',
      width: '108px',
      key: 'seven_days_price_ratio',
      align: 'right',
      itemStyle: { color: '#000' },
      headStyle: { color: '#000', fontWeight: 500 },
      render: (data: any) =>
        data.seven_days_price_ratio === '--' ? (
          '--'
        ) : (
          <div className=" flex items-center justify-end">
            {!new BigNumber(data.seven_days_price_ratio).lt(0) ? (
              <TriangleUpIcon className="w-4 text-[#15ae1b]" />
            ) : (
              <TriangleDownIcon className="w-4 text-[#ef3232]" />
            )}
            <Ratio value={data.seven_days_price_ratio} />
          </div>
        ),
    },
    {
      name: '30d',
      width: '108px',
      key: 'thirty_days_price_ratio',
      align: 'right',
      itemStyle: { color: '#000' },
      headStyle: { color: '#000', fontWeight: 500 },
      render: (data: any) =>
        data.thirty_days_price_ratio === '--' ? (
          '--'
        ) : (
          <div className=" flex items-center justify-end">
            {!new BigNumber(data.thirty_days_price_ratio).lt(0) ? (
              <TriangleUpIcon className="w-4 text-[#15ae1b]" />
            ) : (
              <TriangleDownIcon className="w-4 text-[#ef3232]" />
            )}
            <Ratio value={data.thirty_days_price_ratio} />
          </div>
        ),
    },
    {
      name: 'Total Volume',
      key: 'total_volume',
      width: '174px',
      align: 'right',
      itemStyle: { color: '#000' },
      headStyle: { color: '#000', fontWeight: 500 },
      render: (data: any) => (
        <div className="flex items-center justify-end gap-x-2">
          <div
            className="w-[17px] h-[17px] rounded-full overflow-hidden bg-cover"
            style={{ backgroundImage: `url(${Images.HOME.BTC_LOGO_SVG})` }}
          />
          {zeroEllipsis(data.total_volume.toString())}
        </div>
      ),
    },
    {
      name: 'Full.Mkt.Cap',
      key: 'full_market_cap',
      align: 'right',
      width: 152,
      itemStyle: { color: '#000', marginRight: '100px' },
      headStyle: { color: '#000', fontWeight: 500 },
      render: (data: any) => <div>{'$' + formatCurrency(data.full_market_cap)}</div>,
    },
    {
      name: 'Last 7 Days',
      headStyle: { color: '#000', fontWeight: 500 },
      align: 'right',
      key: 'symbol',
      width: 201,
      render: (data: any) => getKline(data.history_floor_prices?.map((item: any) => item.price), { x: 136, y: 42 }),
    },
  ]

  const [data, isLoading, getMore] = useRolling(`${ENV.backend}/home/brc20/ranking`)

  const lastUpdateTime = (data as any)?.data?.last_update_timestamp
    ? (data as any).data.last_update_timestamp * 1000
    : (data as any)?.data?.last_update_timestamp
  setLastUpdateTime(lastUpdateTime)
  let doc = typeof window === 'undefined' ? void 0 : document
  return (
    <Table
      gap="0"
      loading={isLoading as boolean}
      data={data as any}
      onRowClick={(data) => (window.location.href = `/coin/brc20/${(data as any).tick}`)}
      columns={columns as []}
      className="home-transfer-table"
      sticky
      rollingScroll
      target={doc}
      onRolling={getMore as any}
    />
  )
}

export default Brc20TransferList
