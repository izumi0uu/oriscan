import useSWR from 'swr'
import { BaseResponse } from '@/utils/types'
import { HOME_API_URL } from '@/utils/constants'
import { fetcher } from '@/utils/helpers'
import { TStatistic } from '@/types/home'
import { FC } from 'react'
import Image from 'next/image'
import LineChart from './lineCharts'
import { ENV } from '@/utils/env'
import { Images } from '@/utils/images'

const StatisticItem: FC<{ title: string; value: string; img: string }> = ({ title, value, img }) => {
  return (
    <div className="flex items-center gap-x-[15px]">
      <div>
        <Image src={img} alt="" width={28} height={28} />
      </div>
      <div>
        <div className="text-[#9F9F9F] text-xs uppercase">{title}</div>
        <div className="text-sm">{value || '-'}</div>
      </div>
    </div>
  )
}

const StatisticInfo = () => {
  const { data, error, isLoading } = useSWR<BaseResponse<TStatistic>>(`${ENV.backend}/statistical-data`, fetcher)
  const { data: feeData } = useSWR<BaseResponse<{ fastestFee: number }>>(`${ENV.backend}/get-fastest-fee`, fetcher)
  return (
    <div
      style={{ boxShadow: '0px 4px 7px 0px rgba(0, 0, 0, 0.10)' }}
      className="w-full statistics grid grid-cols-1 sm:grid-cols-4 gap-y-[23px] sm:gap-y-[30px] gap-x-4 rounded-[10px] bg-[#fff] py-2 pl-[10px] sm:px-[51px]"
    >
      <div className="sm:flex justify-between items-center sm:after:w-[1px] after:h-[50%] after:bg-[#DFDFDF] after:mr-[20px]">
        <div className="grid gap-y-[30px] grid-cols-2 sm:grid-cols-1 gap-x-[10px] sm:gap-x-0">
          <StatisticItem
            img={Images.HOME.INSCRIPTIONS_SVG}
            title="Inscriptions"
            value={data?.data?.inscriptions.toLocaleString() as string}
          />
          <StatisticItem
            img={Images.HOME.STORE_DATA_SVG}
            title="Stored data"
            value={`${data?.data?.storedData.toLocaleString() || '-'} GB`}
          />
        </div>
      </div>
      <div className="sm:flex justify-between items-center sm:after:w-[1px] after:h-[50%] after:bg-[#DFDFDF] after:mr-[20px]">
        <div className="grid gap-y-[30px] grid-cols-2 sm:grid-cols-1 gap-x-[10px] sm:gap-x-0">
          <StatisticItem
            img={Images.HOME.TOTAL_INSCRIPTION_FEE_SVG}
            title="Total inscription fees"
            value={`${data?.data?.totalInscriptionFee.toLocaleString() || '-'} BTC`}
          />
          <StatisticItem
            img={Images.HOME.WALLET_ADDRESS_SVG}
            title="Wallet Address"
            value={data?.data?.walletAddress.toLocaleString() || '-'}
          />
        </div>
      </div>
      <div className="sm:flex justify-between items-center sm:after:w-[1px] after:h-[50%] after:bg-[#DFDFDF] after:mr-[20px]">
        <div className="grid gap-y-[30px] grid-cols-2 sm:grid-cols-1 gap-x-[10px] sm:gap-x-0">
          <StatisticItem
            img={Images.HOME.FEE_SVG}
            title="Fee"
            value={`${feeData?.data?.fastestFee.toLocaleString() || '-'} satoshi/byte`}
          />
          <StatisticItem
            img={Images.HOME.BLOCKS_SVG}
            title="Blocks"
            value={data?.data?.blocks.toLocaleString() || '-'}
          />
        </div>
      </div>
      <div className="">
        <div>
          <div className="text-[#9F9F9F] text-xs uppercase ">FEE HISTORY IN 30 DAYS</div>
          <div className="mt-1 scale-y-90">
            <LineChart />
          </div>
        </div>
      </div>
    </div>
  )
}
export default StatisticInfo
