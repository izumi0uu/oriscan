// @ts-nocheck
import Table, { TableColumn } from '@/components/table/Table'
import Avg from '@/components/home/Avg2'
import { TransferHistoryItem } from '@/utils/types'
import Link from 'next/link'
import { FC } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { LoadingOutlined } from '@ant-design/icons'
import { formatSat } from '../AddressDetails'
import Copy from '../copy'

const columns: TableColumn<TransferHistoryItem>[] = [
  {
    name: 'Tx',
    key: 'tx_id',
    align: 'left',
    headStyle: { color: '#000', fontSize: '1.125rem', fontWeight: 500 },
    render: (data) => (
      <div className="flex items-center">
        <Link
          href={`https://mempool.space/tx/${data?.tx_id}`}
          className="text-[#3498DB] cursor-pointer"
          target="_blank"
        >
          {`${data?.tx_id.slice(0, 6)}...${data?.tx_id.slice(data?.tx_id.length - 6)}`}{' '}
        </Link>
        <Copy copyText={data?.tx_id} />
        {/* eslint-disable-next-line  */}
        {data.in_mempool && <LoadingOutlined style={{ color: '#eeb60f', width: 20, height: 20, fontSize: 18 }} />}
      </div>
    ),
  },
  {
    name: 'Method',
    headStyle: { color: '#000', fontSize: '1.125rem', fontWeight: 500 },
    key: 'inscription_id',
    align: 'left',
    render: (data) => (
      <>
        <div className="text-[#F5BC00] mb-[.19rem] text-sm">{data.type}</div>
        <>
          {data?.block_time ? (
            <ReactTimeAgo date={data?.block_time * 1000} locale="en-US" className="text-[9F9F9F] text-xs" />
          ) : (
            '-'
          )}
        </>
      </>
    ),
  },
  // {
  //   name: 'Age',
  //   align: 'left',
  //   headStyle: { color: '#000', fontSize: '1.125rem', fontWeight: 500 },
  //   key: 'block_time',
  //   render: (data) => (data?.block_time ? <ReactTimeAgo date={data?.block_time * 1000} locale="en-US" /> : '-'),
  // },
  {
    name: 'Volume',
    align: 'left',
    headStyle: { color: '#000', fontSize: '1.125rem', fontWeight: 500 },
    key: 'volume',
    render: (data) => (
      <div className="flex gap-x-[5px]">
        <img src="https://cdn.name3.net/name3/coins/btc.svg" alt="" width={15} /> {formatSat(data.volume)}
      </div>
    ),
  },
  {
    name: 'Inscription',
    align: 'left',
    headStyle: { color: '#000', fontSize: '1.125rem', fontWeight: 500 },
    key: 'number',
    render: (data) => {
      return (
        <Link href={`/inscription/${data.inscription_id}`} className="text-[#3498DB] cursor-pointer">
          {`${data?.inscription_id.slice(0, 3)}...${data?.inscription_id.slice(data?.inscription_id.length - 9)}`}
        </Link>
      )
    },
  },
  {
    name: 'From',
    align: 'left',
    headStyle: { color: '#000', fontSize: '1.125rem', fontWeight: 500 },
    sortable: false,
    key: 'from_address',
    render: (data) => (
      <>
        {data?.from_address ? (
          <Link href={`/address/${data?.from_address}`} className="text-[#3498DB] cursor-pointer">
            {`${data?.from_address.slice(0, 6)}...${data?.from_address.slice(data?.from_address.length - 6)}`}
          </Link>
        ) : (
          '-'
        )}
      </>
    ),
  },
  {
    name: 'To',
    align: 'left',
    headStyle: { color: '#000', fontSize: '1.125rem', fontWeight: 500 },
    sortable: false,
    key: 'to_address',
    render: (data) => (
      <>
        {data?.to_address ? (
          <Link href={`/address/${data?.to_address}`} className="text-[#3498DB] cursor-pointer">
            {`${data?.to_address.slice(0, 6)}...${data?.to_address.slice(data?.to_address.length - 6)}`}
          </Link>
        ) : (
          '-'
        )}
      </>
    ),
  },
]

const TransferHistory: FC<{
  data: TransferHistoryItem[]
  loading: boolean
}> = ({ data, loading }) => (
  <div>
    <Table loading={loading} data={data} columns={columns} rollingScroll />
  </div>
)
export default TransferHistory
