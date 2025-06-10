// @ts-nocheck
import Table, { TableColumn } from '@/components/table/Table'
import Link from 'next/link'
import ReactTimeAgo from 'react-time-ago'
import { FC } from 'react'

export interface Activity {
  amount: string
  available_balance: string
  block_height: number
  block_time: number
  from_address: string
  id: number
  is_valid: boolean
  location: string
  overall_balance: string
  tick: string
  to_address: string
  transferable_balance: string
  tx_id: string
  type: string
  inscription_number: number
  inscription_id: string
  content_type: string
  volume: number
}

const columns: TableColumn<Activity>[] = [
  {
    name: 'Inscription',
    key: 'inscription_id',
    render: (data) =>
      data.inscription_id ? (
        <Link href={`/inscription/${data.inscription_id}`} className="text-[#3498DB] cursor-pointer">
          #{data.inscription_number}
        </Link>
      ) : (
        ''
      ),
  },
  {
    name: 'Token',
    key: 'tick',
  },
  {
    name: 'Method',
    key: 'type',
    render: (data) => <span className="text-[#faac2e]">{data.type}</span>,
  },
  {
    name: 'Volume',
    key: 'volume',
    render: (data) => (
      <span className="flex justify-center gap-x-[5px]">
        <img src="https://cdn.name3.net/name3/coins/btc.svg" alt="" width={15} /> {data.volume}
      </span>
    ),
  },
  {
    name: 'Amount',
    // sortable: true,
    key: 'amount',
  },
  {
    name: 'From',
    sortable: false,
    key: 'from_address',
    render: (data) => (
      <div style={{ display: 'flex', columnGap: '5px' }} className="justify-center">
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
      <div style={{ display: 'flex', columnGap: '5px' }} className="justify-center">
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
  {
    name: 'Date',
    sortable: false,
    key: 'from_address',
    render: (data) => <ReactTimeAgo date={data?.block_time * 1000} locale="en-US" />,
  },
]

const Brc20ActivityList: FC<{ data: Activity[]; loading: boolean }> = ({ data, loading }) => {
  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      tableHeaderStyle={{ padding: '0 30px' }}
      tableBodyStyle={{ padding: '0 30px' }}
      rollingScroll
    />
  )
}
export default Brc20ActivityList
