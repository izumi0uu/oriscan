'use client'

import Header from '@/components/CommonHeader/CommonHeader'
import Footer from '@/components/Footer'
import { Brc20PC, Brc20Mobile } from '@/components/ranking/brc20'

const Ranking = () => {
  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 364px)' }}>
        <div className="pt-12 pb-[10px] sm:pb-14 text-[#656565]">
          <h1 className=" text-lg text-center font-bold pb-5">Real Time Data Ranking</h1>
          <p className="text-center text-[13px] sm:text-[16px]">
            Top Projects ranked by volume,floor price and other statistics.
          </p>
        </div>
        <div className="w-[85%] sm:w-[80%] mx-auto">
          <div className="w-full mt-[27px] hidden sm:block">
            <Brc20PC />
          </div>
          <div className="w-full mt-[27px] block sm:hidden">
            <Brc20Mobile />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Ranking
