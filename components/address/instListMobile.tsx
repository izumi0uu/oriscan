import Avg from '@/components/home/Avg'
import Link from 'next/link'
import { getFileType } from '@/components/home/utils'
import { FC } from 'react'
import { ActivityListItem } from '@/utils/types'
import ReactTimeAgo from 'react-time-ago'
import copy from 'copy-to-clipboard'
import { formatSat } from '../AddressDetails'
import Copy from '../copy'

const ActivityListMobile: FC<{ data: ActivityListItem[] }> = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => {
        return <ActivityListItemMobile key={index} data={item} />
      })}
    </div>
  )
}
export default ActivityListMobile

const ActivityListItemMobile: FC<{ data: ActivityListItem }> = ({ data }) => {
  return (
    <div className="mt-[8px]">
      <div className="grid gap-x-[15px] grid-cols-2">
        <div className="flex gap-x-4 items-center">
          <div className="w-[60px] h-[60px] overflow-hidden">
            <Avg inscription_id={data?.inscription_id} content_type={data?.content_type} />
          </div>
          <div className="flex flex-col justify-around h-full">
            <div className="text-[#947308] cursor-pointer text-[14px] ">{data?.type}</div>
            <div className="text-[#9F9F9F] text-[12px] flex gap-x-1">
              <ReactTimeAgo date={data?.block_time * 1000} locale="en-US" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-around">
          <div className="flex gap-x-1 text-[12px] justify-end">
            <Link href={`/inscription/${data.inscription_id}`} className="text-[#3498DB] cursor-pointer">
              #
              {`${data?.inscription_id?.slice?.(0, 6)}...${data?.inscription_id?.slice?.(
                data?.inscription_id?.length - 6,
              )}`}
            </Link>
            <span className="w-[10px]" />
          </div>
          <div className="flex gap-x-1 text-[12px] justify-end items-center">
            <Link
              href={`https://mempool.space/tx/${data?.tx_id}`}
              className="text-[#3498DB] cursor-pointer"
              target="_blank"
            >
              {`${data?.tx_id.slice(0, 9)}...${data?.tx_id.slice(data?.tx_id.length - 8)}`}
            </Link>
            <Copy copyText={data?.tx_id} />
            {/* <img
              className="cursor-pointer"
              src={'/copy.svg'}
              alt=""
              width={10}
              height={10}
              onClick={(e) => {
                e.stopPropagation()
                copy(data?.tx_id)
              }}
            /> */}
          </div>
        </div>
      </div>
      <div className="text-[#3498DB] text-[12px] mt-[3px] flex">
        <span className="text-[#9F9F9F] w-[70px] block">Volume:</span>{' '}
        <span className="flex gap-x-[5px]">
          <img src="https://cdn.name3.net/name3/coins/btc.svg" alt="" width={15} /> {formatSat(data.volume)}
        </span>
      </div>
      <div className="text-[#3498DB] text-[12px] mt-[5px] flex">
        <span className="text-[#9F9F9F] w-[70px] block">From:</span>{' '}
        <Link href={`/address/${data?.from_address}`} className="text-[#3498DB] cursor-pointer">
          {`${data?.from_address.slice(0, 15)}...${data?.from_address.slice(data?.from_address.length - 14)}`}
        </Link>
      </div>
      <div className="text-[#3498DB] text-[12px] mt-[5px] flex">
        <span className="text-[#9F9F9F] w-[70px] block">To:</span>
        <Link href={`/address/${data?.to_address}`} className="text-[#3498DB] cursor-pointer">
          {`${data?.to_address.slice(0, 15)}...${data?.to_address.slice(data?.to_address.length - 14)}`}
        </Link>
      </div>
      {/*<div className="text-[#3498DB] text-[12px] mt-[5px] flex">*/}
      {/*  <span className="text-[#9F9F9F] w-[70px] block">Inscription:</span>*/}
      {/*  <Link href={`/inscription/${data.inscription_id}`} className="text-[#3498DB] cursor-pointer">*/}
      {/*    {`${data?.inscription_id?.slice?.(0, 15) || ''}...${*/}
      {/*      data?.inscription_id?.slice?.(data?.inscription_id?.length - 14) || ''*/}
      {/*    }`}*/}
      {/*  </Link>*/}
      {/*</div>*/}
      <div className="h-[1px] w-[100%] bg-[#E8E8E8] mt-[15px] mx-[auto] mb-[16px]" />
    </div>
  )
}
