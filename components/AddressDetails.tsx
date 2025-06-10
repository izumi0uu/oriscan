// @ts-nocheck
'use client'

import useSWR from 'swr'
import { fetcher } from '@/utils/helpers'
import { ActivityListItem, InscriptionResponseOrdinalScan } from '@/utils/types'
import Ellipsis from './Ellipsis'
import InscriptionCardOrdinalScan from './InscriptionCardOrdinalScan'
import { FC, useEffect, useMemo, useState } from 'react'
import InstListMobile from '@/components/address/instListMobile'
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import { I } from '@/utils/infinite'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import Link from 'next/link'
import { formatNumber } from '@/utils'
import dayjs from 'dayjs'
import Brc20ActivityList, { Activity } from './brc20-activity-list'
import Brc20ListMobile from '@/components/address/brc20ListMobile'
import ORImg from '@/components/ORImg'
import InsTList from '@/components/address/inst'
import Copy from './copy'
import { Pagination, Switch } from 'antd'
import { useSearchParams } from 'next/navigation'
import { LoadingOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { ENV } from '@/utils/env'
import { Images } from '@/utils/images'

interface B20Item {
  address: string
  available_balance: string
  block_height: number
  created_at: string
  overall_balance: string
  tick: string
  transferable_balance: string
  updated_at: string
  inscription_id: string
  inscription_number: string
  in_mempool: boolean
}

type TAssetsData = {
  address: string
  funded_txo_sum: number
  spent_txo_sum: number
  total_balance: number
  unconfirmed_balance: number
}
export function formatSat(num: number) {
  const ONE_BTC = BigNumber.from('100000000')
  return formatUnits(parseUnits('' + num, 8).div(ONE_BTC), 8)
}

export const Brc20Item: FC<B20Item> = (props) => {
  return (
    <Link
      href={`/inscription/${props.inscription_id}`}
      className="ease-linear duration-150 hover:-translate-y-1 hover:-translate-x-1"
    >
      <div className="relative p-5 bg-[#241621] text-[#d2d2d2]">
        {dayjs().diff(dayjs(props.created_at), 'days') <= 3 && (
          <div className="bg-[#f96060] px-[7px] pb-0.5 text-[12px] text-[#241621] absolute right-[5px] top-[5px]">
            NEW
          </div>
        )}
        {props.in_mempool && (
          <div className="px-[7px] pb-0.5 text-[12px] absolute right-[5px] top-[5px]">
            <LoadingOutlined style={{ color: '#eeb60f', width: 20, height: 20, fontSize: 18 }} />
          </div>
        )}
        <p className="text-center font-bold text-[#e5e5e5] text-xl truncate">{props.tick}</p>
        <p className=" text-sm text-[#d2d2d2] text-center mt-2">#{props.inscription_number}</p>
        <div className="w-full h-px bg-[#3d3d3d] my-[12px]" />
        <div className="flex justify-between items-center mb-[12px] text-[12px]">
          <div>Transferable:</div>
          <div title={formatNumber(props.transferable_balance)} className="truncate pl-1">
            {formatNumber(props.transferable_balance)}
          </div>
        </div>
        <div className="flex justify-between items-center mb-[12px] text-[12px]">
          <div>Available:</div>
          <div title={formatNumber(props.available_balance)} className="truncate pl-1">
            {formatNumber(props.available_balance)}
          </div>
        </div>
        <div className="flex justify-between items-center mb-[12px] text-[12px]">
          <div>Balance:</div>
          <div title={formatNumber(props.overall_balance)} className="truncate pl-1">
            {formatNumber(props.overall_balance)}
          </div>
        </div>
      </div>
    </Link>
  )
}

const OverView: FC<{ address: string; activeTab: string }> = ({ address, activeTab }) => {
  const [brcPage, setBrcPage] = useState(1)
  const [insPage, setInsPage] = useState(1)
  const [tab, setTab] = useState(activeTab)

  const switchOpenStyle = { backgroundColor: '#F7D56A' }
  const switchCloseStyle = { backgroundColor: '#d1d1d1' }
  const [switchStyle, setSwitchStyle] = useState(switchOpenStyle)
  const [showPending, setShowPending] = useState(1)

  const onPendingSwitchChange = (checked: boolean) => {
    if (checked) {
      setSwitchStyle(switchOpenStyle)
      setShowPending(1)
    } else {
      setSwitchStyle(switchCloseStyle)
      setShowPending(0)
    }
    setInsPage(1)
    setBrcPage(1)
  }

  const { data: _brc20Data, isLoading: brc20Loading } = useSWR(
    `${ENV.backend}/address/brc20/inscriptions?address=${address}&limit=12&page=${brcPage}`,
    fetcher,
  )

  // const { data: _inscriptionData, isLoading: inscriptionLoading } = useSWR(
  //   `${HOME_API_URL}/address/inscriptions?address=${address}&limit=12&page=${insPage}&pending=${showPending}`,
  //   fetcher
  // )

  const _fetcher = async (data: { page: number; limit: number }) => {
    const response = await fetch(
      `${ENV.backend}/address/inscriptions?address=${address}&limit=${data.limit}&page=${data.page}&pending=${showPending}`,
    )
    const res = await response.json()
    return {
      items: res.data.items,
      page: res.data.page,
      limit: res.data.limit,
      total: res.data.total,
    }
  }
  // @ts-ignore
  const {
    data: _inscriptionData,
    loading: inscriptionLoading,
    loadingMore,
    noMore,
  } = useWindowInfiniteScroll(I(_fetcher, { limit: 60 }), {
    threshold: 300,
    reloadDeps: [],
    //@ts-ignore
    isNoMore: (data1, data2) => {
      return data1?.page * data1?.limit >= data1?.total
    },
  })

  const brc20Data = (_brc20Data?.data?.items as B20Item[]) || []
  const brc20Total = (_brc20Data?.data?.total as number) || 0

  const inscriptionData = (_inscriptionData?.list as InscriptionResponseOrdinalScan[]) || []

  return (
    <div className="w-full">
      <div className="mt-[30px] mx-auto flex justify-between">
        <div className="flex gap-x-[15px] sm:gap-x-[20px]">
          {['Inscription', 'BRC-20'].map((item) => (
            <div
              key={item}
              onClick={() => {
                setTab(item)
                if (item === 'Inscription') {
                  setSwitchStyle(switchOpenStyle)
                  setShowPending(1)
                }
              }}
              className={`rounded-md px-5 py-2 hover:bg-[#F7D56A] hover:border hover:border-[#F7D56A] ${
                tab === item ? 'bg-[#F7D56A] border border-[#F7D56A]' : 'text-[#4f4f4f] border border-[#d1d1d1]'
              } cursor-pointer`}
            >
              {item}
            </div>
          ))}
        </div>
        {tab === 'Inscription' ? (
          <div className="mt-[10px]">
            <span className="text-xs text-gray-900 dark:text-gray-300 mr-2">Pending Transactions</span>
            <Switch defaultChecked onChange={onPendingSwitchChange} style={switchStyle} />
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className={tab === 'BRC-20' ? '' : 'hidden'}>
        {brc20Loading ? (
          <div className="text-[#696969] mt-10">loading ...</div>
        ) : !!brc20Data.length ? (
          <>
            <div className="w-full mt-[27px] grid-cols-2 grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6  wrap gap-3">
              {brc20Data.map((i, index) => (
                <Brc20Item key={index} {...i} />
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Pagination
                showQuickJumper
                defaultCurrent={1}
                current={brcPage}
                pageSize={12}
                total={brc20Total}
                showSizeChanger={false}
                className="address-detail-pagination my-6"
                onChange={(page, _) => {
                  setBrcPage(page)
                }}
              />
            </div>
          </>
        ) : (
          <div className="text-[#696969] mt-10">NONE</div>
        )}
      </div>
      <div className={tab === 'Inscription' ? '' : 'hidden'}>
        <div className="w-full mt-[27px] grid-cols-2 grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 wrap gap-3">
          {!!(inscriptionData || []).length &&
            inscriptionData.map((i, index) => (
              <InscriptionCardOrdinalScan key={index} inscription={i as InscriptionResponseOrdinalScan} />
            ))}
        </div>
        {(loadingMore || inscriptionLoading) && (
          <div>
            <div className={clsx('flex items-center justify-center', inscriptionData?.length ? 'mt-4' : 'mt-16')}>
              <div className="w-6 h-6 max-w-full max-h-full rounded-full border-2 border-primary animate-spinnerBulqg"></div>
            </div>
          </div>
        )}
        {inscriptionData?.length === 0 && !loadingMore && !inscriptionLoading && (
          <div className="text-[#696969] mt-10">NONE</div>
        )}
      </div>
    </div>
  )
}

//brc20 transfer history
const Brc20TransHis: FC<{ address: string }> = ({ address }) => {
  const fetcher = useMemo(
    () => async (data: { page: number; limit: number; address: string }) => {
      // @ts-ignore
      const response = await fetch(
        `${ENV.backend}/brc20/address/activities?address=${address}&type=inscribe-transfer&page=${data.page}&limit=${data.limit}`,
      )
      // @ts-ignore
      const res = await response.json()
      return res.data
    },
    [address],
  )

  const { data, loading, loadingMore, noMore } = useWindowInfiniteScroll(
    // @ts-ignore
    I(fetcher, { limit: 60 }),
    {
      threshold: 300,
      reloadDeps: [],
      //@ts-ignore
      isNoMore: (data1, data2) => {
        if (data1?.offset || data1?.offset === 0) {
          return (data1?.offset + 1) * data1?.limit >= data1?.total
        }
        return (data1?.page + 1) * data1?.limit >= data1?.total
      },
    },
  )

  return (
    <div className="w-full">
      <div className="w-full mt-[27px] hidden sm:block">
        <Brc20ActivityList loading={loading || loadingMore} data={(data?.list as []) || []} />
      </div>
      <div className="w-full mt-[27px] block sm:hidden">
        <Brc20ListMobile data={(data?.list || []) as Activity[]} />
      </div>
      <div className="mt-[18px] text-center">
        {!loadingMore && !loading && noMore && <div className="text-[12px] text-[gray]">No More Data</div>}
      </div>
    </div>
  )
}

const InsT: FC<{ aid: string }> = ({ aid }) => {
  const fetchActivity = useMemo(
    () => async (data: { page: number; limit: number; address: string }) => {
      // @ts-ignore
      const response = await fetch(
        `${ENV.backend}/address/activities?limit=${data.limit}&page=${data.page}&address=${aid}`,
      )
      // @ts-ignore
      const res = await response.json()
      return res.data
    },
    [aid],
  )

  const {
    data: activityData,
    loading,
    loadingMore,
    noMore,
  } = useWindowInfiniteScroll(
    // @ts-ignore
    I(fetchActivity, { limit: 60 }),
    {
      threshold: 300,
      reloadDeps: [],
      //@ts-ignore
      isNoMore: (data1, data2) => {
        return data1?.page * data1?.limit >= data1?.total
      },
    },
  )

  return (
    <>
      <div className="w-full mt-[27px] hidden sm:block">
        <InsTList loading={loadingMore || loading} data={(activityData?.list || []) as ActivityListItem[]} />
      </div>
      <div className="w-full mt-[27px] block sm:hidden">
        <InstListMobile data={(activityData?.list || []) as ActivityListItem[]} />
      </div>
      <div className="mt-[18px]">{noMore && <div className="text-[12px] text-[gray]">No More Data</div>}</div>
    </>
  )
}

const AddressDetails = (params: { aid: string }) => {
  const queryParams = useSearchParams()
  const activeTab: any = queryParams?.get('tab') || 'Inscription'

  const [btcPrice, setBtcPrice] = useState<number>(0)
  const [tabType, setTabType] = useState<'overview' | 'brc20T' | 'insT'>('overview')
  const [assetsData, setAssetsData] = useState<TAssetsData>({} as TAssetsData)
  useEffect(() => {
    const fetchAssets = async () => {
      const response = await fetch(`${ENV.backend}/address/assets?address=${params.aid}`)
      // @ts-ignore
      const res = await response.json()
      setAssetsData(res.data)
      return res.data
    }
    if (params.aid) {
      fetchAssets().then()
    }
  }, [params.aid])

  useEffect(() => {
    const fetchBtcPrice = async () => {
      const response = await fetch(`${ENV.backend}/btc-price`)
      const res = await response.json()
      setBtcPrice(res.data.price)
    }
    fetchBtcPrice().then()
  }, [])

  if (!params.aid) return <div>404</div>
  return (
    <div className="pt-10 rounded-lg flex  flex-col justify-between items-center px-4">
      <div className="w-full">
        <div className="text-[20px] flex gap-x-[13px]">
          <ORImg src={Images.HOME.OWNER_LOGO_SVG} />
          <span className="text-[#4f4f4f] font-bold">Address{'  '}</span>
          <div className="flex gap-x-[8px] items-center">
            <Ellipsis text={params.aid} />
            {/* {params.aid && <Copy copyText={params.aid} />} */}
            <Copy copyText={params.aid} />
            {/* <img
              className="cursor-pointer"
              src={'/copy.svg'}
              alt=""
              width={13}
              height={13}
              onClick={(e) => {
                e.stopPropagation()
                copy(params.aid)
              }}
            /> */}
          </div>
        </div>
      </div>
      <div className="flex justify-start w-full gap-x-8">
        <h2
          className={`self-start font-[700] leading-[23px] text-[#4f4f4f] mt-[22px] sm:mt-[38px] capitalize cursor-pointer pb-[4px] ${
            tabType === 'overview' ? 'border-b-[4px] border-b-[#F9D560]' : ''
          }`}
          onClick={() => {
            setTabType('overview')
          }}
        >
          Overview
        </h2>
        <h2
          className={`self-start font-[700] leading-[23px] text-[#4f4f4f] mt-[22px] sm:mt-[38px] capitalize cursor-pointer pb-[4px] ${
            tabType === 'brc20T' ? 'border-b-[4px] border-b-[#F9D560]' : ''
          }`}
          onClick={() => {
            setTabType('brc20T')
          }}
        >
          Token Transfer(BRC-20)
        </h2>
        <h2
          className={`self-start font-[700] leading-[23px] text-[#4f4f4f] mt-[22px] sm:mt-[38px] capitalize cursor-pointer pb-[4px] ${
            tabType === 'insT' ? 'border-b-[4px] border-b-[#F9D560]' : ''
          }`}
          onClick={() => {
            setTabType('insT')
          }}
        >
          Inscription Transfer
        </h2>
      </div>
      {tabType === 'overview' && <OverView address={params.aid} activeTab={activeTab} />}
      {tabType === 'brc20T' && (
        <>
          <Brc20TransHis address={params.aid} />
        </>
      )}
      {tabType === 'insT' && <InsT aid={params.aid} />}
    </div>
  )
}

export default AddressDetails
