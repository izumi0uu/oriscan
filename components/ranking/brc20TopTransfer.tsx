// @ts-nocheck
import Table from '@/components/table/Table'
import { commify } from 'ethers/lib/utils'
import { FC, useEffect, useState } from 'react'
import { enFormatUnicode } from '@/utils'
import Dropdown, { MenuItemWrapper, MenuItemText } from '@/components/dropdown'
import { LoadingOutlined } from '@ant-design/icons'
import { ENV } from '@/utils/env'
import { Images } from '@/utils/images'

interface Brc20TransferRanking {
  tick: string
  holders: number
  mints: number
  max: number
  avg_price: string
  transfer_count: number
  trade_urls: { name: string; url: string }[]
  pendings: string
  full_market_cap: any
}
export const Trade: FC<{ urls: { name: string; url: string }[] }> = ({ urls }) => {
  return (
    <>
      <Dropdown
        contentStyle={{ width: '100%' }}
        menu={[
          ...urls.map((item) => {
            return {
              key: item.name,
              label: (
                <MenuItemWrapper
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(item.url, '_blank')
                  }}
                >
                  <MenuItemText style={{ marginLeft: 5 }}>{item.name}</MenuItemText>
                </MenuItemWrapper>
              ),
            }
          }),
        ]}
      >
        <div className="text-[13px] font-[light]  w-[70px] h-[30px] flex items-center justify-center text-[#656565] rounded-[13px]">
          Trade
        </div>
      </Dropdown>
    </>
  )
}
const fetcherBrc20 = async (params: { days: number }) => {
  const response = await fetch(`${ENV.backend}/brc20/top/transfer?days=${params.days}`)
  const res = await response.json()
  return res.data || []
}
const daysOption = [
  { label: '1D', value: 1 },
  { label: '3D', value: 3 },
  { label: '7D', value: 7 },
]
const defaultDays = 1
export const Brc20TopTransferPC = () => {
  const [loading, setLoading] = useState(false)
  const [checkedDays, setCheckedDays] = useState(defaultDays)
  const [data, setData] = useState<Brc20TransferRanking[]>([])
  const getData = async (days: number) => {
    setLoading(true)
    const data = await fetcherBrc20({ days: days })
    setLoading(false)
    setData(data || [])
  }
  useEffect(() => {
    getData(defaultDays)
  }, [])
  return (
    <div>
      <div className="flex justify-between items-center bg-[#ffffff] px-4 py-3 text-[#737373]">
        <div className="font-bold text-[#4F4F4F] text-lg">Transfer Rank</div>
        <div className="flex bg-[#F8F8F8] px-[15px] rounded-[5px] gap-x-[8px] py-[5px]">
          {daysOption.map((item) => {
            return (
              <div
                key={item.value}
                className={`cursor-pointer px-[10px] pb-[3px] text-[#4F4F4F] ${
                  item.value === checkedDays ? 'border-b-[2px] border-[#f2c74d]' : ''
                }`}
                onClick={() => {
                  setCheckedDays(item.value)
                  getData(item.value)
                }}
              >
                {item.label}
              </div>
            )
          })}
        </div>
      </div>
      <Table
        className="ranking-table"
        tableHeaderStyle={{ backgroundColor: 'rgb(240, 240, 240)' }}
        gap="0"
        loading={loading}
        data={data}
        onRowClick={(data) => (window.location.href = `/coin/brc20/${encodeURIComponent(data.tick)}`)}
        columns={[
          {
            name: 'Tick',
            key: 'tick',
            headStyle: { fontWeight: 400 },
            width: '150px',
            render: (_, index) => (
              <div className="font-bold flex items-center gap-x-[8px] pl-[20px] h-[30px]">
                {index === 0 && <img src={Images.COMMON.RANK1_SVG} alt="" width={20} />}
                {index === 1 && <img src={Images.COMMON.RANK2_SVG} alt="" width={20} />}
                {index === 2 && <img src={Images.COMMON.RANK3_SVG} alt="" width={20} />}
                {index > 2 && <div className="w-[20px]" />}
                <div>{enFormatUnicode(_.tick)}</div>
                {_.pendings !== '' && (
                  <span className="font-normal text-orange">
                    <LoadingOutlined />
                    {' ' + _.pendings}
                  </span>
                )}
              </div>
            ),
          },
          {
            name: 'Transfers',
            headStyle: { fontWeight: 400 },
            key: 'transfer_count',
            render: (_) => commify(_.transfer_count || 0),
          },
          //   { name: 'Mints', key: 'mints', render: (_) => commify(_.mints || 0) },
          {
            name: 'Holders',
            headStyle: { fontWeight: 400 },
            key: 'holders',
            align: 'center',
            width: '80px',
            render: (_) => commify(_.holders || 0),
          },
          {
            name: 'Avg.Price (sats)',
            headStyle: { fontWeight: 400 },
            key: 'avg_price',
            align: 'center',
            width: 100,
            render: (_) => {
              return (
                <div className="flex justify-center items-center gap-x-[6px]">
                  {/* <img src="https://cdn.name3.net/name3/coins/btc.svg" alt="" width={12} /> */}
                  {/* <span>{commify(_.avg_price || 0)}</span> */}
                  <span>
                    {!_.avg_price && '-'}
                    {_.avg_price && parseFloat(_.avg_price) >= 100
                      ? commify(parseFloat(_.avg_price).toFixed(0) || 0)
                      : null}
                    {_.avg_price && parseFloat(_.avg_price) >= 10 && parseFloat(_.avg_price) < 100
                      ? commify(parseFloat(_.avg_price).toFixed(1) || 0)
                      : null}
                    {_.avg_price && parseFloat(_.avg_price) >= 1 && parseFloat(_.avg_price) < 10
                      ? commify(parseFloat(_.avg_price).toFixed(2) || 0)
                      : null}
                    {_.avg_price && parseFloat(_.avg_price) < 1
                      ? commify(parseFloat(_.avg_price).toFixed(5) || 0)
                      : null}
                  </span>
                </div>
              )
            },
          },
          {
            name: 'Full Market Cap',
            headStyle: { fontWeight: 400 },
            key: 'full_market_cap',
            render: (_) => '$' + commify(_.full_market_cap || 0),
          },
          // {
          //   name: '',
          //   key: 'holders',
          //   render: (_) => {
          //     return <Trade urls={_.trade_urls || []} />
          //   },
          // },
          //   {
          //     name: 'Progress',
          //     key: 'max',
          //     render: (_) => {
          //       return <>{_.mints && _.max ? ((+(_.mints || 0) * 100) / +_.max).toFixed(2) : 0}%</>
          //     },
          //   },
        ]}
      />
      {!loading && <div className="mt-[18px] text-[12px] text-[gray] text-center">No More Data</div>}
    </div>
  )
}

