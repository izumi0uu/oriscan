import Image from 'next/image'
import React, { ReactElement, useState } from 'react'

type Item = {
  title: { icon?: string; text: string }
  subTitles?: string[]
}
type Props = {
  items: Item[]
}

const SideBar = ({ items }: Props) => {
  const [current, setCurrent] = useState(0)
  return (
    <div className="2xl:w-[15rem] xl:w-[11.2rem] min-w-[6rem] z-50">
      <div className="mt-[3.6rem]">
        {items.map((i, ind) => (
          <div
            onClick={() => setCurrent(ind)}
            key={i.title.text}
            className={`flex items-center xl:py-[1rem] h-[3.125rem] 2xl:py-[1.5rem] cursor-pointer font-bold ${
              current === ind ? 'bg-[#f2f2f2]' : ''
            }`}
          >
            {i.title?.icon && <Image src={i.title.icon} alt="icon" height={17} width={17} className="ml-[5.15rem]" />}
            <span className="ml-[.75rem]">{i.title.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar
