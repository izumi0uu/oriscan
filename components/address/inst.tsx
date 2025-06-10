// @ts-nocheck
import Table, { TableColumn } from '@/components/table/Table'
import Avg from '@/components/home/Avg'
import Link from 'next/link'
import ReactTimeAgo from 'react-time-ago'
import { ActivityListItem } from '@/utils/types'
import { FC } from 'react'
import copy from 'copy-to-clipboard'
import { formatSat } from '../AddressDetails'
import Copy from '../copy'

const columns: (noneAge: boolean, renderPreview?: (data: any) => string) => TableColumn<ActivityListItem>[] = (
  noneAge,
  renderPreview,
) => {
  const col: (TableColumn<ActivityListItem> | null)[] = [
    {
      name: 'Tx',
      key: 'tx_id',
      render: (data) => (
        <div className="flex gap-x-[5px] items-center">
          <Link
            href={`https://mempool.space/tx/${data?.tx_id}`}
            className="text-[#3498DB] cursor-pointer"
            target="_blank"
          >
            {`${data?.tx_id.slice(0, 6)}...${data?.tx_id.slice(data?.tx_id.length - 6)}`}{' '}
          </Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
      ),
    },
    {
      name: 'Method',
      key: 'inscription_id',
      render: (data) => <div className="text-[#faac2e]">{data.type}</div>,
    },
    noneAge
      ? null
      : {
          name: 'Age',
          key: 'block_time',
          render: (data) => <ReactTimeAgo date={data?.block_time * 1000} locale="en-US" />,
        },
    // {
    //   name: 'Volume',
    //   key: 'volume',
    //   render: (data) => (
    //     <span className="flex gap-x-[5px]">
    //       <img src="https://cdn.name3.net/name3/coins/btc.svg" alt="" width={15} /> {data.volume}
    //     </span>
    //   ),
    // },
    {
      name: 'Volume',
      key: 'volume',
      render: (data) => (
        <span className="flex gap-x-[5px]">
          <img src="https://cdn.name3.net/name3/coins/btc.svg" alt="" width={15} /> {formatSat(data.volume)}
        </span>
      ),
    },
    {
      name: 'Preview',
      sortable: false,
      key: 'inscription_id',
      render: (data) => {
        if (renderPreview && renderPreview(data)) {
          return renderPreview(data)
        }
        return (
          <div className="flex gap-x-[1rem] ml-[12px]">
            <div className="w-[40px] h-[40px] flex items-center justify-center overflow-hidden">
              <Avg inscription_id={data?.inscription_id} content_type={data?.content_type} />
            </div>
          </div>
        )
      },
    },
    {
      name: 'Inscription',
      key: 'inscription_id',
      render: (data) => {
        return data?.inscription_id ? (
          <Link href={`/inscription/${data.inscription_id}`} className="text-[#3498DB] cursor-pointer">
            {`${data?.inscription_id?.slice?.(0, 6) || ''}...${
              data?.inscription_id?.slice?.(data?.inscription_id?.length - 6) || ''
            }`}
          </Link>
        ) : (
          ''
        )
      },
    },
    {
      name: 'From',
      sortable: false,
      key: 'from_address',
      render: (data) => (
        <div style={{ display: 'flex', columnGap: '5px' }}>
          {data?.from_address ? (
            <Link href={`/address/${data?.from_address}`} className="text-[#3498DB] cursor-pointer">
              {`${data?.from_address.slice(0, 6)}...${data?.from_address.slice(data?.from_address.length - 6)}`}
            </Link>
          ) : (
            '...'
          )}
        </div>
      ),
    },
    {
      name: 'To',
      sortable: false,
      key: 'to_address',
      render: (data) => (
        <div style={{ display: 'flex', columnGap: '5px' }}>
          {data?.to_address ? (
            <Link href={`/address/${data?.to_address}`} className="text-[#3498DB] cursor-pointer">
              {`${data?.to_address.slice(0, 6)}...${data?.to_address.slice(data?.to_address.length - 6)}`}
            </Link>
          ) : (
            '...'
          )}
        </div>
      ),
    },
  ]
  return col.filter(Boolean) as TableColumn<ActivityListItem>[]
}
const InsTList: FC<{
  data: ActivityListItem[]
  noneAge?: boolean
  getPreview?: (data: any) => string
  loading: boolean
}> = ({ data, noneAge, getPreview, loading }) => {
  return (
    <>
      <Table
        loading={loading}
        data={data}
        columns={columns(!!noneAge, getPreview)}
        tableHeaderStyle={{ padding: '0 30px' }}
        tableBodyStyle={{ padding: '0 30px' }}
        rollingScroll
      />
    </>
  )
}
export default InsTList
