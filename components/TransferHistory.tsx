import { decodeBtcAddress } from '@stacks/stacking'

import ReactTimeAgo from 'react-time-ago'
import useSWR from 'swr'

import { API_URL } from '@/utils/constants'
import { fetcher } from '@/utils/helpers'
import { InscriptionResponse, InscriptionTransferResponse, ListResponse } from '@/utils/types'
import Loading from './Loading'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'
import styles from './TransferHistory.module.css'
import { Images } from '@/utils/images'

const TransferHistory = (params: { inscription: InscriptionResponse }) => {
  const { data, error, isLoading } = useSWR<
    | ListResponse<InscriptionTransferResponse>
    | {
        // todo: add more generic api error response type
        error: string
        message: string
        statusCode: number
      }
  >(`${API_URL}/inscriptions/${params.inscription.id}/transfers`, fetcher)

  if (!params.inscription || !data) return <Loading />
  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>
  if ('error' in data)
    return (
      <span>
        Something went wrong ʕ•̠͡•ʔ
        <br />
        {data.error}: {data.message}
      </span>
    )

  if (data.results.filter((item) => item.address).length === 0) return <></>
  return (
    <div className="text-center flex flex-col items-center p-2">
      <h2 className="text-center text-xl my-4 font-bold">Transfer History</h2>
      <div className="flex flex-col items-center w-full max-w-2xl border-0 sm:border rounded-lg p-0 sm:p-8 space-y-4">
        {data.results
          .filter((item) => item.address)
          .map((transfer, i) => (
            <>
              <div className="hidden sm:block" key={transfer.tx_id}>
                <TransferRowItem transfer={transfer} length={data.results.length} i={i} />
              </div>
              <div className="block sm:hidden w-full" key={transfer.tx_id}>
                <TransferRowItemMobile transfer={transfer} length={data.results.length} i={i} />
              </div>
            </>
          ))}
      </div>
    </div>
  )
}

export default TransferHistory

function TransferRowItemMobile(params: { transfer: InscriptionTransferResponse; i: number; length: number }) {
  const { data: bytes } = decodeBtcAddress(params.transfer.address)

  const [startR, startG, startB] = bytes.slice(0, 6)
  const [endR, endG, endB] = bytes.slice(6, 12)

  const startOpacity = Math.round(((bytes.at(-1) ?? 127) / 255) * 100)
  const endOpacity = Math.round(((bytes.at(-2) ?? 127) / 255) * 100)

  const degree = Math.round(((bytes.at(-3) ?? 127) / 255) * 180)

  const isGenesis = params.i === params.length - 1
  return (
    <div className="gap-y-2">
      <div className="text-sm flex items-center justify-between">
        <div className="flex items-center text-sm w-16">#{params.transfer.block_height}</div>
        <ReactTimeAgo date={params?.transfer?.timestamp} locale="en-US" />
      </div>
      <div className="mt-1">
        <div className="relative group rounded-[6px] overflow-hidden">
          <div
            className={`${styles.gradient} group-hover:filter-none absolute inset-0 w-full h-full transition-[filter] duration-350 z-0`}
            style={{
              background: `linear-gradient(${degree}deg, rgba(${startR}, ${startG}, ${startB}, ${startOpacity}), rgba(${endR}, ${endG}, ${endB}, ${endOpacity})), url(${Images.COMMON.NOISE_PNG}})`,
              backgroundBlendMode: 'multiply',
            }}
          />
          <div className="relative min-w-0 flex flex-row px-1.5 max-w-sm py-0.5 z-10">
            <span className="whitespace-nowrap text-white overflow-hidden overflow-ellipsis">
              {params.transfer.address}
            </span>
            {isGenesis && (
              // show genesis star on first element
              // todo: if genesis is last element, we can use relative/absolute positioning to make this easier (non-js)
              <div className="flex items-center">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="relative w-4 h-4 bg-[rgba(242,240,237,.4)] rounded border border-white mr-[1px] z-20">
                        <div className="absolute text-white w-full h-full mt-[-3px]">*</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Inscription genesis</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TransferRowItem(params: { transfer: InscriptionTransferResponse; i: number; length: number }) {
  const { data: bytes } = decodeBtcAddress(params.transfer.address)

  const [startR, startG, startB] = bytes.slice(0, 6)
  const [endR, endG, endB] = bytes.slice(6, 12)

  const startOpacity = Math.round(((bytes.at(-1) ?? 127) / 255) * 100)
  const endOpacity = Math.round(((bytes.at(-2) ?? 127) / 255) * 100)

  const degree = Math.round(((bytes.at(-3) ?? 127) / 255) * 180)

  const isGenesis = params.i === params.length - 1
  return (
    <div className="flex flex-col items-end">
      <div className="text-sm">
        <ReactTimeAgo date={params?.transfer?.timestamp} locale="en-US" />
      </div>
      <div className="flex">
        <div className="flex items-center text-sm w-16">#{params.transfer.block_height}</div>
        <div className="relative group rounded-[6px] overflow-hidden">
          <div
            className={`${styles.gradient} group-hover:filter-none absolute inset-0 w-full h-full transition-[filter] duration-350 z-0`}
            style={{
              background: `linear-gradient(${degree}deg, rgba(${startR}, ${startG}, ${startB}, ${startOpacity}), rgba(${endR}, ${endG}, ${endB}, ${endOpacity})), url(${Images.COMMON.NOISE_PNG}})`,
              backgroundBlendMode: 'multiply',
            }}
          />
          <div className="relative min-w-0 flex flex-row px-1.5 max-w-sm py-0.5 z-10">
            <span className="whitespace-nowrap text-white overflow-hidden overflow-ellipsis">
              {params.transfer.address}
            </span>
            {isGenesis && (
              // show genesis star on first element
              // todo: if genesis is last element, we can use relative/absolute positioning to make this easier (non-js)
              <div className="flex items-center">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="relative w-4 h-4 bg-[rgba(242,240,237,.4)] rounded border border-white mr-[1px] z-20">
                        <div className="absolute text-white w-full h-full mt-[-3px]">*</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Inscription genesis</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
