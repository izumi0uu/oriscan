'use client'
import Header from '@/components/CommonHeader/CommonHeader'
import Footer from '@/components/Footer'
import { Brc20TopRankPC, Brc20TopRankMobile } from '@/components/ranking/brc20TopRank'
import { Brc20TopTransferPC, Brc20TopTransferMobile } from '@/components/ranking/brc20TopTransfer'
import SideBar from '@/components/ranking/SideBar'
import { Images } from '@/utils/images'

const items = [{ title: { text: 'Hot BRC20', icon: Images.COMMON.HOTBRC20_SVG } }]
const Ranking = () => {
  return (
    <>
      <Header />
      <div className="flex max-w-[1440px] min-xl:min-w-[1440px] mx-auto w-[1440px]">
        <SideBar items={items} />
        <div style={{ minHeight: 'calc(100vh - 364px)' }} className="flex-1 mb-[80px] min-w-0 overflow-auto">
          <div className="w-[85%] sm:w-[91%] mx-auto ml-12 block sm:flex 2xl:gap-x-[15px] gap-x-[5px] mt-[27px]">
            <div className="w-full flex-5">
              <div className="w-full hidden sm:block">
                <Brc20TopRankPC />
              </div>
              <div className="w-full mt-[27px] block sm:hidden">
                <Brc20TopRankMobile />
              </div>
            </div>
            <div className="w-full flex-6">
              <div className="w-full hidden sm:block">
                <Brc20TopTransferPC />
              </div>
              <div className="w-full mt-[27px] sm:hidden">
                <Brc20TopTransferMobile />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Ranking
