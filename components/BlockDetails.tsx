'use client'

import useSWR from 'swr'

import { API_URL } from '../utils/constants'
import { fetcher } from '../utils/helpers'
import { InscriptionResponse, ListResponse } from '../utils/types'
import CtaLink from './CtaLink'
import InscriptionCard from './InscriptionCard'
import Loading from './Loading'

const BlockDetails = (params: { bid: string }) => {
  const { data, error, isLoading } = useSWR<ListResponse<InscriptionResponse>>(
    // todo: increase limit to 60
    `https://api.hiro.so/ordinals/v1/inscriptions?limit=20&genesis_block=${params.bid}`,
    fetcher,
  )

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>
  if (!params.bid) return <div>404</div>
  if (!data) return <Loading />

  return (
    <div className="p-4 pt-10 rounded-lg flex flex-col justify-between items-center">
      <h1 className="font-[700] text-[26px] leading-[33px] text-[#4f4f4f]">Block #{params.bid}</h1>
      {data.results?.length ? (
        <>
          <h2 className="hidden md:block my-3 uppercase break-all text-[24px] leading-[33px] text-[#4f4f4f]">
            Block Hash: {data.results[0].genesis_block_hash}
          </h2>
          <h2 className="self-start font-[700] text-[18px] leading-[23px] text-[#4f4f4f] mt-[12px]">
            Inscriptions ({data.total})
          </h2>
        </>
      ) : (
        <p className="my-3">No inscriptions from transactions in this block</p>
      )}

      <div className="w-full mt-[27px] grid-cols-2 grid md:grid-cols-5 wrap gap-[22px]">
        {data.results?.map((i, index) => <InscriptionCard key={index} inscription={i} />)}
      </div>

      <div className="mt-16 mb-8 flex justify-around">
        <CtaLink href={`/explore?hf=${params.bid}&ht=${params.bid}`}>
          Explore inscriptions from block #{params.bid} &rarr;
        </CtaLink>
      </div>
    </div>
  )
}

export default BlockDetails
