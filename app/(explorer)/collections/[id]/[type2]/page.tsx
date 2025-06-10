'use client'

import Footer from '@/components/Footer'
import Header from '@/components/CommonHeader/CommonHeader'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { ListDetail } from './list'
import Dropdown, { MenuItemText, MenuItemWrapper } from '@/components/dropdown'
import { useTitle } from 'ahooks'
import Head from 'next/head'
import { ENV } from '@/utils/env'
import { Images } from '@/utils/images'

interface Ranking {
  twitter_link?: string
  discord_link?: string
  website_link?: string
  image_uri: string
  name: string
  stats: {
    image_uri: string
    symbol: string
    name: string
    owner: number // owner 数量
    floor_price: number //地板价
    total_volume: number //总成交量
    '24h_volume': number // 24小时成交量
    '1h_floor_price_ratio': number // 1小时地板价变动率
    '24h_floor_price_ratio': number //24小时地板价变化率
    '7d_floor_price_ratio': number // 7天变化率
    update_time: string
    total_supply: number // 总供应量
    total_transactions?: number
    history_floor_price: {
      price: '150000'
      date: number
    }[] // 近7天地板价曲线
  }
}

const Trade: FC<{ data: any }> = ({ data }) => {
  return (
    <>
      {data?.trade_urls && !!data?.trade_urls.length && (
        <Dropdown
          contentStyle={{ width: '100%' }}
          menu={data?.trade_urls.map((item: any) => {
            return {
              key: 'Unisat',
              label: (
                <MenuItemWrapper
                  onClick={() => {
                    window.open(`${item.url}`, '_blank')
                  }}
                >
                  <MenuItemText style={{ marginLeft: 5 }}>{item.name}</MenuItemText>
                </MenuItemWrapper>
              ),
            }
          })}
        >
          <div className="border w-[100px] h-[30px] flex items-center justify-center text-[#656565] ">Trade</div>
        </Dropdown>
      )}
    </>
  )
}
type TStatsData = {
  transactions: number
  transactionsRate: string
  uaw: number
  uawRate: string
  volume: number
  volumeRate: string
}
const Page = (props: { params: { id: string; type: 'brc20' | 'ins' } }) => {
  const symbol = props.params.id
  const type = props.params.type

  const [data, setData] = useState<{
    title: any
    name: any
    image_uri: any
    total_transactions: any
    total_supply: any
    holders: any
    twitter_link: any
    discord_link: any
    website_link: any
    trade_urls: any
  }>()

  const [statsData, setStatsData] = useState<TStatsData>({} as TStatsData)
  const getStats = async () => {
    const res = await fetch(`${ENV.backend}/collections/bitapes/stats?days=1`)
    const _data = await res.json()
    setStatsData(_data.data)
  }
  useTitle(`${data?.name}  | Ordinalscan`)
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(
        type === 'brc20' ? `${ENV.backend}/brc20/${symbol}` : `${ENV.backend}/collections/${symbol}`,
      )
      const _data = await res.json()
      const data = {
        title: type === 'brc20' ? _data?.data?.tick : _data?.data?.name,
        image_uri: type === 'brc20' ? '' : _data?.data?.image_uri,
        total_transactions: type === 'brc20' ? _data?.data?.total_transactions : _data?.data?.stats?.total_transactions,
        total_supply: type === 'brc20' ? _data?.data?.max : _data?.data?.stats?.total_supply,
        holders: type === 'brc20' ? _data?.data?.holders : _data?.data?.stats?.owner,
        twitter_link: _data?.data?.twitter_link,
        discord_link: _data?.data?.discord_link,
        website_link: _data?.data?.website_link,
        trade_urls: _data?.data?.trade_urls,
        name: _data?.data?.name,
      }
      setData(data)
    }
    fetcher().then()
    getStats().then()
  }, [symbol, type])
  return (
    <div>
      <Head>
        <title>{`${data?.name}  | Ordinalscan`}</title>
      </Head>
      <Header />
      <div className="w-[80%] mx-auto" style={{ minHeight: 'calc(100vh - 364px)' }}>
        <div className="pt-[40px] flex justify-between">
          <div className="w-[60%] w-min-[500px]">
            <div className="flex justify-between items-end">
              <div className="flex items-center">
                <div
                  className="w-[45px] h-[45px] rounded-full bg-center bg-cover bg-gray-50 mr-5 sm:mr-[40px]"
                  style={{ backgroundImage: `url('${data?.image_uri || Images.COMMON.BIT_DEFAULT_PNG}')` }}
                />
                <div className="flex items-start space-x-[5px] sm:space-x-[17px]">
                  <h1 className="text-[#656565] text-xl sm:text-2xl font-bold">{data?.title}</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 mr-0 sm:mr-6 sm:flex items-center gap-x-[20px] space-y-[10px] sm:space-y-[0]">
            <div>
              <Trade data={data} />
            </div>
            {props.params.type === 'ins' && (
              <div className="flex justify-end gap-x-[20px]">
                {data?.twitter_link && (
                  <Link href={data?.twitter_link || ''} target="_blank">
                    <svg
                      className="group"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        className="group-hover:fill-black"
                        d="M9 0C4.02991 0 0 4.02991 0 9C0 13.9701 4.02991 18 9 18C13.9701 18 18 13.9701 18 9C18 4.02991 13.9701 0 9 0ZM13.3252 6.78415C13.3313 6.87857 13.3313 6.97701 13.3313 7.07344C13.3313 10.0225 11.0853 13.4196 6.98103 13.4196C5.7154 13.4196 4.54219 13.052 3.55379 12.4192C3.7346 12.4393 3.90737 12.4473 4.09219 12.4473C5.13683 12.4473 6.0971 12.0938 6.8625 11.4951C5.88214 11.475 5.05848 10.8321 4.77723 9.94821C5.12076 9.99844 5.43013 9.99844 5.78371 9.90804C4.76317 9.70112 3.99777 8.80313 3.99777 7.7183V7.69018C4.29308 7.85692 4.64062 7.95937 5.00424 7.97344C4.38348 7.5596 4.00982 6.8625 4.00982 6.11719C4.00982 5.70134 4.1183 5.32165 4.31317 4.99219C5.41205 6.34621 7.06339 7.23013 8.91362 7.32455C8.59821 5.80781 9.73125 4.58036 11.0933 4.58036C11.7362 4.58036 12.3147 4.84955 12.7225 5.28348C13.2268 5.18906 13.7089 5.00022 14.1388 4.7471C13.9721 5.26339 13.6225 5.69933 13.1585 5.97455C13.6085 5.92634 14.0424 5.80179 14.4442 5.62701C14.1408 6.07299 13.7612 6.46875 13.3252 6.78415Z"
                        fill="#9E9E9E"
                      />
                    </svg>
                  </Link>
                )}
                {data?.discord_link && (
                  <Link href={data?.discord_link || ''} target="_blank">
                    <svg
                      className="group"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        className="group-hover:fill-black"
                        d="M6.04954 9.48338C6.04954 10.1898 6.51799 10.765 7.08651 10.765C7.66408 10.765 8.12347 10.1898 8.12347 9.48334C8.13255 8.78196 7.66864 8.20172 7.08651 8.20172C6.5089 8.20172 6.04954 8.77696 6.04954 9.48338Z"
                        fill="#9E9E9E"
                      />
                      <path
                        className="group-hover:fill-black"
                        d="M9.88356 9.48338C9.88356 10.1898 10.352 10.765 10.9205 10.765C11.5027 10.765 11.9575 10.1898 11.9575 9.48334C11.9666 8.78196 11.5027 8.20172 10.9205 8.20172C10.3429 8.20172 9.88356 8.77696 9.88356 9.48338Z"
                        fill="#9E9E9E"
                      />
                      <path
                        className="group-hover:fill-black"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0ZM12.9985 4.9573C13.005 4.96022 13.0103 4.96559 13.0135 4.97244C14.3166 7.08461 14.9601 9.46722 14.7195 12.2101C14.719 12.2159 14.7174 12.2215 14.7148 12.2265C14.7122 12.2316 14.7087 12.236 14.7045 12.2394C13.8323 12.9515 12.8564 13.4943 11.8186 13.8444C11.8113 13.8468 11.8034 13.8467 11.7962 13.844C11.7889 13.8413 11.7826 13.8361 11.7781 13.8292C11.5586 13.4935 11.3618 13.1406 11.1892 12.7731C11.1868 12.7681 11.1854 12.7625 11.1851 12.7568C11.1848 12.7511 11.1857 12.7454 11.1875 12.74C11.1894 12.7347 11.1922 12.7299 11.1959 12.7258C11.1995 12.7218 11.2039 12.7187 11.2088 12.7166C11.5205 12.5874 11.8217 12.4294 12.1093 12.2444C12.1145 12.2409 12.1189 12.2361 12.122 12.2304C12.1251 12.2247 12.1269 12.2182 12.1272 12.2115C12.1276 12.2048 12.1264 12.1981 12.1238 12.1921C12.1212 12.186 12.1173 12.1807 12.1125 12.1767C12.0516 12.1267 11.9918 12.0751 11.9333 12.0218C11.9281 12.0171 11.9217 12.0142 11.9151 12.0133C11.9084 12.0124 11.9016 12.0136 11.8955 12.0168C10.0295 12.9669 7.98516 12.9669 6.09683 12.0168C6.09076 12.0138 6.08406 12.0127 6.07747 12.0137C6.07089 12.0147 6.06468 12.0177 6.05955 12.0223C6.00105 12.0753 5.94145 12.1268 5.8808 12.1767C5.87596 12.1808 5.8721 12.1861 5.86957 12.1922C5.86703 12.1982 5.86589 12.2049 5.86625 12.2116C5.86661 12.2183 5.86845 12.2248 5.87162 12.2305C5.87479 12.2362 5.87919 12.241 5.88443 12.2444C6.17266 12.4279 6.47363 12.586 6.78451 12.7171C6.78935 12.7191 6.79376 12.7222 6.79745 12.7261C6.80114 12.7301 6.80403 12.7349 6.80592 12.7402C6.80781 12.7455 6.80866 12.7511 6.80841 12.7568C6.80817 12.7625 6.80684 12.7681 6.80451 12.7731C6.63471 13.1426 6.43757 13.496 6.21508 13.8298C6.2105 13.8365 6.20416 13.8415 6.19692 13.8441C6.18968 13.8467 6.18189 13.8468 6.1746 13.8444C5.13869 13.4932 4.16443 12.9504 3.29341 12.2394C3.28922 12.2358 3.28574 12.2313 3.28316 12.2262C3.28058 12.2211 3.27896 12.2154 3.27839 12.2096C3.07737 9.83708 3.48715 7.43479 4.98301 4.97194C4.98667 4.96542 4.99207 4.96031 4.99848 4.95732C5.74648 4.57857 6.536 4.30871 7.34715 4.15452C7.35451 4.15324 7.36204 4.15444 7.36878 4.15795C7.37551 4.16146 7.38113 4.16712 7.3849 4.17421C7.57779 4.5504 7.98075 4.78071 8.40231 4.74899C8.80151 4.71894 9.20211 4.71899 9.6013 4.74913C10.0216 4.78087 10.4237 4.55124 10.6122 4.17421C10.6158 4.16697 10.6214 4.16117 10.6282 4.15763C10.6349 4.1541 10.6425 4.15301 10.6499 4.15452C11.461 4.30903 12.2504 4.57888 12.9985 4.9573Z"
                        fill="#9E9E9E"
                      />
                    </svg>
                  </Link>
                )}
                {data?.website_link && (
                  <Link href={data?.website_link || ''} target="_blank">
                    <svg
                      className="group"
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="18"
                      viewBox="0 0 19 18"
                      fill="none"
                    >
                      <path
                        className="group-hover:fill-black"
                        d="M13.642 10.8C13.718 10.206 13.775 9.612 13.775 9C13.775 8.388 13.718 7.794 13.642 7.2H16.853C17.005 7.776 17.1 8.379 17.1 9C17.1 9.621 17.005 10.224 16.853 10.8M11.9605 15.804C12.5305 14.805 12.9675 13.725 13.2715 12.6H16.074C15.1536 14.1014 13.6934 15.2388 11.9605 15.804ZM11.723 10.8H7.277C7.182 10.206 7.125 9.612 7.125 9C7.125 8.388 7.182 7.785 7.277 7.2H11.723C11.8085 7.785 11.875 8.388 11.875 9C11.875 9.612 11.8085 10.206 11.723 10.8ZM9.5 16.164C8.7115 15.084 8.075 13.887 7.6855 12.6H11.3145C10.925 13.887 10.2885 15.084 9.5 16.164ZM5.7 5.4H2.926C3.83691 3.89449 5.29606 2.75534 7.03 2.196C6.46 3.195 6.0325 4.275 5.7 5.4ZM2.926 12.6H5.7C6.0325 13.725 6.46 14.805 7.03 15.804C5.29969 15.2385 3.8426 14.1009 2.926 12.6ZM2.147 10.8C1.995 10.224 1.9 9.621 1.9 9C1.9 8.379 1.995 7.776 2.147 7.2H5.358C5.282 7.794 5.225 8.388 5.225 9C5.225 9.612 5.282 10.206 5.358 10.8M9.5 1.827C10.2885 2.907 10.925 4.113 11.3145 5.4H7.6855C8.075 4.113 8.7115 2.907 9.5 1.827ZM16.074 5.4H13.2715C12.9742 4.28531 12.5339 3.20931 11.9605 2.196C13.7085 2.763 15.162 3.906 16.074 5.4ZM9.5 0C4.2465 0 0 4.05 0 9C0 11.3869 1.00089 13.6761 2.78249 15.364C4.56408 17.0518 6.98044 18 9.5 18C10.7476 18 11.9829 17.7672 13.1355 17.3149C14.2881 16.8626 15.3354 16.1997 16.2175 15.364C17.0997 14.5282 17.7994 13.5361 18.2769 12.4442C18.7543 11.3522 19 10.1819 19 9C19 6.61305 17.9991 4.32387 16.2175 2.63604C14.4359 0.948211 12.0196 0 9.5 0Z"
                        fill="#9E9E9E"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-x-[15px] gap-y-[10px] grid-cols-2 sm:grid-cols-6 mt-5 w-[100%]  sm:w-min-[500px] bg-[#fff] rounded-[5px] p-[34px]">
          {['Max Total Supply', 'Holders', 'Total Transfers'].map((text, index) => (
            <div
              key={text}
              className={`rounded-md  text-[#9F9F9F] flex flex-col sm:items-center ${
                index === 2 && data?.total_transactions === undefined && 'opacity-0'
              }`}
            >
              <div className="text-sm relative whitespace-nowrap">
                <span className="block">{text}</span>
                <span
                  title={index === 0 ? data?.total_supply : index === 1 ? data?.holders : data?.total_transactions}
                  className="font-bold block mt-[5px] whitespace-nowrap text-xl truncate text-[#202020]"
                >
                  {index === 0 ? data?.total_supply : index === 1 ? data?.holders : data?.total_transactions}
                </span>
              </div>
            </div>
          ))}
          {['uaw', 'transactions', 'volume'].map((item, index) => {
            return (
              <div key={item} className={`rounded-md  text-[#9F9F9F] flex flex-col sm:items-center`}>
                <div className="text-sm relative whitespace-nowrap">
                  <span className="block capitalize">{item}</span>
                  <span className="font-bold block mt-[5px] whitespace-nowrap text-xl truncate text-[#202020]">
                    {
                      // @ts-ignore
                      statsData[item]
                    }
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <ListDetail type={type} id={symbol} />
      </div>
      <Footer />
    </div>
  )
}

export default Page
