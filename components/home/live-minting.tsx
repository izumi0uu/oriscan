// @ts-nocheck
import useSWR from 'swr'
import { BaseResponse } from '@/utils/types'
import { TLiveMintingItem } from '@/types/home'
import { fetcher } from '@/utils/helpers'
import Table, { TableColumn } from '@/components/table/Table'
import Skeleton from '@/components/skeleton'
import Link from 'next/link'
import ReactTimeAgo from 'react-time-ago'
import MobileListItem from '@/components/home/mobile-list-item'
// import Avg from './Avg'
import Avg from './Avg2'
import { ENV } from '@/utils/env'

const columns: TableColumn<TLiveMintingItem>[] = [
  {
    name: 'Inscriptions',
    sortable: false,
    key: 'number',
    render: (data) => {
      return (
        <div className="flex gap-x-[0.8rem] ml-[12px]">
          {/*<img*/}
          {/*  alt="img"*/}
          {/*  className="w-[40px] h-[40px] bg-[#3498DB]"*/}
          {/*  src="https://api.hiro.so/ordinals/v1/inscriptions/0bcf4ff230ceca62485d76eb498714671c4f5434523a83e23dc3a42ab4b4c8dei0/content"*/}
          {/*/>*/}
          <div className="w-[40px] h-[40px] flex items-center justify-center">
            <Avg
              inscription_id={data?.inscription_id}
              content_type={data?.content_type}
              json_protocol={data?.json_protocol}
            />
          </div>
          <div>
            <Link
              onClick={() => {
                // @ts-ignore
                if (window.gtag) {
                  // @ts-ignore
                  window.gtag('event', 'click', {
                    event_category: 'click',
                    event_label: 'click',
                  })
                }
              }}
              href={`/inscription/${data?.inscription_id}`}
              className="text-[#3498DB] cursor-pointer"
            >
              Inscription#{data?.number}
            </Link>
            <div className="text-[12px] text-[#9F9F9F] flex gap-x-[0.5rem]">
              <div className="uppercase">{data?.content_type.slice(0, 4)}</div>
              <div className="border-l-[1px] scale-y-50" />
              <div>{data?.content_length}Bytes</div>
            </div>
          </div>
        </div>
      )
    },
  },
  {
    name: 'Transfer',
    sortable: false,
    key: 'from_address',
    render: (data) => (
      <div>
        <div style={{ display: 'flex', columnGap: '5px' }}>
          From{'  '}
          <Link href={`/address/${data?.from_address}`} className="text-[#3498DB] cursor-pointer">
            {`${data?.from_address.slice(0, 6)}...${data?.from_address.slice(data?.from_address.length - 6)}`}
          </Link>
        </div>
        <div style={{ display: 'flex', columnGap: '5px' }}>
          To{'     '}
          <Link href={`/address/${data?.to_address}`} className="text-[#3498DB] cursor-pointer">
            {`${data?.to_address.slice(0, 6)}...${data?.to_address.slice(data?.to_address.length - 6)}`}
          </Link>
        </div>
      </div>
    ),
  },
  {
    name: 'Time',
    sortable: false,
    key: 'block_time',
    render: (data) => <ReactTimeAgo date={data?.block_time * 1000} locale="en-US" />,
  },
]

const LiveMinting = () => {
  const { data, error, isLoading } = useSWR<BaseResponse<TLiveMintingItem[]>>(
    `${ENV.backend}/last-mintings?limit=20`,
    fetcher,
  )
  const previews = data ? data.data : Array(6).fill(null) // skeleton values
  if (!data?.data) {
    return <Skeleton table />
  }
  return (
    <div>
      <div className="hidden sm:block">
        {previews && (
          <Table
            data={previews.slice(0, 6)}
            columns={columns}
            tableHeaderStyle={{ padding: '0 30px', background: '#FFF' }}
            tableBodyStyle={{ padding: '0 30px' }}
          />
        )}
      </div>
      <div className="grid sm:hidden  gap-y-[10px]">
        {previews.slice(0, 6).map((item, index) => {
          return <MobileListItem key={index} data={item} />
        })}
      </div>
    </div>
  )
}
export default LiveMinting
