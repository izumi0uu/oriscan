'use client'
import { FC } from 'react'
import { HOME_API_URL } from '@/utils/constants'
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import { I } from '@/utils/infinite'
import { HoldersListPC, HoldersListMobile } from './holdersList'
import { ENV } from '@/utils/env'

export interface HoldersType {
  address: string
  quantity: number
  percentage: string
  value: number
  quantity_change: number
  percent_change: number
  mempool_count: number
}

const Holders: FC<{ tick: string; address: string }> = ({ tick, address }) => {
  const fetcher = async (data: { page: number; limit: number; address?: string }) => {
    const response = await fetch(
      `${ENV.backend}/brc20/${tick}/holders?limit=${data.limit}&page=${data.page}&address=${data.address}`,
    )
    const res = await response.json()
    return res.data
  }

  const { data, loading, loadingMore, noMore } = useWindowInfiniteScroll(I(fetcher, { limit: 60, address }), {
    threshold: 300,
    reloadDeps: [address],
    //@ts-ignore
    isNoMore: (data1, data2) => {
      return data1?.page * data1?.limit >= data1?.total
    },
  })

  const list = (data?.list as HoldersType[]) || []

  return (
    <div>
      <div className="w-full mt-[27px] hidden sm:block">
        <HoldersListPC loading={loadingMore || loading} data={(list || []) as HoldersType[]} />
      </div>
      <div className="w-full mt-[27px] block sm:hidden">
        <HoldersListMobile data={(list || []) as HoldersType[]} />
      </div>
      {!loadingMore && !loading && noMore && (
        <div className="mt-[18px] text-[12px] text-[gray] text-center">No More Data</div>
      )}
    </div>
  )
}
export default Holders
