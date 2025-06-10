// @ts-nocheck
'use client'
// @ts-nocheck
import Table, { TableColumn } from '@/components/table/Table'
import { FC } from 'react'
import { HoldersType } from '@/app/(explorer)/coin/brc20/[id]/holders'
import { getEllipsisStr } from '@/utils'
import { commify } from 'ethers/lib/utils'
import Copy from '@/components/copy'
import { LoadingOutlined } from '@ant-design/icons'

const column: TableColumn<HoldersType>[] = [
  { name: 'Rank', key: 'address', render: (_, index) => `${index + 1}`, width: '50px' },
  {
    name: 'Address',
    key: 'address',
    render: (data) => (
      <div
        className="text-[#3498DB] cursor-pointer flex justify-center gap-x-[5px] items-center"
        onClick={() => {
          window.location.href = `/address/${data.address}`
        }}
      >
        {getEllipsisStr(data.address)}
        {data.mempool_count > 0 && (
          <span className="font-normal text-orange">
            <LoadingOutlined />
          </span>
        )}
      </div>
    ),
  },
  {
    name: 'Quantity',
    key: 'quantity',
    align: 'center',
    render: (data) => {
      return <div>{commify(data.quantity.toFixed(0) || 0)}</div>
    },
  },
  {
    name: 'Percentage',
    key: 'percentage',
    render: (data) => {
      // const percent = Number(data.percentage.slice(0, -1))
      return (
        <div className="w-full flex justify-center">
          <div className="text-left ml-1">
            {data.percentage}
            {data.percent_change && data.percent_change !== 0 ? (
              <span
                className={
                  data.percent_change > 0
                    ? 'ml-2 rounded-[4px] px-[5px] py-[1px] bg-[rgb(225,245,224)] text-green-600'
                    : 'ml-2 rounded-[4px] px-[5px] py-[1px] bg-[rgb(225,245,224)] text-red-600'
                }
              >
                {(data.percent_change > 0 ? '+' : '') + data.percent_change + '%'}
              </span>
            ) : null}
          </div>
        </div>
      )
    },
  },
  {
    name: 'Value',
    key: 'value',
    align: 'center',
    render: (data) => <div className="ml-[12px]">${commify(data.value.toFixed(2))}</div>,
  },
]
export const HoldersListPC: FC<{ data: HoldersType[]; loading: boolean }> = ({ data, loading }) => {
  return (
    <Table
      data={data}
      columns={column}
      loading={loading}
      tableHeaderStyle={{ padding: '0 30px' }}
      tableBodyStyle={{ padding: '0 30px' }}
      rollingScroll
    />
  )
}

const HolderListItemMobile: FC<{ data: HoldersType }> = ({ data }) => {
  return (
    <div className="mt-[8px] w-full">
      <div className="grid grid-cols-2">
        <div className="text-[12px]  flex items-center">
          <span className="text-[#9F9F9F] w-[50px] block">Address:</span>{' '}
          <div
            className="text-[#3498DB] cursor-pointer items-center text-[12px] flex gap-x-[5px]"
            onClick={() => {
              window.location.href = `/address/${data.address}`
            }}
          >
            {data?.address?.slice(0, 4) + '...' + data?.address?.slice(-5) || ''}
            <Copy copyText={data?.address} />
          </div>
        </div>
        <div className="text-[12px]  flex">
          <span className="text-[#9F9F9F] w-[60px] block">Quantity:</span>{' '}
          <div className="cursor-pointer">{commify(data.quantity || 0)}</div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="text-[12px] mt-[10px] flex">
          <span className="text-[#9F9F9F] w-[70px] block">Percentage:</span>{' '}
          <div className="cursor-pointer flex-1">
            <div>{data.percentage}</div>
          </div>
        </div>
        <div className="text-[12px] mt-[10px] flex">
          <span className="text-[#9F9F9F] w-[60px]  flex">Value:</span>{' '}
          <div className="cursor-pointer">{data.value.toFixed(2)}</div>
        </div>
      </div>

      <div className="h-[1px] w-[100%] bg-[#E8E8E8] mt-[15px] mx-[auto] mb-[16px]" />
    </div>
  )
}

export const HoldersListMobile: FC<{ data: HoldersType[] }> = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => {
        return (
          <div key={index} className="flex gap-x-1">
            <div className="w-[15px] text-[12px] mt-[8px]">{index + 1}</div>
            <HolderListItemMobile key={index} data={item} />
          </div>
        )
      })}
    </div>
  )
}
