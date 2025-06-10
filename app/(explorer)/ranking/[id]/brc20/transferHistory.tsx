'use client'
import { FC } from 'react'
import { HOME_API_URL } from '@/utils/constants'
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import { I } from '@/utils/infinite'
import { formatNumber } from '@/utils'
import Brc20ActivityList from '@/components/brc20-activity-list'
import ActivityListMobile from '@/components/owner/activityListMobile'
import { ActivityListItem } from '@/utils/types'
import Brc20ActivityListMobile from '@/components/ranking/brc20ActivityListMobile'
import { ENV } from '@/utils/env'

const TransferHistory: FC<{ tick: string }> = ({ tick }) => {
  const fetcher = async (data: { last_id: number }) => {
    const response = await fetch(`${ENV.backend}/brc20/${tick}/activities?last_id=${data.last_id}`)
    const res = await response.json()
    return res.data
  }
  // @ts-ignore
  const { data, loading, loadingMore, noMore } = useWindowInfiniteScroll(I(fetcher, { last_id: 0 }), {
    threshold: 300,
    reloadDeps: [],
    //@ts-ignore
    isNoMore: (data1, data2) => {
      // return data1?.page * data1?.limit >= data1?.total
      return !data1?.has_more
    },
  })

  const list = ((data?.list as any[]) || []).map((item) => ({
    ...item,
    amount: formatNumber(item.amount),
  }))

  return (
    <>
      <div className="w-full mt-[27px] hidden sm:block">
        <Brc20ActivityList loading={loadingMore || loading} data={(list || []) as []} />
      </div>
      <div className="w-full mt-[27px] block sm:hidden">
        <Brc20ActivityListMobile data={(list || []) as ActivityListItem[]} />
      </div>
      <div className="mt-[18px] w-full flex flex-col items-center">
        {!loadingMore && !loading && noMore && <div className="text-[12px] text-[gray]">No More Data</div>}
      </div>
    </>
  )
}
export default TransferHistory
