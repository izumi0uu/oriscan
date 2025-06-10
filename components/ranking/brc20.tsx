// @ts-nocheck
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import Table from '@/components/table/Table'
import dayjs from 'dayjs'

import { I } from '@/utils/infinite'
import { commify } from 'ethers/lib/utils'
import { FC } from 'react'
import { enFormatUnicode } from '@/utils'
import { ENV } from '@/utils/env'

interface Brc20Ranking {
  tick: string // 集合名称
  max: string // 集合最大供应量
  lim: string // Mint limit: 单次造币限制
  total_minted: string // 总mint 次数
  amount: string // 当前累计金额
  decimal: number // 小数点位数
  address: string
  inscription_id: string
  inscription_number_start: number
  inscription_number_end: number
  holders: number // 总用户数  保留字段 本期不显示
  total_transactions: number // 总交易数  保留字段 本期不显示
  deploy_time: number
}

const fetcherBrc20 = async (data: { page: number; limit: number }) => {
  const response = await fetch(`${ENV.backend}/brc20/ranking?limit=${data.limit}&page=${data.page}`)
  const res = await response.json()
  return res.data
}

export const Brc20PC = () => {
  const { data, loading, loadingMore, noMore } = useWindowInfiniteScroll(I(fetcherBrc20, { limit: 50 }), {
    threshold: 300,
    reloadDeps: [],
    //@ts-ignore
    isNoMore: (data1, data2) => {
      return data1?.page * data1?.limit >= data1?.total
    },
  })

  const dataSource = (data?.list as Brc20Ranking[]) || []

  return (
    <>
      <Table
        tableHeaderStyle={{ padding: '0 30px' }}
        tableBodyStyle={{ padding: '0 30px' }}
        gap="0"
        loading={loading || loadingMore}
        data={dataSource}
        onRowClick={(data) => (window.location.href = `/coin/brc20/${encodeURIComponent(data.tick)}`)}
        columns={[
          { name: '', key: 'tick', render: (_, index) => `${index + 1}`, width: '50px' },
          { name: 'Name', key: 'tick', render: (_) => enFormatUnicode(_.tick) },
          { name: 'Holders', key: 'holders', render: (_) => commify(_.holders || 0) },
          { name: 'Transactions', key: 'total_transactions', render: (_) => commify(_.total_transactions || 0) },
          {
            name: 'Progress',
            key: 'total_minted',
            render: (_) => {
              return <>{((+_.total_minted * 100) / +_.max).toFixed(2)}%</>
            },
          },
          {
            name: 'Deploy Time',
            key: 'deploy_time',
            render: (_) => {
              return <>{dayjs(_.deploy_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</>
            },
          },
        ]}
      />
      {!loadingMore && !loading && noMore && (
        <div className="mt-[18px] text-[12px] text-[gray] text-center">No More Data</div>
      )}
    </>
  )
}

const Brc20MobileDetail: FC<{ data: Brc20Ranking }> = ({ data }) => {
  const handleGoDetail = () => {
    window.location.href = `/coin/brc20/${data.tick}`
  }
  return (
    <div className="mt-[8px] flex-1" onClick={handleGoDetail}>
      <div className="grid gap-x-[15px] grid-cols-2">
        <div className="flex gap-x-4 items-center">
          <div className="flex  justify-around text-[12px]">
            <span className="text-[#9F9F9F] w-[40px] block">Name: </span>
            <div className="text-[#947308] cursor-pointer text-[12px]">{enFormatUnicode(data?.tick)}</div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-x-1 text-[12px]">
            <div className="flex">
              <span className="text-[#9F9F9F] w-[55px] block">Holders: </span>
              <div className="flex items-center space-x-2">
                <span>{data?.holders}</span>
              </div>
            </div>
            <span className="w-[10px]" />
          </div>
        </div>
      </div>
      <div className="grid gap-x-[15px] grid-cols-2">
        <div>
          <div className="text-[12px] mt-[10px] flex">
            <span className="text-[#9F9F9F] w-[75px] block">Transactions: </span>
            <div className="">{commify(data?.total_transactions || 0)}</div>
          </div>
          <div className=" text-[12px] mt-[5px] flex">
            <span className="text-[#9F9F9F] w-[55px] block">Progress: </span>
            <div className="">{((+data?.total_minted * 100) / +data?.max).toFixed(2)}%</div>
          </div>
        </div>
        <div>
          <div className="text-[12px] mt-[10px] flex">
            <span className="text-[#9F9F9F] w-[75px] block">Total Minted: </span>
            <div className="">{commify(data?.total_minted || 0)}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-[12px] mt-[10px] flex">
          <span className="text-[#9F9F9F] w-[85px] block">Deploy Time: </span>
          <div className="">{dayjs(data?.deploy_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
      </div>
      <div className="h-[1px] w-[100%] bg-[#E8E8E8] mt-[15px] mx-[auto] mb-[16px]" />
    </div>
  )
}

export const Brc20Mobile = () => {
  const { data, loading, loadingMore, noMore } = useWindowInfiniteScroll(I(fetcherBrc20, { limit: 60 }), {
    threshold: 300,
    reloadDeps: [],
    //@ts-ignore
    isNoMore: (data1, data2) => {
      return data1?.page * data1?.limit >= data1?.total
    },
  })

  const dataSource = (data?.list as Brc20Ranking[]) || []
  return (
    <>
      {dataSource.map((item, index) => {
        return (
          <div key={index} className="flex gap-x-1">
            <div className="w-[20px] text-[12px] mt-[8px]">{index + 1}</div>
            <Brc20MobileDetail key={index} data={item} />
          </div>
        )
      })}
      {(loadingMore || loading) && <div className="mt-[18px] text-[12px] text-[gray] text-center">loading ...</div>}
      {!loadingMore && !loading && noMore && (
        <div className="mt-[18px] text-[12px] text-[gray] text-center">No More Data</div>
      )}
    </>
  )
}
