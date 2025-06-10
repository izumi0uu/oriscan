import { Images } from '@/utils/images'
import Image from 'next/image'
import React from 'react'

const Intro: React.FC = () => {
  return (
    <div>
      <div className=" text-3xl font-semibold mb-2">Cryptocurrencies Ranked by Market Cap</div>
      <div className="text-xs text-[#64758B]">
        Ordinalscan is a platform that functions as an explorer, API provider, and analytics tool for monitoring the
        Bitcoin network.
      </div>
    </div>
  )
}

export default Intro
