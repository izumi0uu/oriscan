// @ts-nocheck
import Table from '@/components/table/Table'
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import BigNumber from 'bignumber.js'
import { formatNumber } from '@/utils'
import { Canvas, Chart, Line } from '@antv/f2'
import { FC, useEffect, useRef } from 'react'
import { I } from '@/utils/infinite'
import { ENV } from '@/utils/env'
import { Images } from '@/utils/images'

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
const CV: FC<{ data: { price: string; date: number }[]; up: boolean }> = ({ data, up }) => {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current && ref.current.getContext('2d') && data?.length) {
      const { props } = (
        <Canvas context={ref.current.getContext('2d') || undefined}>
          <Chart
            data={data.map((item) => ({ ...item, price: Number(item.price) }))}
            scale={{
              price: {
                min: data.map((item) => Number(item.price)).sort((a, b) => a - b)[0] || 0,
                max: data.map((item) => Number(item.price)).sort((a, b) => b - a)[0] || 0,
              },
            }}
          >
            <Line x="date" y="price" style={{ lineWidth: '1px', stroke: up ? '#15ae1b' : '#ed6969' }} />
          </Chart>
        </Canvas>
      )
      new Canvas(props).render()
    }
  }, [data, up])

  return <canvas ref={ref} width="180" height="40" />
}
const columnsIns = [
  { name: '', key: 'symbol', render: (_: any, index: number) => `${index + 1}`, width: '80px' },
  {
    name: 'Name',
    key: 'symbol',
    render: (data: any) => (
      <div className="flex items-center space-x-2.5 justify-start w-full cursor-pointer">
        <div
          className="w-[20px] h-[20px] rounded-full bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url("${data.image_uri}")` }}
        />
        <span className=" font-bold text-[#656565]">{data.name}</span>
        <span className="text-[#9f9f9f]">{data.symbol}</span>
      </div>
    ),
    width: '300px',
  },
  {
    name: 'Price',
    key: 'floor_price',
    render: (data: any) => (
      <div className="flex items-center space-x-2">
        <div
          className="w-[17px] h-[17px] rounded-full overflow-hidden bg-cover"
          style={{ backgroundImage: `url(${Images.HOME.BTC_LOGO_SVG})` }}
        />
        <span>{new BigNumber(data.floor_price).div(100000000).toString()}</span>
      </div>
    ),
  },
  { name: '1h', key: '1h_floor_price_ratio', render: (data: any) => <Ratio value={data['1h_floor_price_ratio']} /> },
  { name: '24h', key: '24h_floor_price_ratio', render: (data: any) => <Ratio value={data['24h_floor_price_ratio']} /> },
  { name: '7d', key: '7d_floor_price_ratio', render: (data: any) => <Ratio value={data['7d_floor_price_ratio']} /> },
  { name: 'Owners', key: 'owner', render: (data: any) => formatNumber(data.owner) },
  {
    name: '24 Volume',
    key: '24h_volume',
    render: (data: any) => (
      <div className="flex items-center space-x-2">
        <div
          className="w-[17px] h-[17px] rounded-full overflow-hidden bg-cover"
          style={{ backgroundImage: `url(${Images.HOME.BTC_LOGO_SVG})` }}
        />
        <span>{new BigNumber(data['24h_volume']).div(100000000).toString()}</span>
      </div>
    ),
  },
  {
    name: 'Last 7 Days',
    key: 'symbol',
    width: '200px',
    render: (data: any) => (
      <div>
        <CV data={data.history_floor_price} up={new BigNumber(data['7d_floor_price_ratio']).gte(0)} />
      </div>
    ),
  },
]

export const InsPC = () => {
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
        tableHeaderStyle={{ padding: '0 30px' }}
        tableBodyStyle={{ padding: '0 30px' }}
        gap="0"
        loading={loading || loadingMore}
        data={dataSource}
        onRowClick={(data) => (window.location.href = `/collections/${data.symbol}`)}
        columns={columnsIns as []}
      />
      {!loading && !loadingMore && noMore && (
        <div className="mt-[18px] text-[12px] text-[gray] text-center">No More Data</div>
      )}
    </>
  )
}

