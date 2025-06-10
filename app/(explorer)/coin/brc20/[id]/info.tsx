'use client'

import { Description } from '@/components/description'
import { FC, useEffect, useState } from 'react'
import { HOME_API_URL } from '@/utils/constants'
import dayjs from 'dayjs'
import { getEllipsisStr } from '@/utils'
import Link from 'next/link'
import useMobile from '@/hooks/useMobile'
import { ENV } from '@/utils/env'

const Info: FC<{ tick: string }> = ({ tick }) => {
  const isMobile = useMobile()
  const [data, setData] = useState<any>()
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`${ENV.backend}/brc20/${tick}`)
      const _data = await res.json()
      setData(_data?.data)
    }
    fetcher().then()
  }, [tick])
  return (
    <div className="mt-[25px]">
      <Description style={{ gridTemplateColumns: isMobile ? 'repeat(1, auto)' : 'repeat(3, auto)' }}>
        <Description.Item label="Inscription">
          <Link href={`/inscription/${data?.inscription_id}`} className="text-[#3498DB]">
            {getEllipsisStr(data?.inscription_id)}
          </Link>
        </Description.Item>
        <Description.Item label="Limit per mint">{data?.lim}</Description.Item>
        <Description.Item label="Decimal">{data?.decimal}</Description.Item>
        <Description.Item label="Deploy By">
          <Link href={`/address/${data?.address}`} className="text-[#3498DB]">
            {getEllipsisStr(data?.address)}
          </Link>
        </Description.Item>
        <Description.Item label="Deploy Time">
          {data?.deploy_time ? dayjs(data?.deploy_time * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}
        </Description.Item>
        {/* <Description.Item label="Completed Time">0x42d4aE34624F713D9</Description.Item> */}
        <Description.Item label="Inscription Number Start">#{data?.inscription_number_start}</Description.Item>
        <Description.Item label="Inscription Number End">#{data?.inscription_number_end}</Description.Item>
      </Description>
    </div>
  )
}
export default Info
