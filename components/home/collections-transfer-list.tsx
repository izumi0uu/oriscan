// @ts-nocheck
import Table from '@/components/table/Table'
import zeroEllipsis from '../ZeroEllipsis'
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import BigNumber from 'bignumber.js'
import { TriangleUpIcon, TriangleDownIcon } from '@radix-ui/react-icons'

import { formatNumber } from '@/utils'
import { FC } from 'react'
import { I } from '@/utils/infinite'
import { getKline } from './brc20-transfer-list'
import { ENV } from '@/utils/env'
import { Images } from '@/utils/images'
import * as HoverCard from '@radix-ui/react-hover-card'

interface Ranking {
  image_uri: string
  symbol: string
  name: string
  owner: number // owner 数量
  floor_price: number //地板价
  total_volume: number //总成交量
  '24h_volume': number // 24小时成交量
  '1h_floor_price_ratio': number // 1小时地板价变动率
  '24h_floor_price_ratio': number //24小时地板价变化率
  '7d_floor_price_ratio': number // 7天变化率
  update_time: string
  total_supply: number // 总供应量
  history_floor_price: {
    price: '150000'
    date: number
  }[] // 近7天地板价曲线
}

const Ratio: FC<{ value: number }> = ({ value }) => {
  const bn = new BigNumber(value)
  return <span className={!bn.lt(0) ? 'text-[#15ae1b]' : 'text-[#ef3232]'}>{bn.toFixed(2) + '%'}</span>
}
const fetcherIns = async (data: { page: number; limit: number }) => {
  const response = await fetch(`${ENV.backend}/collections/ranking?limit=${data.limit}&page=${data.page}`)
  const res = await response.json()
  return res.data
}
const columns = [
  {
    name: '#',
    key: 'symbol',
    align: 'left',
    itemStyle: { color: '#000', paddingLeft: '20px' },
    headStyle: { color: '#000', fontWeight: 500, paddingLeft: '20px' },
    render: (_: any, index: number) => `${index + 1}`,
    width: '40px',
  },
  {
    name: 'Name',
    width: '74px',
    itemStyle: { color: '#000' },
    headStyle: { color: '#000', fontWeight: 500 },
    key: 'symbol',
    align: 'left',
    render: (data: any) => (
      <div className="flex items-center space-x-2.5 justify-start cursor-pointer w-[150px]">
        <HoverCard.Root>
          <HoverCard.Trigger>
            <div className="flex sm:items-center max-sm:flex-col gap-x-2">
              <div
                style={{ backgroundImage: `url("${data.image_uri}")` }}
                className="w-[20px] h-[20px] rounded-full bg-center bg-no-repeat bg-cover"
              />
              <div className="w-[125px]">
                <div className="truncate">
                  <span className="font-medium mr-2">{data.name}</span>
                </div>
              </div>
            </div>
          </HoverCard.Trigger>
          <HoverCard.Content>
            <div className="flex sm:items-center max-sm:flex-col gap-x-2 rounded-md border-solid border-[#9f9f9f] bg-[#f2f2f2] p-4">
              <div
                className="w-[20px] h-[20px] rounded-full bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url("${data.image_uri}")` }}
              />
              <span className="font-medium">{data.name}</span>
              <span className="text-[#9f9f9f]">{data.symbol}</span>
            </div>
          </HoverCard.Content>
        </HoverCard.Root>
      </div>
    ),
  },
  {
    name: 'Price',
    key: 'floor_price',
    align: 'right',
    itemStyle: { color: '#000' },
    headStyle: { color: '#000', fontWeight: 500 },
    render: (data: any) =>
      data.floor_price ? (
        <div className="flex items-center justify-end">
          <div
            className="w-[17px] h-[17px] rounded-full overflow-hidden bg-cover mr-[10px]"
            style={{ backgroundImage: `url(${Images.HOME.BTC_LOGO_SVG})` }}
          />
          <div>{zeroEllipsis((data.floor_price / 100000000).toString())}</div>
        </div>
      ) : (
        '-'
      ),
    width: '75px',
  },
  {
    name: '1d',
    align: 'right',
    width: '109px',
    key: '1day_floor_price_ratio',
    itemStyle: { color: '#000' },
    headStyle: { color: '#000', fontWeight: 500 },
    render: (data: any) => (
      <div className=" flex items-center justify-end">
        {!new BigNumber(data['1day_floor_price_ratio']).lt(0) ? (
          <TriangleUpIcon className="w-4 text-[#15ae1b]" />
        ) : (
          <TriangleDownIcon className="w-4 text-[#ef3232]" />
        )}
        <Ratio value={data['1day_floor_price_ratio']} />
      </div>
    ),
  },
  {
    name: '7d',
    align: 'right',
    width: '108px',
    key: '7d_floor_price_ratio',

    itemStyle: { color: '#000' },
    headStyle: { color: '#000', fontWeight: 500 },
    render: (data: any) => (
      <div className=" flex items-center justify-end">
        {!new BigNumber(data['7d_floor_price_ratio']).lt(0) ? (
          <TriangleUpIcon className="w-4 text-[#15ae1b]" />
        ) : (
          <TriangleDownIcon className="w-4 text-[#ef3232]" />
        )}
        <Ratio value={data['7d_floor_price_ratio']} />
      </div>
    ),
  },
  {
    name: '30d',
    align: 'right',
    width: '108px',
    key: '30d_floor_price_ratio',
    itemStyle: { color: '#000' },
    headStyle: { color: '#000', fontWeight: 500 },
    render: (data: any) => (
      <div className=" flex items-center justify-end">
        {!new BigNumber(data['30d_floor_price_ratio']).lt(0) ? (
          <TriangleUpIcon className="w-4 text-[#15ae1b]" />
        ) : (
          <TriangleDownIcon className="w-4 text-[#ef3232]" />
        )}
        <Ratio value={data['30d_floor_price_ratio']} />
      </div>
    ),
  },
  {
    name: 'Owners',
    key: 'owner',
    align: 'right',
    itemStyle: { color: '#000' },
    headStyle: { color: '#000', fontWeight: 500 },
    render: (data: any) => formatNumber(data.owner),
  },
  {
    name: 'Total Transfer',
    align: 'right',
    key: 'total_transactions',
    itemStyle: { color: '#000' },
    headStyle: { color: '#000', fontWeight: 500 },
  },
  {
    name: 'Total Volume',
    align: 'right',
    key: 'total_volume',
    itemStyle: { color: '#000' },
    headStyle: { color: '#000', fontWeight: 500 },
    render: (data: any) => {
      const value = data['total_volume']
      return (
        <div className="flex items-center space-x-2 justify-end">
          <div
            className="w-[17px] h-[17px] rounded-full overflow-hidden bg-cover"
            style={{ backgroundImage: `url(${Images.HOME.BTC_LOGO_SVG})` }}
          />
          <span>{Number(value).toFixed(3)}</span>
        </div>
      )
    },
  },
  {
    name: 'Last 7 Days',
    align: 'right',
    key: 'symbol',
    headStyle: { color: '#000', fontWeight: 500 },
    width: 136,
    render: (data: any) => getKline(data.history_floor_price?.map((item) => +item.price), { x: 136, y: 42 }),
  },
]

const CollectionsTransferList = () => {
  const { data, loading, loadingMore, noMore } = useWindowInfiniteScroll(I(fetcherIns, { limit: 60 }), {
    threshold: 300,
    reloadDeps: [],
    //@ts-ignore
    isNoMore: (data1, data2) => {
      return data1?.page * data1?.limit >= data1?.total
    },
  })

  const dataSource = (data?.list as Ranking[]) || []

  return (
    <>
      <Table
        gap="0"
        loading={loading || loadingMore}
        data={dataSource}
        // gtodo
        onRowClick={(data) => (window.location.href = `/collections/${data.symbol}`)}
        columns={columns as []}
        className="home-transfer-table"
      />
    </>
  )
}

export default CollectionsTransferList
