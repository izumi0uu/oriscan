'use client'
import { useState, FC } from 'react'
import TransferHistory from './transferHistory'
import InscriptionList from './InscriptionList'

const Tabs: FC<{ id: string }> = ({ id }) => {
  const [status, setStatus] = useState<string>('Transfer History')

  return (
    <div>
      <div className="flex items-center gap-x-[15px] sm:gap-x-[75px] font-bold mt-[50px] ">
        {['Transfer History', 'Inscriptions'].map((item) => (
          <div
            key={item}
            onClick={() => setStatus(item)}
            className={`text-[#4f4f4f] ${
              status === item
                ? 'relative after:absolute after:w-[60%] after:h-[4px] after:bg-[#F9D560] after:left-[50%] after:top-[120%] after:translate-x-[-50%]'
                : ''
            } cursor-pointer`}
          >
            {item}
          </div>
        ))}
      </div>
      {status === 'Transfer History' && <TransferHistory symbol={id} />}
      {status === 'Inscriptions' && <InscriptionList symbol={id} />}
    </div>
  )
}
export default Tabs
