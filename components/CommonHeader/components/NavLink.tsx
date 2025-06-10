import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC, PropsWithChildren } from 'react'

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
const NavLink: FC<PropsWithChildren> = () => {
  const pathname = usePathname()
  return (
    <div className="md:flex md:gap-[1.57rem]">
      {navData.map(({ link, title, _blank, alias }) => {
        const currentLink = pathname === link || alias?.includes(pathname || '')
        return (
          <div key={title} className="mb-[1rem] ml-[1.2rem] md:mb-0 md:ml-0">
            <Link
              key={title}
              target={_blank ? '_blank' : undefined}
              href={link}
              className={`
            ${
              currentLink ? 'text-[#F5BD07]   after:bg-[#F5BD07] font-bold' : 'text-[#64758B] font-medium'
            } relative hover:text-[#F5BD07] ease-linear duration-150 whitespace-nowrap`}
            >
              {title}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default NavLink
