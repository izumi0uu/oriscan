// @ts-nocheck

'use client'

import Link from 'next/link'
import useSWR from 'swr'

import { CDN } from '@/utils/constants'
import { fetcher } from '@/utils/helpers'
import Loading from './Loading'
import { BaseResponse, InscriptionResponse, TransferHistoryItem, InscriptionResponseOrdianlScan } from '@/utils/types'
import InscriptionRender from './InscriptionRender'
import { useTitle } from 'ahooks'
import TransferHistory from '@/components/inscription/transferHistory'
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import { I } from '@/utils/infinite'
import { LoadingOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import Dropdown, { MenuItemWrapper, MenuItemText } from '@/components/dropdown'
import ParseRecure from '@/components/parseRecure'
import Head from 'next/head'
import Copy from '@/components/copy'
import { ENV } from '@/utils/env'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const Trade: FC<{ id: string | number }> = ({ id }) => {
  return (
    <Dropdown
      noStyle
      contentStyle={{ width: '104px' }}
      menu={[
        {
          key: 'Element',
          label: (
            <MenuItemWrapper
              onClick={() => {
                window.open(`https://element.market/assets/btc/ordi/${id}`, '_blank')
              }}
            >
              <MenuItemText style={{ marginLeft: 5 }}>Element</MenuItemText>
            </MenuItemWrapper>
          ),
        },
        {
          key: 'UniSat',
          label: (
            <MenuItemWrapper
              onClick={() => {
                window.open(`https://unisat.io/inscription/${id}`, '_blank')
              }}
            >
              <MenuItemText style={{ marginLeft: 5 }}>UniSat</MenuItemText>
            </MenuItemWrapper>
          ),
        },
      ]}
    >
      <div className="text-base font-[light] gap-x-2 flex items-center justify-center text-[#F5BD07] hover:underline cursor-pointer">
        <span>Trade</span>
        <svg width="15" height="8" viewBox="0 0 15 8" fill="none">
          <path
            d="M14.3066 0.872478C14.2814 0.811584 14.2387 0.759538 14.1839 0.722919C14.129 0.6863 14.0646 0.666753 13.9987 0.666748L0.665366 0.666747C0.599431 0.666737 0.534975 0.686281 0.480148 0.722907C0.425322 0.759534 0.382588 0.811597 0.357355 0.872513C0.332122 0.933428 0.325521 1.00046 0.338387 1.06513C0.351253 1.12979 0.383009 1.18919 0.429637 1.23581L7.0963 7.90248C7.12726 7.93344 7.16401 7.958 7.20445 7.97475C7.2449 7.99151 7.28825 8.00013 7.33203 8.00013C7.37581 8.00013 7.41917 7.99151 7.45961 7.97475C7.50006 7.958 7.53681 7.93344 7.56776 7.90248L14.2344 1.23581C14.281 1.18918 14.3128 1.12977 14.3256 1.06509C14.3385 1.00042 14.3319 0.933389 14.3066 0.872478Z"
            fill="#F5BD07"
          />
        </svg>
      </div>
    </Dropdown>
  )
}

const RwaData: React.FC<{ id: string; data: any }> = ({ id, data }) => {
  const [text, setText] = useState('')

  useEffect(() => {
    ;(async () => {
      const res = await fetch(`${data?.content_uri}`)
      const text = await res.text()
      setText(text)
    })()
  }, [id])

  return (
    <div className="flex items-center overflow-hidden">
      <div className="bg-[#f2f2f2] flex-1 overflow-x-auto text-wrap">
        <div title={text} className=" px-2.5 py-0.5">
          {text}
        </div>
      </div>
      <Copy copyText={text} />
    </div>
  )
}

const InscriptionDetails = (params: { iid: string }) => {
  const fetchTransferHistory = async (data: { page: number; limit: number }) => {
    // @ts-ignore
    const response = await fetch(
      `${ENV.backend}/inscriptions/${params.iid}/transfer?limit=${data.limit}&page=${data.page}`,
    )
    // @ts-ignore
    const res = await response.json()
    return res.data
  }
  const {
    data: transferHistory,
    loading: transferHistoryLoading,
    loadingMore: transferHistoryLoadingMore,
    noMore: transferHistoryNoMore,
  } = useWindowInfiniteScroll(
    // @ts-ignore
    I(fetchTransferHistory, { limit: 60 }),
    {
      threshold: 300,
      reloadDeps: [],
      //@ts-ignore
      isNoMore: (data1, data2) => {
        return data1?.page * data1?.limit >= data1?.total
      },
    },
  )
  const { data: checkPendingData } = useSWR<{
    data: {
      inscription_id: string
      content_type: string
      content_length: number
      content_uri: string
      to_address: string
      mempool_tx_id: string
      tx_id: string
    }
  }>(`${ENV.backend}/mempool/inscription?inscription_id=${params.iid}`, fetcher)
  const { data: _data, error } = useSWR<
    | InscriptionResponse
    | {
        // todo: add more generic api error response type
        error: string
        message: string
        statusCode: number
      }
  >(`${ENV.backend}/inscriptions/${params.iid}`, fetcher)

  const { data: _data2, error: error2 } = useSWR<
    | BaseResponse<InscriptionResponseOrdianlScan>
    | {
        // todo: add more generic api error response type
        error: string
        message: string
        statusCode: number
      }
  >(`${ENV.backend}/inscriptions/${params.iid}`, fetcher)

  const { data: projectData } = useSWR<{
    data: {
      id: number
      name: string
      symbol: string
      display_type: string
    } | null
  }>(`${ENV.backend}/inscription/collection/${params.iid}`, fetcher)
  const documentTitle = `${projectData?.data?.name || 'Inscription'} ${window.location.hash} | Ordinalscan`
  useTitle(documentTitle)

  if (!params.iid) return <div>404</div>

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>
  if (!_data) return <Loading />

  const _checkPendingData = checkPendingData?.data

  const data =
    _data?.statusCode === 404
      ? {
          id: _checkPendingData?.inscription_id,
          number: 'unconfirmed',
          content_type: _checkPendingData?.content_type || '',
          content_length: _checkPendingData?.content_length,
          sat_ordinal: 'unconfirmed',
          sat_rarity: 'unconfirmed',
          address: _checkPendingData?.to_address,
          genesis_address: _checkPendingData?.to_address,
          genesis_tx_id: _checkPendingData?.mempool_tx_id,
          genesis_timestamp: 'unconfirmed',
          timestamp: 'unconfirmed',
          genesis_block_height: 'unconfirmed',
          genesis_fee: 'unconfirmed',
          output: _checkPendingData?.output,
          offset: 0,
          content_uri: _checkPendingData?.content_uri,
        }
      : _data?.data || _data

  if (data && 'error' in data)
    return (
      <span>
        Something went wrong ʕ•̠͡•ʔ
        <br />
        {data.error}: {data.message}
      </span>
    )

  const wasTransferred = data.timestamp !== data.genesis_timestamp

  const getInfo = () => {
    if (projectData?.data?.display_type === 'bitmap') {
      return (
        <Link
          href={`${CDN}/content/${data.id}`}
          className="flex items-center justify-center h-full text-white font-bold"
        >
          <img
            src={`https://img-cdn.magiceden.dev/rs:fit:400:0:0/plain/https://bitmap-img.magiceden.dev/v1/${data.id}`}
            height={346.488}
            width={346.488}
            alt={`${projectData?.data?.name || 'Inscription'} #${_data2?.data.number}`}
          />
        </Link>
      )
    }

    if (data?.content_type?.includes('image')) {
      if (checkPendingData?.data?.inscription_id || _data.statusCode === 404) {
        return (
          <div className="w-full h-full flex justify-center items-center bg-[#F2F0ED]">
            <iframe
              alt={`${projectData?.data?.name || 'Inscription'} #${inscription.number}`}
              src={data.content_uri}
              style={{ imageRendering: 'pixelated' }}
              width={346.488}
              height={346.488}
            />
          </div>
        )
      }
      return <InscriptionRender className="overflow-hidden" inscription={data} contentUri={data.content_uri} />
    }
    if (
      data?.content_type?.includes('text') ||
      data?.content_type?.includes('audio') ||
      data?.content_type?.includes('video')
    ) {
      return <InscriptionRender className="overflow-hidden" inscription={data} contentUri={data.content_uri} />
    }
    if (data?.content_type?.includes('model/gltf-binary')) {
      return <div className="flex items-center justify-center w-full h-full bg-[#121518] text-white text-4xl">3D</div>
    }
    return null
  }

  return (
    <>
      <Head>
        <title>{documentTitle}</title>
      </Head>
      <div className="flex max-xl:flex-col mt-[3.06rem]">
        <div className="max-md:max-w-[448px]">
          <div className="pt-5">
            <div>
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg md:text-xl text-[#000]">Inscription</div>
              </div>
              <div className="flex justify-between my-4 md:mt-[.63rem] md:mb-[.75rem]">
                <div className="text-2xl md:text-[2.5rem] font-bold leading-none">#{_data2?.data?.number}</div>
                <div className=" mt-[.7rem]">
                  <Trade id={data.id} />
                </div>
              </div>
            </div>
            <div className="w-[21.6555rem] h-[21.6555rem] sm:w-[21.6555rem] sm:h-[21.6555rem] p-3 border border-[#E5E5E5] rounded-[1px] max-sm:m-auto">
              {getInfo()}
            </div>
            <div className="flex items-center text-[#4f4f4f] w-fit mt-[.75rem]">
              {checkPendingData?.data?.inscription_id || _data.statusCode === 404 ? (
                <div
                  onClick={() => {
                    window.open(`https://mempool.space/tx/${checkPendingData?.data?.tx_id || ''}`)
                  }}
                  className="h-[22px] box-content py-[6px] px-5 cursor-pointer bg-[#F5BC00] hover:bg-[#fdcf45] flex items-center space-x-2 duration-100 ease-linear"
                >
                  <LoadingOutlined /> <span>Pending...</span>
                </div>
              ) : (
                <div className="flex">
                  <div className="flex justify-center items-center bg-[#CEFFDF] border border-[#04B03E] rounded-sm py-[.3rem] px-[.63rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7Z"
                        fill="#1BA030"
                      />
                      <path
                        d="M2.01023 7.67431L3.18087 6.33133C3.18087 6.33133 3.4236 6.24503 3.62578 6.3734L5.79352 8.14354C5.79352 8.14354 6.07576 8.30264 6.31731 8.10147L10.3846 4.1049C10.3846 4.1049 10.6441 3.89479 10.8547 4.0693L11.9528 5.20193C11.9528 5.20193 12.076 5.38782 11.9244 5.55467L6.52556 10.8845C6.52556 10.8845 6.26284 11.1569 5.85978 10.8651L2.07333 7.88465C2.07333 7.88465 1.96731 7.77405 2.01023 7.67431Z"
                        fill="white"
                      />
                    </svg>
                    <span>
                      <div className="text-base text-[#4F4F4F] ml-[.13rem]">Confirmed</div>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-x-hidden flex flex-col space-y-6 bg-[#fff] py-[1.5rem] md:ml-[5.73rem]">
          {[
            { title: 'TYPE', render: (data) => <span className="uppercase">{data.content_type}</span> },
            {
              title: 'ID',
              render: (data) => (
                <div className="flex items-center gap-x-1 text-[#4f4f4f] w-full">
                  <span className="truncate flex-1">{data.id}</span>
                  <Copy copyText={data?.id} />
                </div>
              ),
            },
            {
              title: 'OWNED BY',
              render: (data) => (
                <div className="flex items-center gap-x-1 overflow-hidden">
                  <Link href={`/address/${data.address}`} className="flex-1 truncate underline text-[#4f4f4f]">
                    <span>{data.address}</span>
                  </Link>
                  <Copy copyText={data.address} />
                </div>
              ),
            },
            {
              title: 'INSCRIBED BY',
              render: (data) => (
                <div className="flex items-center gap-x-1 overflow-hidden">
                  <Link href={`/address/${data.genesis_address}`} className="flex-1 truncate underline text-[#4f4f4f]">
                    <span>{data.genesis_address}</span>
                  </Link>
                  <Copy copyText={data.genesis_address} />
                </div>
              ),
            },
            {
              title: 'INSCRIPTION TXID',
              render: (data) => (
                <div className="flex items-center gap-x-1 overflow-hidden">
                  <Link
                    className="flex-1 truncate underline w-full text-[#4f4f4f]"
                    href={`https://mempool.space/tx/${data.genesis_tx_id}`}
                    target="_blank"
                  >
                    <span>{data.genesis_tx_id}</span>
                  </Link>
                  <Copy copyText={data.genesis_tx_id} />
                </div>
              ),
            },
            {
              title: 'INSCRIPTION DATE(UTC)',
              render: (data) =>
                data?.genesis_timestamp === 'unconfirmed'
                  ? 'unconfirmed'
                  : dayjs.utc((data.genesis_timestamp || 0) * 1000).format('YYYY-MM-DD HH:mm:ss'),
              // : new Intl.DateTimeFormat('default', {
              //     dateStyle: 'short',
              //     timeStyle: 'medium',
              //   }).format(new Date((data.genesis_timestamp || 0) * 1000)),
            },
            wasTransferred
              ? {
                  title: 'LAST TRANSFER DATE(UTC)',
                  render: (data) =>
                    data.timestamp === 'unconfirmed'
                      ? 'unconfirmed'
                      : dayjs.utc((data.genesis_timestamp || 0) * 1000).format('YYYY-MM-DD HH:mm:ss'),
                  // : new Intl.DateTimeFormat('default', {
                  //     dateStyle: 'short',
                  //     timeStyle: 'medium',
                  //   }).format(new Date((data.timestamp || 0) * 1000)),
                }
              : null,
            {
              title: 'INSCRIPTION HEIGHT',
              render: (data) =>
                data.genesis_block_height === 'unconfirmed' ? (
                  'unconfirmed'
                ) : (
                  <Link href={`/block/${data.genesis_block_height}`} className="underline">
                    {data.genesis_block_height}
                  </Link>
                ),
            },
            // { title: 'INSCRIPTION FEE', render: (data) => data.genesis_fee },
            {
              title: 'OUTPUT',
              render: (data) => {
                return (
                  <div className="flex items-center gap-x-1 overflow-x-hidden">
                    <span className="flex-1 truncate underline text-[#4f4f4f]">{data.output}</span>
                    <Copy copyText={data.output} />
                  </div>
                )
              },
            },
            { title: 'OFFSET', render: (data) => data.offset },
            {
              title: 'CONTENT',
              render: (data) => (
                <Link className="underline text-[#9f9f9f]" href={`${data.content_uri}`} target="_blank">
                  LINK
                </Link>
              ),
            },
            { title: 'CONTENT LENGTH', render: (data) => data.content_length },
            data.content_type?.includes('text')
              ? { title: 'RAW DATA', render: (data) => <RwaData id={data.id} data={data} /> }
              : null,
          ]
            .filter(Boolean)
            .map((item) => (
              <div key={item?.title} className="flex items-start">
                <div className="w-[220px] min-w-[220px] text-[#9f9f9f]">{item?.title}</div>
                <div className="text-[#4f4f4f] text-sm flex overflow-x-hidden">{item?.render(data)}</div>
              </div>
            ))}
        </div>
      </div>
      <div className="mt-[7.5rem]">
        <ParseRecure id={data.id} />
        {_data.statusCode !== 404 && (
          <>
            <h2 className="text-3xl font-bold text-[#333]">Transfer History</h2>
            <div className="w-full mt-[1.5rem] mb-[7rem]">
              <TransferHistory
                loading={transferHistoryLoadingMore || transferHistoryLoading}
                data={(transferHistory?.list || []) as TransferHistoryItem[]}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default InscriptionDetails
