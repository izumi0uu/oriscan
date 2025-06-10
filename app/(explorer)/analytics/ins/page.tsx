'use client'
import { useState } from 'react'
import Header from '@/components/CommonHeader/CommonHeader'
import Footer from '@/components/Footer'
import { InsPC, InsMobile } from '@/components/ranking/ins'

const Ranking = () => {
  const [status, setStatus] = useState('Collections')
  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 364px)' }}>
        {/* <div className="pt-12 pb-[10px] sm:pb-14 text-[#656565]">
          <h1 className=" text-lg text-center font-bold pb-5">Real Time Data Ranking</h1>
          <p className="text-center text-[13px] sm:text-[16px]">
            Top Projects ranked by volume,floor price and other statistics.
          </p>
        </div> */}
        <div className="mt-[30px] w-[85%] sm:w-[88%] mx-auto sm:flex sm:flex-row items-center gap-x-[15px] sm:gap-x-[20px] justify-center">
          {['BRC20', 'Collections'].map((item) => (
            <div
              key={item}
              // onClick={() => setStatus(item)}
              className={`text-[#4f4f4f] rounded-md px-5 py-2 hover:bg-[#F7D56A] hover:border hover:border-[#F7D56A] ${
                status === item ? 'bg-[#F7D56A] border border-[#F7D56A]' : 'border border-[#d1d1d1]'
              } cursor-pointer`}
            >
              <a href={'/ranking/' + (item === 'Collections' ? 'collections' : item.toLowerCase())}>{item}</a>
            </div>
          ))}
        </div>
        <div className="mt-[30px] w-[85%] sm:w-[88%] mx-auto">
          <div className="w-full mt-[27px] hidden sm:block">
            <InsPC />
          </div>
          <div className="w-full mt-[27px] block sm:hidden">
            <InsMobile />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Ranking
