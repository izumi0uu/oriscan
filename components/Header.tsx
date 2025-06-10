'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Search from '@/components/header/search'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { useEffect, useState, CSSProperties, FC, PropsWithChildren } from 'react'
import Image from 'next/image'
import ConnectWallet from '@/components/header/connectWallet'
import { Images } from '@/utils/images'
import { ENV } from '@/utils/env'
import MobileMenu from './CommonHeader/components/MobileMenu'

TimeAgo.addDefaultLocale(en)

const navData = [
  { link: '/ranking/brc20', title: 'Ranking', alias: ['/ranking/collections'] },
  { link: '/explore', title: 'Explore' },
  {
    link: '/analytics/hot-brc20',
    title: 'Analytics',
  },
  {
    link: '/navigation',
    title: 'Navigation',
  },
  { link: 'https://doc.ordinalscan.net/', title: 'Docs', _blank: true },
]

const NavLink: FC<
  PropsWithChildren & {
    pathname: string | null
    link: string
    _blank?: boolean
    alias?: string[]
  }
> = ({ children, pathname, link, _blank, alias }) => {
  const currentLink = pathname === link || alias?.includes(pathname || '')

  return (
    <Link
      target={_blank ? '_blank' : undefined}
      href={link}
      className={`${
        currentLink ? 'text-[#F5BD07]   after:bg-[#F5BD07]' : 'text-[#656565]'
      } relative hover:text-[#F5BD07] ease-linear duration-150 whitespace-nowrap px-[1.25rem]`}
    >
      {children}
    </Link>
  )
}

const Header: FC<{ pcStyle?: CSSProperties; logoUrl?: string }> = ({ pcStyle, logoUrl }) => {
  const [gasData, setGasData] = useState<{ economyFee: number; fastestFee: number; minimumFee: number }>()
  useEffect(() => {
    const fetchGasData = async () => {
      const response = await fetch(`${ENV.backend}/get-btc-fee `)
      const data = await response.json()
      setGasData(data?.data || { minimumFee: 0, economyFee: 0, fastestFee: 0 })
    }
    fetchGasData()
  }, [])
  const pathname = usePathname()

  document.body.style.overflow = 'auto'

  return (
    <header>
      <div className="hidden md:block">
        <div
          style={{ boxShadow: '0px 1px 0px 0px rgba(0, 0, 0, 0.25)', ...(pcStyle || {}) }}
          className="flex items-center gap-8 2xl:justify-between pt-4 pb-4 px-5 3xl:px-12 bg-[#fff]"
        >
          <div className="flex">
            <Link href="/" className="min-w-[201px]">
              <Image src={logoUrl || Images.COMMON.ICON3_SVG} alt="icon" width={201} height={28} />
            </Link>
            {!pathname?.startsWith('/ranking') ? (
              <div className="w-[220px] 2xl:w-[270px] 3xl:w-[330px] xl:ml-[25px] 3xl:ml-[36px] hidden xl:block">
                <Search />
              </div>
            ) : (
              <div className="w-[220px] 2xl:w-[270px] 3xl:w-[330px] xl:ml-[25px] 3xl:ml-[36px] hidden xl:block"></div>
            )}
          </div>
          <div className="flex items-center h-12 xl:space-x-2">
            <div className={`flex items-center xl:px-4 3xl:px-8 3xl:mr-[2.5rem] xl:-mr-[.5rem] mr-[.4rem]`}>
              {navData.map(({ link, title, _blank, alias }) => (
                <NavLink key={link} link={link} pathname={pathname} _blank={_blank} alias={alias}>
                  {title}
                </NavLink>
              ))}
              <div className="3xl:ml-[2.5rem] xl:ml-[1.66rem] hidden min-[912px]:block">
                <div className="relative group 3xl:w-[5.125rem] 3xl:h-[2.875rem] xl:h-[2.51rem] xl:w-[4.31rem] rounded-[1.6875rem] border border-yellow-500 text-center flex items-center text-[#F5BB00] px-4 3xl:gap-2 gap-1 cursor-pointer">
                  <Image
                    src={Images.COMMON.GASICON_SVG}
                    alt="gas"
                    width={16}
                    height={16}
                    className="3xl:w-[16px] xl:w-[10.6px]"
                  />
                  <span>{gasData?.economyFee || '...'}</span>
                  <div className="text-black">
                    <div className="absolute z-[99999999999999] hidden group-hover:flex flex-col rounded-md py-4 left-[50%] transform translate-x-[-50%] top-0 sm:top-[2.3rem] bg-white">
                      <div className="absolute top-1 left-0 right-0 bottom-0 rounded-md 'shadow-navItemShadow' z-negative"></div>
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
            </div>
            <div className="hidden min-[1024px]:block">
              <ConnectWallet />
            </div>
          </div>
        </div>
      </div>
      <MobileMenu />
    </header>
  )
}

export default Header
