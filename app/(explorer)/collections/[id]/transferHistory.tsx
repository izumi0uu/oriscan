'use client'
import { FC } from 'react'
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import { I } from '@/utils/infinite'
import { ActivityListItem } from '@/utils/types'
import dayjs from 'dayjs'
import ActivityList from '@/components/owner/activityList'
import TransferHistoryListMobile from './transferHistoryListMobile'
import { ENV } from '@/utils/env'

const TransferHistory: FC<{ symbol: string }> = ({ symbol }) => {
  const fetcher = async (data: { page: number; limit: number }) => {
    const response = await fetch(
      `${ENV.backend}/collections/${symbol}/activities?limit=${data.limit}&page=${data.page}`,
    )
    const res = await response.json()
    return res.data
  }

  const { data, loading, loadingMore, noMore } = useWindowInfiniteScroll(I(fetcher, { limit: 60 }), {
    threshold: 300,
    reloadDeps: [],
    //@ts-ignore
    isNoMore: (data1, data2) => {
      return data1?.page * data1?.limit >= data1?.total
    },
  })

  const list = ((data?.list as ActivityListItem[]) || []).map((item) => ({
    ...item,
    type: (item as any).event_type,
    block_time: dayjs(item.block_time).unix(),
  }))

  return (
    <>
      <div className="w-full mt-[27px] hidden sm:block">
        <ActivityList loading={loading || loadingMore} data={(list || []) as ActivityListItem[]} />
      </div>
      <div className="w-full mt-[27px] block sm:hidden">
        <TransferHistoryListMobile data={(list || []) as ActivityListItem[]} />
      </div>
      <div className="mt-[18px] w-full flex flex-col items-center">
        {!loadingMore && !loading && noMore && <div className="text-[12px] text-[gray]">No More Data</div>}
      </div>
    </>
  )
}
export default TransferHistory
