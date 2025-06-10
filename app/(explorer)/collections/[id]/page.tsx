'use client'

import Footer from '@/components/Footer'
import Header from '@/components/CommonHeader/CommonHeader'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Tabs from './tabs'
import { useTitle } from 'ahooks'
import Head from 'next/head'
import Trade from '@/components/ranking/trade'
import ORImg from '@/components/ORImg'
import { commify } from 'ethers/lib/utils'
import { ENV } from '@/utils/env'
import { Images } from '@/utils/images'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const overviewDataType = [
  { text: 'Price', key: 'price' },
  { text: 'Total Volume', key: 'total_volume' },
  { text: 'Holders', key: 'holders' },
  { text: 'Total Transfers', key: 'total_transactions' },
  { text: 'Max Total Supply', key: 'total_supply' },
]

const Page = (props: { params: { id: string } }) => {
  const symbol = props.params.id

  const [echartXData, setEchartXData] = useState([])
  const [echartHolders, setEchartHolders] = useState([])
  const [echartPrices, setEchartPrices] = useState([])
  const [echartTransactions, setEchartTransactions] = useState([])

  const [data, setData] = useState<any>()

  useTitle(`${symbol || ''}  | Ordinalscan`)
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`${ENV.backend}/collections/${symbol}`)
      const _data = await res.json()
      const data = {
        title: _data?.data?.name,
        image_uri: _data?.data?.image_uri,
        total_transactions: _data?.data?.stats?.total_transactions,
        total_supply: _data?.data?.stats?.total_supply,
        holders: _data?.data?.stats?.owner,
        twitter_link: _data?.data?.twitter_link,
        discord_link: _data?.data?.discord_link,
        website_link: _data?.data?.website_link,
        trade_urls: _data?.data?.trade_urls,
        name: _data?.data?.name,
        total_volume: _data?.data?.stats?.total_volume,
        price: _data?.data?.price,
      }
      setData(data)
    }
    fetcher().then()
    const echartFetcher = async () => {
      const res = await fetch(`${ENV.backend}/collections/${symbol}/chart-range-stats?days=30`)
      const chartData = await res.json()
      setEchartXData(chartData.data.category)
      setEchartHolders(chartData.data.holders)
      setEchartPrices(chartData.data.prices.map((i: any) => Number(i)))
      setEchartTransactions(chartData.data.transactions)
    }
    echartFetcher().then()
  }, [symbol])

  // const getEchartOption = () => {
  //   const holderColor = '#e6194B' // 'rgb(67, 160, 42)';
  //   const priceColor = 'rgb(242, 175, 12)'
  //   const transactionsColor = '#4363d8' // 'rgb(64, 134, 199)';
  //   return {
  //     grid: {
  //       left: 10,
  //       right: 10,
  //       bottom: 10,
  //       top: 50,
  //       containLabel: true,
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //       axisPointer: {
  //         type: 'cross',
  //         crossStyle: {
  //           color: '#999',
  //         },
  //       },
  //     },
  //     toolbox: {
  //       show: false,
  //     },
  //     legend: {
  //       icon: 'circle',
  //       data: [
  //         {
  //           name: 'Holder',
  //           itemStyle: {
  //             color: holderColor,
  //           },
  //         },
  //         {
  //           name: 'Price',
  //           itemStyle: {
  //             color: priceColor,
  //           },
  //         },
  //         {
  //           name: 'Transactions',
  //           itemStyle: {
  //             color: transactionsColor,
  //           },
  //         },
  //       ],
  //       right: '20',
  //     },
  //     xAxis: [
  //       {
  //         type: 'category',
  //         data: echartXData,
  //         axisPointer: {
  //           type: 'shadow',
  //         },
  //         axisLabel: {
  //           rotate: 45,
  //           interval: 2,
  //           showMinLabel: true,
  //           showMaxLabel: true,
  //         },
  //       },
  //     ],
  //     yAxis: [
  //       {
  //         type: 'value',
  //         name: '',
  //         position: 'left',
  //         min: 0,
  //         axisLabel: {
  //           formatter: (value: number) => {
  //             return value / 1000 + 'k'
  //           },
  //           color: holderColor,
  //         },
  //       },
  //       {
  //         type: 'value',
  //         name: '',
  //         position: 'right',
  //         min: 0,
  //         axisLabel: {
  //           formatter: (value: number) => {
  //             return value
  //           },
  //           color: priceColor,
  //         },
  //       },
  //       {
  //         type: 'value',
  //         name: '',
  //         position: 'right',
  //         offset: 60,
  //         min: 0,
  //         axisLabel: {
  //           formatter: (value: number) => {
  //             return value / 1000 + 'k'
  //           },
  //           color: transactionsColor,
  //         },
  //       },
  //     ],
  //     series: [
  //       {
  //         name: 'Holder',
  //         type: 'line',
  //         yAxisIndex: 0,
  //         color: holderColor,
  //         tooltip: {
  //           valueFormatter: function (value: number) {
  //             return value as number
  //           },
  //         },
  //         data: echartHolders,
  //       },
  //       {
  //         name: 'Price',
  //         type: 'line',
  //         yAxisIndex: 1,
  //         color: priceColor,
  //         tooltip: {
  //           valueFormatter: function (value: number) {
  //             return value as number
  //           },
  //         },
  //         itemStyle: {
  //           normal: {
  //             barBorderRadius: [6, 6, 0, 0],
  //           },
  //         },
  //         data: echartPrices,
  //       },
  //       {
  //         name: 'Transactions',
  //         type: 'line',
  //         yAxisIndex: 2,
  //         color: transactionsColor,
  //         tooltip: {
  //           valueFormatter: function (value: number) {
  //             return value as number
  //           },
  //         },
  //         data: echartTransactions,
  //       },
  //     ],
  //   }
  // }

  const HighChartOption: Highcharts.Options = {
    title: {
      text: '',
    },
    credits: { enabled: false },
    tooltip: {
      shared: true,
      followPointer: true,
      followTouchMove: true,
      style: {
        color: '#999',
        fontSize: '16',
        width: 600,
      },
      useHTML: true,
      formatter: function () {
        return `<small style="color:#676767;font-size:14px;">${this?.key}</small><br/><div>
<span><span><span style="display:inline-block;width:10px;height:10px;background-color:${this?.points?.[0]?.series
          .color};border-radius:50%;margin-top:3px;"/></span><span style="display:inline-block;margin-left:6px;width:90px;padding-top:5px;padding-bottom:5px;color:#676767;">${this
          ?.points?.[0].series.name}</span></span>
<div style="display:inline-block;text-align:right;width:65px;font-size:14px;color:#4f4f4f;">${this?.points?.[0]?.y?.toString()}</div>
        </div>
        <div>
<span><span><span style="display:inline-block;width:10px;height:10px;background-color:${this?.points?.[1].series
          .color};border-radius:50%;margin-top:3px;"/></span><span style="display:inline-block;margin-left:6px;width:90px;padding-top:5px;padding-bottom:5px;color:#676767;">${this
          ?.points?.[1].series.name}</span></span>
<div style="display:inline-block;text-align:right;width:65px;font-size:14px;color:#4f4f4f;">${this?.points?.[1].y?.toString()}</div>
        </div>
        <div>
<span><span><span style="display:inline-block;width:10px;height:10px;background-color:${this?.points?.[2].series
          .color};border-radius:50%;margin-top:3px;"/></span><span style="display:inline-block;margin-left:6px;width:90px;padding-top:5px;padding-bottom:5px;color:#676767;">${this
          ?.points?.[2].series.name}</span></span>
<div style="display:inline-block;text-align:right;width:65px;font-size:14px;color:#4f4f4f;">${this?.points?.[2].y?.toString()}</div>
        </div>`
      },
    },
    xAxis: {
      labels: {
        enabled: true,
        style: {
          color: '#9F9F9F',
        },
      },
      categories: echartXData,
      tickInterval: 2,
      crosshair: true,
    },
    yAxis: [
      {
        type: 'linear',
        crosshair: true,
        min: 0,
        labels: {
          formatter: ({ value }) => {
            return Number(value) / 1000 + 'k'
          },
          style: {
            color: '#e6194B',
          },
        },
        title: {
          text: '',
        },
      },
      {
        opposite: true,
        title: {
          text: '',
        },
        labels: {
          formatter: ({ value }) => {
            return Number(value).toFixed(3)
          },
          style: {
            color: 'rgb(242, 175, 12)',
          },
        },
      },
      {
        opposite: true,
        labels: {
          formatter: ({ value }) => {
            return Number(value) / 1000 + 'k'
          },
          style: {
            color: '#4363d8',
          },
        },
        title: {
          text: '',
        },
      },
    ],
    legend: {
      layout: 'horizontal',
      align: 'right',
      verticalAlign: 'top',
      y: 30,
    },
    series: [
      {
        type: 'line',
        name: 'Holder',
        yAxis: 0,
        color: '#e6194B',
        data: echartHolders,
        // tooltip: {
        //   format: function (value: number) {
        //     return value
        //   },
        // },
      },
      {
        type: 'line',
        name: 'Price',
        yAxis: 1,
        color: 'rgb(242, 175, 12)',
        data: echartPrices,
        // tooltip: {
        //   format: function (value: number) {
        //     return value as number
        //   },
        // },
      },
      {
        type: 'line',
        name: 'Transactions',
        yAxis: 2,
        color: '#4363d8',
        data: echartTransactions,
        // tooltip: {
        //   format: function (value: number) {
        //     return value as number
        //   },
        // },
      },
    ],
  }

  return (
    <div>
      <Head>
        <title>{`${data?.name}  | Ordinalscan`}</title>
      </Head>
      <Header />
      <div className="w-[90%] sm:w-[80%] mx-auto" style={{ minHeight: 'calc(100vh - 364px)' }}>
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
            <div className="flex justify-end gap-x-[20px] items-center">
              {data?.twitter_link && (
                <Link href={data?.twitter_link || ''} target="_blank">
                  <ORImg src={Images.COMMON.TWITTER_SVG} alt="" width={19} />
                </Link>
              )}
              {data?.discord_link && (
                <Link href={data?.discord_link || ''} target="_blank">
                  <ORImg src={Images.HOME.DISCORD_SVG} alt="" width={19} />
                </Link>
              )}
              {data?.website_link && (
                <Link href={data?.website_link || ''} target="_blank">
                  <ORImg src={Images.HOME.WEBSITE_SVG} alt="" width={19} />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div
          className="grid gap-
        x-[15px] gap-y-[10px] grid-cols-1 sm:grid-cols-3"
        >
          <div className="bg-[#fff] rounded-[7px] p-[34px] mt-5">
            <div className="grid gap-x-[15px] gap-y-[28px] w-[100%] sm:w-min-[500px] pl-[15px]">
              {overviewDataType.map((item, index) => {
                return (
                  <div key={item.key}>
                    <div className={`rounded-md  text-[#9F9F9F]`}>
                      <div className="text-sm relative flex justify-between items-center">
                        <span className="block w-[65%] sm:w-[30%]">{item.text}</span>
                        <span className="block mt-[5px] text-[18px] text-[#202020]">
                          {item.key === 'price' ? (
                            <div className="flex items-center justify-between gap-2">
                              <div
                                className="w-[17px] h-[17px] rounded-full overflow-hidden bg-cover"
                                style={{
                                  backgroundImage: `url(${Images.HOME.BTC_LOGO_SVG})`,
                                  backgroundPosition: 'right',
                                }}
                              />
                              <div>{commify(data?.[item.key] || 0)}</div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              {item.key === 'total_volume' && (
                                <div
                                  className="w-[17px] h-[17px] rounded-full bg-cover"
                                  style={{ backgroundImage: `url(${Images.HOME.BTC_LOGO_SVG})` }}
                                />
                              )}
                              <div>{commify(data?.[item.key] || 0)}</div>
                            </div>
                          )}
                        </span>
                      </div>
                    </div>
                    {(index + 1) % 2 === 0 ? <hr className="border-0 border-b mt-[28px] p-0" /> : null}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="bg-[#fff] rounded-[7px] pt-[10px] pl-[10px] pr-[10px] mt-5 sm:col-span-2">
            <div className="grid gap-x-[15px] gap-y-[28px] w-[100%]  sm:w-min-[500px]">
              {/* <div className="justify-between text-gray-500 absolute ml-4 z-50 hidden">
                <span
                  className={
                    echartDayParam === '1'
                      ? 'px-2 py-1 rounded-md bg-yellow-500 text-gray-800 cursor-pointer'
                      : 'px-2 py-1'
                  }
                  onClick={() => setEchartDayParam('1')}
                >
                  24h
                </span>
                <span
                  className={
                    echartDayParam === '7'
                      ? 'px-2 py-1 rounded-md bg-yellow-500 text-gray-800 cursor-pointer'
                      : 'px-2 py-1'
                  }
                  onClick={() => setEchartDayParam('7')}
                >
                  7d
                </span>
                <span
                  className={
                    echartDayParam === '30'
                      ? 'px-2 py-1 rounded-md bg-yellow-500 text-gray-800 cursor-pointer'
                      : 'px-2 py-1'
                  }
                  onClick={() => setEchartDayParam('30')}
                >
                  30d
                </span>
                <span
                  className={
                    echartDayParam === 'all'
                      ? 'px-2 py-1 rounded-md bg-yellow-500 text-gray-800 cursor-pointer'
                      : 'px-2 py-1'
                  }
                  onClick={() => setEchartDayParam('all')}
                >
                  All
                </span>
              </div> */}
              {/* <ReactECharts option={getEchartOption()} style={{ height: '350px', width: '100%' }} /> */}
              <HighchartsReact
                highcharts={Highcharts}
                options={HighChartOption}
                style={{ height: '350px', width: '100%' }}
              />
            </div>
          </div>
        </div>

        <Tabs id={symbol} />
      </div>
      <Footer />
    </div>
  )
}

export default Page
