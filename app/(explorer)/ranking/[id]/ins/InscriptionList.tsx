'use client'
import { FC } from 'react'
import { CDN } from '@/utils/constants'
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import { I } from '@/utils/infinite'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/utils/helpers'
import clsx from 'clsx'
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
const InscriptionList: FC<{ symbol: string }> = ({ symbol }) => {
  const fetcher = async (data: { page: number; limit: number }) => {
    const response = await fetch(
      `${ENV.backend}/collections/${symbol}/inscriptions?limit=${data.limit}&page=${data.page}`,
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

  const list = (data?.list as InscriptionType[]) || []

  return (
    <div>
      <div className=" mt-[25px] grid-cols-2 grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {list.map((inscription) => (
          <Link
            key={inscription.inscription_id}
            href={`/inscription/${inscription.inscription_id}`}
            className="border sm:p-2 md:p-3 space-y-2 md:space-y-3 lg:space-y-4 ease-linear duration-150 hover:-translate-y-1 hover:-translate-x-1"
          >
            <div className="w-full  aspect-square overflow-hidden">
              {inscription?.content_type?.includes?.('image') ? (
                <div
                  style={{ backgroundImage: `url('${inscription.content_uri}')` }}
                  className="bg-center bg-cover w-full h-full"
                />
              ) : inscription?.content_type?.includes?.('html') ? (
                <div className=" w-full h-full">
                  <iframe src={`${CDN}/content/${inscription.inscription_id}`} />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">Text</div>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={cn('inline-block text-sm  px-1 md:px-2', 'bg-white text-[#4F4F4F]')}
            >
              #{inscription.number}
            </motion.div>
          </Link>
        ))}
      </div>
      {(loadingMore || loading) && (
        <div>
          <div className={clsx('flex items-center justify-center', list.length ? 'mt-4' : 'mt-16')}>
            <div className="w-6 h-6 max-w-full max-h-full rounded-full border-2 border-primary animate-spinnerBulqg"></div>
          </div>
        </div>
      )}
      {!loadingMore && !loading && noMore && (
        <div className="mt-[18px] text-[12px] text-[gray] text-center">No More Data</div>
      )}
    </div>
  )
}
export default InscriptionList
