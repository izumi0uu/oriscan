import { Images } from '@/utils/images'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ENV } from '@/utils/env'

const GasBtn = () => {
  const [gasData, setGasData] = useState<{ economyFee: number; fastestFee: number; minimumFee: number }>()
  useEffect(() => {
    const fetchGasData = async () => {
      const response = await fetch(`${ENV.backend}/get-btc-fee `)
      const data = await response.json()
      setGasData(data?.data)
    }
    fetchGasData()
  }, [])
  return (
    <div className="xl:ml-[1.66rem] hidden min-[1280px]:block">
      <div className="relative group xl:h-[3.51rem] xl:w-[4.31rem] text-center flex items-center text-[#FFA901] px-4 gap-1 cursor-pointer">
        <Image src={Images.COMMON.GASICON_SVG} alt="gas" width={12} height={12} className="xl:w-[10.6px]" />
        <span>{gasData?.economyFee || '...'}</span>
        <div className="bg-[#000] opacity-20 ml-[1.25rem] w-[1px] h-[2.5rem] text-white">|</div>
        <div className="text-black">
          <div
            className="absolute z-[99999999999999] hidden group-hover:flex flex-col rounded-md py-4 left-[50%] transform translate-x-[-50%] top-0 sm:top-[3.5rem] bg-white"
            style={{ boxShadow: '0px 0px 4px 0px rgba(100, 117, 139, 0.25)' }}
          >
            <div className="absolute top-1 left-0 right-0 bottom-0 rounded-md'shadow-navItemShadow' z-negative"></div>
            <div
              className="absolute w-0 h-0 border-l-[0.5rem] border-solid border-l-transparent border-r-[0.5rem] border-r-transparent border-b-[0.5rem] border-b-white top-0 left-[50%] transform translate-x-[-50%]"
              aria-hidden="true"
            ></div>
            <div className="w-[14.5625rem] h-[8.25rem] pt-[.81rem]">
              <div className="flex gap-2 pl-[1.12rem] pr-[1.25rem] mb-[1.31rem]">
                <Image src={Images.COMMON.LOW_GAS_SVG} alt="gas" width={16} height={16} />
                <div>Low: {gasData?.minimumFee || '...'} sats/vB</div>
              </div>
              <div className="flex gap-2 pl-[1.12rem] pr-[1.25rem] mb-[1.31rem]">
                <Image src={Images.COMMON.MIDDLE_GAS_SVG} alt="gas" width={16} height={16} />
                <div>Medium: {gasData?.economyFee || '...'} sats/vB</div>
              </div>
              <div className="flex gap-2 pl-[1.12rem] pr-[1.25rem] mb-[1.31rem]">
                <Image src={Images.COMMON.FAST_GAS_SVG} alt="gas" width={16} height={16} />
                <div>High: {gasData?.fastestFee || '...'} sats/vB</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GasBtn
