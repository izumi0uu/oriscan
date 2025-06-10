'use client'

import Footer from '@/components/Footer'
import Header from '@/components/CommonHeader/CommonHeader'
import ListMobile from '@/components/pending-transactions/listMobile'
import ListPC from '@/components/pending-transactions/listPC'
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import { I } from '@/utils/infinite'
import { ENV } from '@/utils/env'

export interface Mempool {
  inscription_id: string
  tx_id: string
  content_type: string
  content_length: number
  number: number
  to_address: string
  from_address: string
  block_height: number
  block_time: number
  content_uri: string
  json_content: string
  json_protocol: string
  type: string
}

const Page = () => {
  // const { data, isLoading } = useSWR(`https://ordinalscan.net/api/mempool/inscriptions_v2?limit=50&page=1`, fetcher)

  // const list: Mempool[] = data?.data || []
  const fetcherBrc20 = async (data: { page: number; limit: number }) => {
    const response = await fetch(`${ENV.backend}/mempool/inscriptions_v2?limit=${data.limit}&page=${data.page}`)
    const res = await response.json()
    return res.data
  }
  const { data, loading, noMore, loadingMore } = useWindowInfiniteScroll(I(fetcherBrc20, { limit: 50 }), {
    threshold: 300,
    reloadDeps: [],
    //@ts-ignore
    isNoMore: (data1, data2) => {
      return data1?.page * data1?.limit >= data1?.total
    },
  })

  const list = (data?.list as Mempool[]) || []

  return (
    <div>
      <Header />
      <div className="w-[80%] mx-auto" style={{ minHeight: 'calc(100vh - 364px)' }}>
        <div className="mt-[62px] mb-2 text-[#656565] font-bold text-[26px]">Pending Transactions</div>
        <p className="mb-[62px] text-lg text-[#656565]">A total of {data?.total || '-'} pending txns found</p>
        <>
          <div className="w-full mt-[27px] hidden sm:block">
            <ListPC noneAge data={(list || []) as []} getPreview={(data) => data?.json_protocol} />
          </div>
          <div className="w-full mt-[27px] block sm:hidden">
            <ListMobile data={(list || []) as []} />
          </div>
          <div className="mt-[18px] text-center">
            {(loading || loadingMore) && (
              <div className="absolute z-10 inset-0 flex items-center justify-center">
                <div className="w-6 h-6 max-w-full max-h-full rounded-full border-2 border-primary animate-spinnerBulqg"></div>
              </div>
            )}
            {!loading && !loadingMore && noMore && <div className="text-[12px] text-[gray]">No More Data</div>}
          </div>
        </>
      </div>
      <Footer />
    </div>
  )
}

export default Page
