// @ts-nocheck
import Table, { TableColumn } from '@/components/table/Table'
import Avg from '@/components/home/Avg'
import Link from 'next/link'
import ReactTimeAgo from 'react-time-ago'
import { ActivityListItem } from '@/utils/types'
import { FC } from 'react'
import Copy from '../copy'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const columns: (noneAge: boolean, renderPreview?: (data: any) => string) => TableColumn<ActivityListItem>[] = (
  noneAge,
  renderPreview,
) => {
  const col: (TableColumn<ActivityListItem> | null)[] = [
    {
      name: 'Tx',
      key: 'tx_id',
      render: (data) => (
        <div className="flex items-center justify-center">
          <Link
            href={`https://mempool.space/tx/${data?.tx_id}`}
            className="text-[#3498DB] cursor-pointer"
            target="_blank"
          >
            {`${data?.tx_id.slice(0, 6)}...${data?.tx_id.slice(data?.tx_id.length - 6)}`}{' '}
          </Link>
          <Copy copyText={data?.tx_id} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
          render: (data) => {
            let value = dayjs.utc(new Date()).unix() - data?.block_time
            if (value > 7 * 24 * 60 * 60) {
              return <>{dayjs.utc(new Date()).format('YYYY-MM-DD')}</>
            } else {
              return <ReactTimeAgo date={data?.block_time * 1000} locale="en-US" />
            }
          },
        },
    {
      name: 'Volume',
      key: 'volume',
      align: 'center',
      render: (data) => (
        <span className="flex gap-x-[5px] items-center justify-center">
          <img src="https://cdn.name3.net/name3/coins/btc.svg" alt="" width={15} /> {data.volume}
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
          <div className="flex items-center justify-center">
            <div className="w-[40px] h-[40px] flex items-center justify-center overflow-hidden">
              <Avg inscription_id={data?.inscription_id} content_type={data?.content_type} />
            </div>
          </div>
        )
      },
    },
    {
      name: 'Inscription Number',
      key: 'inscription_number',
      render: (data) => {
        return data?.inscription_id ? (
          <Link href={`/inscription/${data.inscription_id}`} className="text-[#3498DB] cursor-pointer">
            #{data?.inscription_number}
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
        <div style={{ display: 'flex', columnGap: '5px' }} className="items-center justify-center">
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
        <div style={{ display: 'flex', columnGap: '5px' }} className="items-center justify-center">
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
const ActivityList: FC<{
  data: ActivityListItem[]
  noneAge?: boolean
  getPreview?: (data: any) => string
  loading: boolean
}> = ({ data, noneAge, getPreview, loading }) => {
  return (
    <>
      <Table
        data={data}
        loading={!!loading}
        columns={columns(!!noneAge, getPreview)}
        tableHeaderStyle={{ padding: '0 30px' }}
        tableBodyStyle={{ padding: '0 30px' }}
        rollingScroll
      />
    </>
  )
}
export default ActivityList
