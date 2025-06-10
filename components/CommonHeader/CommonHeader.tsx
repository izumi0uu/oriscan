'use client'

import Link from 'next/link'
import Search from '@/components/header/NewSearch'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { CSSProperties, FC } from 'react'
import Image from 'next/image'
import ConnectWallet from '@/components/header/connectWallet'
import { Images } from '@/utils/images'
import NavLink from './components/NavLink'
import GasBtn from './components/GasBtn'
import MobileMenu from './components/MobileMenu'

TimeAgo.addDefaultLocale(en)

const Header: FC<{ pcStyle?: CSSProperties; logoUrl?: string }> = ({ pcStyle, logoUrl }) => {
  const renderOrdinalLogo = () => {
    return (
      <Link href="/ranking/brc20" className="min-w-[11.15213rem] mr-[1.5rem]">
        <Image src={logoUrl || Images.COMMON.ORDINAL_ICON_SVG} alt="icon" width={178.438} height={26} />
      </Link>
    )
  }

  return (
    <header>
      <div className="hidden md:flex md:justify-center w-full h-[4.375rem] border-b-[1px] border-[#e5e5e5]">
        <div
          style={{ ...(pcStyle || {}) }}
          className="flex items-center bg-[#fff] h-[4.375rem] max-w-[1280px] min-xl:min-w-[1280px] mx-auto w-[1280px]  border-b-[1px] border-[#e5e5e5]"
        >
          {renderOrdinalLogo()}
          <div className="flex items-center h-12 xl:space-x-2">
            <div className={`flex items-center xl:px-4 xl:-mr-[.5rem] mr-[.4rem]`}>
              <NavLink />
              <Search />
              <GasBtn />
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
