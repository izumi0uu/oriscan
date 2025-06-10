'use client'
import React, { useState, FC, useRef } from 'react'
import TransferHistory from './transferHistory'
import InscriptionList from './InscriptionList'
import Info from './info'
import Holders from '@/app/(explorer)/coin/brc20/[id]/holders'

const Tabs: FC<{ id: string }> = ({ id }) => {
  const [status, setStatus] = useState('Holders')

  const addressRef = useRef<HTMLInputElement>(null)
  const [searchAddress, setSearchAddress] = useState('')
  const [inputAddress, setInputAddress] = useState('')

  const handleAddressChange = (e: any) => {
    setInputAddress(e.target.value)
  }

  const handleSearchButton = (e: any) => {
    setSearchAddress(inputAddress)
  }

  return (
    <div>
      <div className="flex justify-between mt-[50px]">
        <div className="flex gap-x-[40px] sm:gap-x-[75px] font-bold">
          {['Holders', 'Transfers', 'Info'].map((item) => (
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
        {/* <div className='hover:cursor-pointer'>
          <span className='border font-normal px-2 bg-white rounded-md'>24h</span>
        </div> */}
        {status === 'Holders' && (
          <div className="w-[300px]">
            <div className="relative max-w-sm mx-auto">
              <input
                type="search"
                placeholder="Address"
                // value={searchAddress}
                ref={addressRef}
                onChange={(e) => handleAddressChange(e)}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={(e) => handleSearchButton(e)}
                className="absolute text-sm inset-y-0 right-0 flex items-center px-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      {status === 'Transfers' && <TransferHistory tick={id} />}
      {status === 'Holders' && <Holders tick={id} address={searchAddress} />}
      {status === 'Info' && <Info tick={id} />}
    </div>
  )
}
export default Tabs
