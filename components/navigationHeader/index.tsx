'use client'

import Link from 'next/link'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import Image from 'next/image'
import { Images } from '@/utils/images'
TimeAgo.addDefaultLocale(en)

const Header = () => {
  return (
    <header>
      <div className="">
        <div
          style={{}}
          className="flex items-center justify-between py-8 lg:px-20 px-5 bg-[#f5f5f5]  fixed top-0 left-0 w-full"
        >
          <div className="flex">
            <Link href="/" className="min-w-[201px]">
              <Image src={Images.COMMON.ICON3_SVG} alt="icon" width={201} height={28} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
