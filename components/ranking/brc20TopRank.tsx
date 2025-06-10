// @ts-nocheck
import Table from '@/components/table/Table'
import { commify } from 'ethers/lib/utils'
import { FC, useEffect, useState } from 'react'
import { enFormatUnicode } from '@/utils'
import Dropdown, { MenuItemWrapper, MenuItemText } from '@/components/dropdown'
import { Trade } from './brc20TopTransfer'
import { LoadingOutlined } from '@ant-design/icons'
import { ENV } from '@/utils/env'
import { Images } from '@/utils/images'

interface Brc20MintsRanking {
  tick: string // 集合名称
  holders: number // 总用户数  保留字段 本期不显示
  mints: number
  max: number
  trade_urls: { name: string; url: string }[]
  pendings: string
}
const MintBtn: FC<{ urls: { name: string; url: string }[] }> = ({ urls }) => {
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
          Mint
        </div>
      </Dropdown>
    </>
  )
}
const fetcherBrc20 = async (params: { days: number }) => {
  const response = await fetch(`${ENV.backend}/brc20/top/mint?days=${params.days}`)
  const res = await response.json()
  return res.data || []
}
const daysOption = [
  { label: '1D', value: 1 },
  { label: '3D', value: 3 },
  { label: '7D', value: 7 },
]
const defaultDays = 1
export const Brc20TopRankPC = () => {
  const [loading, setLoading] = useState(false)
  const [checkedDays, setCheckedDays] = useState(defaultDays)
  const [data, setData] = useState<Brc20MintsRanking[]>([])
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
        <div className="font-bold text-[#4F4F4F] text-lg">Mint Rank</div>
        <div className="flex bg-[#F8F8F8] px-[15px] rounded-[5px] gap-x-[8px]  py-[5px]">
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
            headStyle: { fontWeight: 400 },
            key: 'tick',
            width: '160px',
            render: (_, index) => (
              <div className="font-bold flex gap-x-[8px] items-center pl-[20px]">
                {index === 0 && <img src={Images.COMMON.RANK1_SVG} alt="" width={20} />}
                {index === 1 && <img src={Images.COMMON.RANK2_SVG} alt="" width={20} />}
                {index === 2 && <img src={Images.COMMON.RANK3_SVG} alt="" width={20} />}
                {index > 2 && <div className="w-[20px]" />}
                <span>{enFormatUnicode(_.tick)}</span>
                {_.pendings !== '' && (
                  <span className="font-normal text-orange">
                    <LoadingOutlined />
                    {' ' + _.pendings}
                  </span>
                )}
              </div>
            ),
          },
          { name: 'Holders', headStyle: { fontWeight: 400 }, key: 'holders', render: (_) => commify(_.holders || 0) },
          {
            name: 'Progress',
            headStyle: { fontWeight: 400 },
            key: 'max',
            render: (_) => {
              let percent = _.mints && _.max ? (parseInt(+(_.mints || 0) * 100) / +_.max).toFixed(2) : 0
              if (percent === '100.00' && _.mints !== _.max) percent = '99.99' // Hack处理，避免四舍五入到 100
              const isFullMint = _.mints === _.max
              return (
                <div className="flex justify-center items-center">
                  <div className="w-[74px] relative bg-[#D9D9D9] h-[4px] rounded-[10px]">
                    <div
                      className={`bg-[#ea796c] absolute left-0 top-0 h-[100%] rounded-[10px]`}
                      style={{
                        width: `${percent}%`,
                        background: isFullMint ? '#2099DE' : 'linear-gradient(180deg, #F2B073 14.58%, #EF3F5E 100%)',
                      }}
                    />
                  </div>
                  <div className="text float-left ml-[10px]">{percent}%</div>
                </div>
              )
            },
          },
          {
            name: '',
            key: 'max',
            headStyle: { fontWeight: 400 },
            align: 'center',
            width: '50px',
            render: (_) => {
              const isFullMint = _.mints === _.max
              return isFullMint ? <Trade urls={_.trade_urls || []} /> : <MintBtn urls={_.trade_urls || []} />
            },
          },
        ]}
      />
      {/* {loadingMore && !loading && <div className="mt-[18px] text-[12px] text-[gray] text-center">No More Data</div>} */}
    </div>
  )
}

const Brc20MobileDetail: FC<{ data: Brc20MintsRanking }> = ({ data }) => {
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
        <div>
          <div className="text-[12px] mt-[10px] flex">
            <span className="text-[#9F9F9F] w-[40px] block">mints: </span>
            <div className="">{commify(data?.mints || 0)}</div>
          </div>
        </div>
        <div className=" text-[12px] mt-[5px] flex">
          <span className="text-[#9F9F9F] w-[55px] block">Progress: </span>
          <div className="">{data.mints && data.max ? ((+(data.mints || 0) * 100) / +data.max).toFixed(2) : 0}%</div>
        </div>
      </div>
      <div className="flex gap-x-4 items-center">
        <div className="flex  justify-around text-[12px] mt-[10px]">
          {data.mints === data.max ? <Trade urls={data.trade_urls || []} /> : <MintBtn urls={data.trade_urls || []} />}
        </div>
      </div>
      <div className="h-[1px] w-[100%] bg-[#E8E8E8] mt-[15px] mx-[auto] mb-[16px]" />
    </div>
  )
}

export const Brc20TopRankMobile = () => {
  const [checkedDays, setCheckedDays] = useState(defaultDays)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Brc20MintsRanking[]>([])
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
        <div className="font-bold text-[#4F4F4F] text-lg">Mint Rank</div>
        <div className="flex bg-[#F8F8F8] px-[15px] rounded-[5px] gap-x-[8px]  py-[5px]">
          {daysOption.map((item) => {
            return (
              <div
                key={item.value}
                className={`cursor-pointer px-[10px] pb-[3px] text-[#4F4F4F]  ${
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
