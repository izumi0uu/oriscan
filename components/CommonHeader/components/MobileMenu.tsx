import { Images } from '@/utils/images'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import NavLink from './NavLink'
import Image from 'next/image'

const MobileMenu = () => {
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [showOverlay])

  return (
    <div className="md:hidden flex">
      <div
        style={{ boxShadow: '0px 4px 7px 0px rgba(0, 0, 0, 0.02)' }}
        className="relative shadow-md bg-[#fff] w-full flex justify-between items-center"
      >
        <Image
          onClick={() => {
            setShowOverlay((o) => !o)
          }}
          src={Images.COMMON['MOBILE_MENU-ICON_SVG']}
          alt="menu"
          width={22}
          height={18}
          className="box-content py-5 ml-5 cursor-pointer"
        />
        <Link href="/">
          <Image
            src={Images.COMMON.ICON_MOBILE_SVG}
            width={34}
            height={34}
            alt="logo"
            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
          />
        </Link>
      </div>
      <div
        className={`fixed left-0 top-0 w-full h-[100vh] text-[12px] overflow-hidden tet-[#656565] bg-[#fff] flex flex-col space-y-5 mt-14 border-t ${
          showOverlay ? 'z-[9999999999999] opacity-[1]' : 'z-[-1] opacity-[0]'
        }`}
      >
        <NavLink />
      </div>
    </div>
  )
}

export default MobileMenu