const Brc20MobileDetail: FC<{ data: Brc20TransferRanking }> = ({ data }) => {
  const handleGoDetail = () => {
    window.location.href = `/coin/brc20/${encodeURIComponent(data.tick)}`
  }
  return (
    <div className="mt-[8px] flex-1" onClick={handleGoDetail}>
      <div className="grid gap-x-[15px] grid-cols-2">
        <div className="flex gap-x-4 items-center">
          <div className="flex  justify-around text-[12px]">
            <span className="text-[#9F9F9F] w-[40px] block">Tick: </span>
            <div className="text-[#947308] cursor-pointer text-[12px]">{enFormatUnicode(data?.tick)}</div>
            {data?.pendings !== '' && (
              <div className="text-[#947308] cursor-pointer text-[12px] ml-1 align-bottom">
                {'  '}
                <LoadingOutlined />
                {' ' + data?.pendings}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-x-1 text-[12px]">
            <div className="flex">
              <span className="text-[#9F9F9F] w-[55px] block">Holders: </span>
              <div className="flex items-center space-x-2">
                <span>{data?.holders}</span>
              </div>
            </div>
            <span className="w-[10px]" />
          </div>
        </div>
      </div>
      <div className="grid gap-x-[15px] grid-cols-2">
        {/* <div>
          <div className="text-[12px] mt-[10px] flex">
            <span className="text-[#9F9F9F] w-[40px] block">mints: </span>
            <div className="">{commify(data?.mints || 0)}</div>
          </div>
        </div> */}
        <div className=" text-[12px] mt-[5px] flex">
          <span className="text-[#9F9F9F] w-[55px] block">Avg Price(sats): </span>
          <div className="">
            {/* {formatUnits(
              parseUnits('' + (data.avg_price || 0) * 100000000, 18)
                .div(BigNumber.from('100000000'))
                .div(BigNumber.from('100000000')),
              18
            )} */}
            {data.avg_price ? commify(parseFloat(data.avg_price).toFixed(5) || 0) : '-'}
          </div>
        </div>
        <div className="flex text-[12px]  mt-[5px]">
          <span className="text-[#9F9F9F] w-[60px] block">Transfers: </span>
          <div className="">{data.transfer_count}</div>
        </div>
      </div>
      <div className="grid gap-x-[15px] items-center grid-cols-2">
        <div className=" text-[12px] mt-[9px] flex">
          <Trade urls={data.trade_urls || []} />
        </div>
      </div>
      {/* <div>
        <div className="text-[12px] mt-[10px] flex">
          <span className="text-[#9F9F9F] w-[85px] block">Deploy Time: </span>
          <div className="">{dayjs(data?.deploy_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
      </div> */}
      <div className="h-[1px] w-[100%] bg-[#E8E8E8] mt-[15px] mx-[auto] mb-[16px]" />
    </div>
  )
}

export const Brc20TopTransferMobile = () => {
  const [checkedDays, setCheckedDays] = useState(defaultDays)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Brc20TransferRanking[]>([])
  const getData = async (days: number) => {
    setLoading(true)
    const data = await fetcherBrc20({ days: days })
    setLoading(false)
    setData(data || [])
  }
  useEffect(() => {
    getData(defaultDays)
  }, [])
  return (
    <div>
      <div className="flex justify-between items-center bg-[#ffffff] px-4 py-3 text-[#737373]">
        <div className="font-bold text-[#4F4F4F] text-lg">Transfer Rank</div>
        <div className="flex bg-[#F8F8F8] px-[15px] rounded-[5px] gap-x-[8px] py-[5px]">
          {daysOption.map((item) => {
            return (
              <div
                key={item.value}
                className={`cursor-pointer px-[10px] pb-[3px] text-[#4F4F4F] ${
                  item.value === checkedDays ? 'border-b-[2px] border-[#f2c74d]' : ''
                }`}
                onClick={() => {
                  setCheckedDays(item.value)
                  getData(item.value)
                }}
              >
                {item.label}
              </div>
            )
          })}
        </div>
      </div>
      {data.map((item, index) => {
        return (
          <div key={index} className="flex gap-x-[8px]">
            {/* <div className="w-[20px] text-[12px] mt-[8px]">{index + 1}</div> */}
            {index === 0 && <img src={Images.COMMON.RANK1_SVG} alt="" width={20} className="mt-[10px] h-[20px]" />}
            {index === 1 && <img src={Images.COMMON.RANK2_SVG} alt="" width={20} className="mt-[10px] h-[20px]" />}
            {index === 2 && <img src={Images.COMMON.RANK3_SVG} alt="" width={20} className="mt-[10px] h-[20px]" />}
            {index > 2 && <div className="w-[20px]" />}
            <Brc20MobileDetail key={index} data={item} />
          </div>
        )
      })}
      {loading && <div className="mt-[18px] text-[12px] text-[gray] text-center">loading ...</div>}
      {!loading && !data.length && <div className="mt-[18px] text-[12px] text-[gray] text-center">No More Data</div>}
      {/* {(loadingMore || loading) && <div className="mt-[18px] text-[12px] text-[gray] text-center">loading ...</div>}
      {noMore && <div className="mt-[18px] text-[12px] text-[gray] text-center">No More Data</div>} */}
    </div>
  )
}
