'use client'

import Ellipsis from '@/components/Ellipsis'
import Header from '@/components/CommonHeader/CommonHeader'
import InscriptionCard from '@/components/InscriptionCard'
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import { InscriptionResponse } from '@/utils/types'
import { I } from '@/utils/infinite'
import Footer from '@/components/Footer'
import { Brc20Item } from '@/components/AddressDetails'
import Copy from '@/components/copy'
import clsx from 'clsx'
import { ENV } from '@/utils/env'
import { Images } from '@/utils/images'

const Brc20: React.FC<{ aid: string }> = ({ aid }) => {
  const fetchInscription = async (data: { page: number; limit: number; address: string }) => {
    // @ts-ignore
    const response = await fetch(
      `${ENV.backend}/address/brc20/inscriptions?limit=${data.limit}&offset=${data.page - 1}&address=${aid}`,
    )
    // @ts-ignore
    const _data = await response.json()
    const res = _data.data
    return {
      ...res,
      items: res.items,
      list: res.items,
    }
  }

  const {
    data: brc20Data,
    loading: brc20Loading,
    loadingMore: brc20DataLoadingMore,
    noMore: brc20NoMore,
  } = useWindowInfiniteScroll(
    // @ts-ignore
    I(fetchInscription, { limit: 60 }),
    {
      threshold: 300,
      reloadDeps: [],
      //@ts-ignore
      isNoMore: (data1, data2) => {
        return (data1?.offset + 1) * data1?.limit >= data1?.total
      },
    },
  )

  return (
    <>
      <div className="w-full mt-[27px] grid-cols-2 grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 wrap gap-3">
        {!!brc20Data?.list?.length && brc20Data.list.map((i, index) => <Brc20Item key={index} {...(i as any)} />)}
      </div>
      {(brc20Loading || brc20DataLoadingMore) && (
        <div className="absolute z-10 inset-0 flex items-center justify-center">
          <div className="w-6 h-6 max-w-full max-h-full rounded-full border-2 border-primary animate-spinnerBulqg"></div>
        </div>
      )}
      {brc20NoMore && !brc20Loading && !brc20DataLoadingMore && (
        <div className="text-center text-[#696969] text-[12px] mt-[18px]">No More Data</div>
      )}
    </>
  )
}

const Ins: React.FC<{ aid: string }> = ({ aid }) => {
  const fetchInscription = async (data: { page: number; limit: number; address: string }) => {
    // @ts-ignore
    const response = await fetch(
      `https://api.hiro.so/ordinals/inscriptions?limit=${data.limit}&offset=${
        (data.page - 1) * data.limit
      }&address=${aid}`,
    )
    // @ts-ignore
    const res = await response.json()
    return {
      ...res,
      items: res.results,
      list: res.results,
      page: res.offset,
    }
  }

  const {
    data: inscriptionData,
    loading: inscriptionLoading,
    loadingMore: inscriptionLoadingMore,
    noMore: inscriptionNoMore,
  } = useWindowInfiniteScroll(
    // @ts-ignore
    I(fetchInscription, { limit: 40 }),
    {
      threshold: 300,
      reloadDeps: [],
      //@ts-ignore
      isNoMore: (data1, data2) => {
        return (data1?.offset + 1) * data1?.limit >= data1?.total
      },
    },
  )

  return (
    <>
      <div className="w-full mt-[27px] grid-cols-2 grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 wrap gap-3">
        {!!inscriptionData?.list?.length &&
          inscriptionData.list.map((i, index) => (
            <InscriptionCard key={index} inscription={i as InscriptionResponse} />
          ))}
      </div>
      {(inscriptionLoading || inscriptionLoadingMore) && (
        <div>
          <div className={clsx('flex items-center justify-center', inscriptionData?.list?.length ? 'mt-4' : 'mt-16')}>
            <div className="w-6 h-6 max-w-full max-h-full rounded-full border-2 border-primary animate-spinnerBulqg"></div>
          </div>
        </div>
      )}
      {inscriptionNoMore && !inscriptionLoading && !inscriptionLoadingMore && (
        <div className="text-center text-[#696969] mt-[18px] text-[12px]">No More Data</div>
      )}
    </>
  )
}

const Page = (props: { params: { type: 'brc20' | 'ins'; aid: string } }) => {
  return (
    <div>
      <Header></Header>
      <div className="w-[80%] max-[1200px] mx-auto mt-[55px]">
        <div className="text-[20px] flex gap-x-[13px]">
          <img src={Images.HOME.OWNER_LOGO_SVG} alt="" />
          <span className="text-[#4f4f4f] font-bold">Address{'  '}</span>
          <div className="flex gap-x-[8px] items-center">
            <Ellipsis text={props.params.aid} />
            <Copy copyText={props.params.aid} />
            {/* <img
              className="cursor-pointer"
              src={'/copy.svg'}
              alt=""
              width={13}
              height={13}
              onClick={(e) => {
                e.stopPropagation()
                copy(props.params.aid)
              }}
            /> */}
          </div>
        </div>
        <div className="mt-[64px] font-bold text-xl mb-[22px]">
          {props.params.type === 'brc20' ? 'All BRC-20' : 'All Inscription'}
        </div>
        {props.params.type === 'brc20' ? <Brc20 aid={props.params.aid} /> : <Ins aid={props.params.aid} />}
      </div>
      <Footer />
    </div>
  )
}

export default Page
