'use client'
import { FC } from 'react'
import { HOME_API_URL } from '@/utils/constants'
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import { I } from '@/utils/infinite'
import InscriptionCard from '@/components/InscriptionCard'
import { InscriptionResponse } from '@/utils/types'
import { ENV } from '@/utils/env'

interface InscriptionType {
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
}
const InscriptionList: FC<{ tick: string }> = ({ tick }) => {
  const fetcher = async (data: { page: number; limit: number }) => {
    const response = await fetch(`${ENV.backend}/brc20/${tick}/inscriptions?limit=${data.limit}&page=${data.page}`)
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

  const list = (data?.list as InscriptionType[]) || []

  return (
    <div>
      <div className=" mt-[25px] grid-cols-2 grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {list.map((inscription, index) => (
          <InscriptionCard
            key={index}
            inscription={{ ...inscription, id: inscription.inscription_id } as unknown as InscriptionResponse}
          />
        ))}
      </div>
      {(loadingMore || loading) && <div className="mt-[18px] text-[12px] text-[gray] text-center">loading ...</div>}
      {!loadingMore && !loading && noMore && (
        <div className="mt-[18px] text-[12px] text-[gray] text-center">No More Data</div>
      )}
    </div>
  )
}
export default InscriptionList
