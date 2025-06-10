'use client'

import Link from 'next/link'
import Footer from '../../../../components/Footer'
import Header from '../../../../components/CommonHeader/CommonHeader'
import Intro from '../../../../components/Intro'
import { useTitle, useHover } from 'ahooks'
import { useRef, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间插件
import { Images } from '@/utils/images'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import CollectionsTransferList from '@/components/home/collections-transfer-list'

dayjs.extend(relativeTime)
export default function Home() {
  const pathname = usePathname()
  useTitle('Ordinals Explorer | Ordinalscan')
  const brc20Ref = useRef(null)
  const collectionsRef = useRef(null)
  const isBrc20Hover = useHover(brc20Ref)
  const isCollectionsHover = useHover(collectionsRef)

  return (
    <>
      <Header pcStyle={{ background: 'none', boxShadow: 'none', position: 'absolute', zIndex: 5, width: '100%' }} />
      <main className="flex max-w-[1280px] min-xl:min-w-[1280px] w-full flex-col min-h-screen mx-auto relative z-1 overflow-hidden">
        <div className="space-y-10 w-[100%] mx-[auto] mt-[3.12rem] mb-[2.44rem] max-md:mb-[180px]">
          <Intro />
        </div>
        <div>
          <div className="flex justify-between max-md:flex-col mb-[1.94rem]">
            <div className="flex">
              {[
                {
                  name: 'BRC20',
                  icon: Images.COMMON.BRC20LINK_SVG,
                  activeIcon: Images.COMMON.ACTIVE_BRC20LINK_SVG,
                  ref: brc20Ref,
                },
                {
                  name: 'Collections',
                  icon: Images.COMMON.COLLECTIONS_SVG,
                  activeIcon: Images.COMMON.ACTIVE_COLLECTIONS_SVG,
                  ref: collectionsRef,
                },
              ].map(({ name, icon, activeIcon, ref }) => (
                <div
                  ref={ref}
                  key={name}
                  onClick={() => {
                    window.location.href = `/ranking/${name.toLowerCase()}`
                  }}
                  className={`hover:text-[#F5BC00] cursor-pointer flex items-center ${
                    name === 'BRC20' && 'mr-[1.56rem]'
                  } ${pathname?.includes(name.toLowerCase()) && 'text-[#F5BC00] font-semibold'}`}
                >
                  {pathname?.includes(name.toLowerCase()) ? (
                    <Image src={activeIcon} alt={name} width={16} height={16} className="mr-[.5rem]" />
                  ) : (
                    <Image
                      src={
                        name === 'BRC20' ? (isBrc20Hover ? activeIcon : icon) : isCollectionsHover ? activeIcon : icon
                      }
                      alt={name}
                      width={16}
                      height={16}
                      className="mr-[.5rem]"
                    />
                  )}
                  {name}
                </div>
              ))}
            </div>
          </div>
          <CollectionsTransferList />
        </div>
      </main>
      <div className="mt-[100px]">
        <div className="flex sm:gap-x-[70px] px-4 sm:px-6 md:px-12 2xl:px-40 justify-between sm:justify-normal mb-[2rem] text-[#000] text-3xl font-bold">
          Partner
        </div>
        <div className="flex items-end px-4 sm:px-6 md:px-12 2xl:px-40">
          <Link href="https://www.bybit.com/en/" target="_blank">
            <img src={Images.COMMON.BYBIT_PNG} alt="bybit" className="h-[19px] sm:h-[42px] mr-[2.5rem]" />
          </Link>
          <Link href="https://www.coingecko.com/" target="_blank">
            <img src={Images.COMMON.COINGECKO_PNG} alt="coingecko" className="h-[19px] sm:h-[32px] mr-[2.5rem]" />
          </Link>
          <Link href="https://coinmarketcap.com/" target="_blank">
            <img
              src={Images.COMMON.COINMARKETCAP_PNG}
              alt="coinmarketcap"
              className="h-[19px] sm:h-[32px] mr-[2.5rem]"
            />
          </Link>
          <Link href="https://www.gate.io/" target="_blank">
            <img src={Images.COMMON.GATE_PNG} alt="gate" className="h-[19px] sm:h-[32px] mr-[2.5rem]" />
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
