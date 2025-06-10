import { useUnisatWallet } from '@/context/unisatWallectContext'
import { getEllipsisStr } from '@/utils'
import Link from 'next/link'
import useMobile from '@/hooks/useMobile'
import { Images } from '@/utils/images'
import { useEffect } from 'react'
import { ENV } from '@/utils/env'

const ConnectedMenus = () => {
  const isMobile = useMobile()
  const { deActive, account } = useUnisatWallet()
  const handleLogout = () => {
    deActive()
  }
  return (
    <div
      className="absolute -left-[65px] top-[3rem] w-[13.56rem]  text-[#000] rounded-[.65rem] hidden group-hover:block z-[1001]"
      style={{
        background: !isMobile ? '#fff' : '#f0f0f0',
        backgroundImage: `url(${Images.COMMON.CONNECT_BG_SVG})`,
        filter: 'drop-shadow(0px 0px 10px rgba(100, 117, 139, 0.25))',
        fill: '#fff',
      }}
    >
      <Link
        style={{ background: !isMobile ? '#fff' : '#f0f0f0' }}
        className={`flex gap-x-[11px] pt-[.63rem] items-center ${isMobile ? 'bg-[#f0f0f0]' : 'bg-[#fff]'}`}
        href={`/address/${account}`}
      >
        <div className="hover:bg-[#F0F2F5] flex items-center gap-3 w-full pl-[0.63rem] ml-[0.5rem] mr-[0.5rem] py-[.63rem] rounded-[.63rem]">
          <img src={Images.COMMON.MY_ITEMS_SVG} alt="" width={15} />
          My Items
        </div>
      </Link>
      <div
        style={{ background: !isMobile ? '#fff' : '#f0f0f0' }}
        className="flex gap-x-[11px] items-center pb-[.63rem]"
        onClick={(e) => {
          e.stopPropagation()
          handleLogout()
        }}
      >
        <div className="hover:bg-[#F0F2F5] flex items-center gap-3 w-full pl-[0.63rem] ml-[0.5rem] mr-[0.5rem] py-[.63rem] rounded-[.63rem]">
          <img src={Images.COMMON.DISCONNECT_SVG} alt="" width={15} />
          Disconnect
        </div>
      </div>
    </div>
  )
}

const ConnectWallet = () => {
  const { account, active, connected } = useUnisatWallet()

  useEffect(() => {
    const getUserInfoOrCreate = async () => {
      const response = await fetch(`${ENV.backend}/users/${account}`)
      await response.json()
    }
    if (connected) getUserInfoOrCreate()
  }, [connected])

  const handleConnect = () => {
    active()
  }
  return (
    <div className="w-[7.125rem] h-[4.3rem] group ml-[1.2rem] flex items-center group">
      <div
        className={`relative cursor-pointer select-none rounded-[.625rem] flex w-full h-[2.5rem] items-center justify-center ${
          account && connected ? 'bg-[#EFF2F5] text-[#000]' : 'bg-[#000] text-[#fff]'
        }`}
        onClick={handleConnect}
      >
        {account && connected ? getEllipsisStr(account) : <span className=" whitespace-nowrap">Connect</span>}
        {account && connected && <ConnectedMenus />}
      </div>
    </div>
  )
}
export default ConnectWallet
