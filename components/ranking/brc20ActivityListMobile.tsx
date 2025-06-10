import Avg from '@/components/home/Avg'
import Link from 'next/link'
import { getFileType } from '@/components/home/utils'
import { FC } from 'react'
import { ActivityListItem } from '@/utils/types'
import ReactTimeAgo from 'react-time-ago'
import copy from 'copy-to-clipboard'

const Brc20ActivityListMobile: FC<{ data: ActivityListItem[] }> = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => {
        return <ActivityListItemMobile key={index} data={item} />
      })}
    </div>
  )
}
export default Brc20ActivityListMobile

const ActivityListItemMobile: FC<{ data: ActivityListItem }> = ({ data }) => {
  return (
    <div className="mt-[8px]">
      <div className="grid gap-x-[15px] grid-cols-2 mt-[8px]">
        <div className="text-[#3498DB] text-[12px]  flex items-center">
          <span className="text-[#9F9F9F] w-[55px] block">Method:</span>{' '}
          <div className="text-[#947308] cursor-pointer text-[12px] ">{data?.type}</div>
        </div>
        <div className="text-[#3498DB] text-[12px]  flex">
          <span className="text-[#9F9F9F] w-[65px] block">Inscription:</span>
          <Link href={`/inscription/${data.inscription_id}`} className="text-[#3498DB] cursor-pointer">
            #{data?.inscription_number}
          </Link>
        </div>
      </div>
      <div className="grid gap-x-[15px] grid-cols-2 mt-[8px]">
        <div className="text-[#3498DB] text-[12px]  flex">
          <span className="text-[#9F9F9F] w-[55px] block">Date:</span>{' '}
          <div className="text-[#9F9F9F] text-[12px] flex gap-x-1">
            <ReactTimeAgo date={data?.block_time * 1000} locale="en-US" />
          </div>
        </div>
        <div className="text-[#3498DB] text-[12px]  flex">
          <span className="text-[#9F9F9F] w-[52px] block">Volume:</span>
          <span className="flex gap-x-[5px] text-[12px] text-[#9F9F9F]">
            <img src="https://cdn.name3.net/name3/coins/btc.svg" alt="" width={15} /> {data.volume}
          </span>
        </div>
      </div>
      <div className="grid gap-x-[15px] grid-cols-2 mt-[8px]">
        <div className="text-[#3498DB] text-[12px] flex">
          <span className="text-[#9F9F9F] w-[55px] block">From:</span>{' '}
          <Link href={`/address/${data?.from_address}`} className="text-[#3498DB] cursor-pointer">
            {data?.from_address ? `${data?.from_address.slice(0, 7)}...${data?.from_address.slice(-7)}` : '-'}
          </Link>
        </div>
        <div className="text-[#3498DB] text-[12px]  flex">
          <span className="text-[#9F9F9F] w-[20px] block">To:</span>
          <Link href={`/address/${data?.to_address}`} className="text-[#3498DB] cursor-pointer">
            {data?.to_address ? `${data?.to_address.slice(0, 7)}...${data?.to_address.slice(-7)}` : '-'}
          </Link>
        </div>
      </div>
      <div className="grid gap-x-[15px] grid-cols-2 mt-[8px]">
        <div className="text-[#3498DB] text-[12px] flex">
          <span className="text-[#9F9F9F] w-[55px] block">Amount:</span>{' '}
          <span className="text-[#9F9F9F]">{data?.amount}</span>
        </div>
      </div>
      <div className="h-[1px] w-[100%] bg-[#E8E8E8] mt-[15px] mx-[auto] mb-[16px]" />
    </div>
  )
}