const InsMobileDetail: FC<{ data: Ranking }> = ({ data }) => {
  const handleGoDetail = () => {
    window.location.href = `/collections/${data.symbol}`
  }
  return (
    <div className="mt-[8px]" onClick={handleGoDetail}>
      <div className="grid gap-x-[15px] grid-cols-2">
        <div className="flex gap-x-4 items-center">
          <div className="w-[30px] h-[30px]">
            <div
              className="w-full h-full rounded-full bg-center bg-no-repeat bg-cover"
              style={{ backgroundImage: `url("${data?.image_uri}")` }}
            />
          </div>
          <div className="flex flex-col justify-around h-full flex-1">
            <div className="text-[#947308] cursor-pointer text-[12px]">{data?.name}</div>
            <div className="text-[#9F9F9F] text-[12px] flex gap-x-1 mt-[3px] break-all">{data?.symbol}</div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-x-1 text-[12px]">
            <div className="flex">
              <span className="text-[#9F9F9F] w-[70px] block">Price: </span>
              <div className="flex items-center space-x-2">
                <div
                  className="w-[14px] h-[14px] rounded-full overflow-hidden bg-cover"
                  style={{ backgroundImage: `url(${Images.HOME.BTC_LOGO_SVG})` }}
                />
                <span>{new BigNumber(data.floor_price).div(100000000).toString()}</span>
              </div>
            </div>
            <span className="w-[10px]" />
          </div>
          <div className="flex text-[12px] mt-[3px]">
            <span className="text-[#9F9F9F] w-[70px] block">Owners: </span> <div>{formatNumber(data.owner)}</div>
          </div>
        </div>
      </div>
      <div className="grid gap-x-[15px] grid-cols-2">
        <div>
          <div className="text-[12px] mt-[10px] flex">
            <span className="text-[#9F9F9F] w-[47px] block">1h: </span>
            <div className="text-[#3498DB] cursor-pointer">
              <Ratio value={data['1h_floor_price_ratio']} />
            </div>
          </div>
          <div className="text-[#3498DB] text-[12px] mt-[5px] flex">
            <span className="text-[#9F9F9F] w-[47px] block">7d: </span>
            <div className="text-[#3498DB] cursor-pointer">
              <Ratio value={data['7d_floor_price_ratio']} />
            </div>
          </div>
        </div>
        <div>
          <div className="text-[#3498DB] text-[12px] mt-[10px] flex">
            <span className="text-[#9F9F9F] w-[70px] block">24h: </span>
            <div className="text-[#3498DB] cursor-pointer">
              <Ratio value={data['24h_floor_price_ratio']} />
            </div>
          </div>
          <div className="text-[12px] mt-[5px] flex">
            <span className="text-[#9F9F9F] w-[70px] block">24 Volume: </span>
            <div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-[14px] h-[14px] rounded-full overflow-hidden bg-cover"
                  style={{ backgroundImage: `url(${Images.HOME.BTC_LOGO_SVG})` }}
                />
                <span>{new BigNumber(data['24h_volume']).div(100000000).toString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-[10px] flex">
        <span className="text-[#9F9F9F] w-[70px] block text-[12px]">Last 7 Days: </span>
        <CV data={data.history_floor_price} up={new BigNumber(data['7d_floor_price_ratio']).gte(0)} />
      </div>
      <div className="h-[1px] w-[100%] bg-[#E8E8E8] mt-[15px] mx-[auto] mb-[16px]" />
    </div>
  )
}

export const InsMobile = () => {
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
      {dataSource.map((item, index) => {
        return (
          <div key={index} className="flex gap-x-1">
            <div className="w-[20px] text-[12px] mt-[8px]">{index + 1}</div>
            <InsMobileDetail key={index} data={item} />
          </div>
        )
      })}
      {(loadingMore || loading) && <div className="mt-[18px] text-[12px] text-[gray] text-center">loading ...</div>}
      {!loadingMore && !loading && noMore && (
        <div className="mt-[18px] text-[12px] text-[gray] text-center">No More Data</div>
      )}
    </>
  )
}
