'use client'

import Footer from '@/components/Footer'
import Header from '@/components/CommonHeader/CommonHeader'
import { useEffect, useState } from 'react'
import Tabs from './tabs'
import { useTitle } from 'ahooks'
import Head from 'next/head'
import Trade from '@/components/ranking/trade'
import { commify } from 'ethers/lib/utils'
import { enFormatUnicode } from '@/utils'
// import ReactECharts from 'echarts-for-react'
import { Switch } from 'antd'
import zeroEllipsis from '@/components/ZeroEllipsis'
import { ENV } from '@/utils/env'
import { Images } from '@/utils/images'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const overviewDataType = [
  { text: 'Supply', key: 'total_supply' },
  { text: 'Minted', key: 'minted' },
]
const marketDataType = [
  { text: 'Price', key: 'market_avg_price_usd' },
  { text: 'Full Market Cap', key: 'fully_diluted_valuation' },
]
const otherDataType = [
  { text: 'Holders', key: 'holders' },
  { text: 'Total Transfers', key: 'total_transactions' },
]
const Page = (props: { params: { id: string } }) => {
  const symbol = props.params.id

  const [echartDayParam, setEchartDayParam] = useState('30')
  const [echartXData, setEchartXData] = useState([])
  const [echartPriceUsd, setEchartPriceUsd] = useState([])
  const [echartPriceSat, setEchartPriceSat] = useState([])
  const [xAxisInterval, setXAxisInterval] = useState(23)
  const switchOpenStyle = { backgroundColor: '#F7D56A' }
  const switchCloseStyle = { backgroundColor: '#d1d1d1' }
  const [echartLegendSelected, setEchartLegendSelected] = useState({ 'Price(satx)': false, 'Price(USD)': true })

  const [switchStyle, setSwitchStyle] = useState(switchOpenStyle)
  const [priceUnit, setPriceUnit] = useState('usd')

  const onPriceUnitSwitchChange = (checked: boolean) => {
    if (checked) {
      setSwitchStyle(switchOpenStyle)
      setPriceUnit('usd')
      setEchartLegendSelected({ 'Price(satx)': false, 'Price(USD)': true })
    } else {
      setSwitchStyle(switchCloseStyle)
      setPriceUnit('sat')
      setEchartLegendSelected({ 'Price(satx)': true, 'Price(USD)': false })
    }
  }

  const [data, setData] = useState<any>()
  useTitle(`${symbol || ''}  | Ordinalscan`)
  useEffect(() => {
    if (echartDayParam === '7') {
      setXAxisInterval(12)
    } else if (echartDayParam === '30') {
      setXAxisInterval(23 * 2)
    } else {
      setXAxisInterval(23 * 7)
    }
    const fetcher = async () => {
      const res = await fetch(`${ENV.backend}/brc20/${symbol}`)
      const _data = await res.json()
      const data = {
        title: _data?.data?.tick,
        icon: _data?.data?.icon,
        total_transactions: _data?.data?.total_transactions,
        total_supply: _data?.data?.supply,
        holders: _data?.data?.holders,
        twitter_link: _data?.data?.twitter_link,
        discord_link: _data?.data?.discord_link,
        website_link: _data?.data?.website_link,
        trade_urls: _data?.data?.trade_urls,
        name: _data?.data?.name,
        minted: _data?.data?.total_minted,
        fully_diluted_valuation: _data?.data?.fully_diluted_valuation,
        market_price: _data?.data?.market_price,
        market_avg_price_usd: _data?.data?.market_avg_price_usd,
        market_avg_price_sat: _data?.data?.market_avg_price_sat,
      }
      setData(data)
    }
    fetcher().then()

    const echartFetcher = async () => {
      const res = await fetch(`${ENV.backend}/brc20/${symbol}/price-hour-stat?days=` + echartDayParam)
      const chartData = await res.json()
      setEchartXData(chartData.data.category)
      setEchartPriceSat(chartData.data.priceSat.map((i: string) => Number(i)))
      setEchartPriceUsd(chartData.data.priceUsd.map((i: string) => Number(i)))
    }
    echartFetcher().then()
  }, [symbol, echartDayParam])
  const priceColor = '#90EE90'
  const priceUsdColor = '#F2B10C'

  const HighChartOption: Highcharts.Options = {
    chart: {
      marginTop: 50,
    },
    title: {
      text: priceUnit === 'usd' ? 'Price(USD)' : 'Price(sats)',
      align: 'left',
      style: {
        color: priceUnit === 'usd' ? priceUsdColor : priceColor,
        fontSize: '14px',
      },
    },
    credits: { enabled: false },
    legend: { enabled: false },
    tooltip: {
      style: {
        color: '#999',
        fontSize: '16',
      },
      useHTML: true,
      formatter: function () {
        return `
        <small style="color:#676767;font-size:14px;">${this?.key}</small><br/><div>
        <span><span><span style="display:inline-block;width:10px;height:10px;background-color:${this?.series
          ?.color};border-radius:50%;margin-top:3px;"/></span><span style="display:inline-block;margin-left:6px;width:90px;padding-top:5px;padding-bottom:5px;color:#676767;">${this
          ?.series?.name}</span></span>
        <div style="display:inline-block;text-align:right;font-size:14px;color:#4f4f4f;font-weight:800;">${this?.y?.toString()}</div>
                </div>`
      },
      followPointer: true,
      followTouchMove: true,
    },
    xAxis: {
      type: 'category',
      crosshair: true,
      labels: {
        enabled: true,
        style: {
          color: '#9F9F9F',
        },
        formatter: ({ value }) => {
          return String(value).split(' ')[0]
        },
        rotation: -45,
      },
      categories: echartXData,
      tickInterval: xAxisInterval,
      showFirstLabel: true,
      showLastLabel: true,
    },
    yAxis: [
      {
        type: 'linear',
        crosshair: true,
        min: 0,
        title: {
          text: '',
        },
      },
    ],
    series: [
      priceUnit === 'usd'
        ? {
            name: 'Price(USD)',
            type: 'line',
            color: priceUsdColor,
            data: echartPriceUsd,
          }
        : {
            name: 'Price(sats)',
            type: 'line',
            color: priceColor,
            data: echartPriceSat,
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
                  style={{ backgroundImage: `url('${data?.icon || Images.COMMON.BIT_DEFAULT_PNG}')` }}
                />
                <div className="flex items-start space-x-[5px] sm:space-x-[17px]">
                  <h1 className="text-[#4f4f4f] text-xl sm:text-2xl font-bold">{enFormatUnicode(data?.title)}</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 mr-0 sm:flex items-center gap-x-[20px] space-y-[10px] sm:space-y-[0]">
            <div>
              <Trade data={data} />
            </div>
            <div className="mt-[10px]">
              <span className="text-xs text-gray-900 dark:text-gray-300 mr-2">USD Denominated</span>
              <Switch defaultChecked onChange={onPriceUnitSwitchChange} style={switchStyle} />
            </div>
          </div>
        </div>
        <div className="grid gap-x-[15px] gap-y-[10px] grid-cols-1 sm:grid-cols-3">
          <div className="bg-[#fff] rounded-[7px] p-[34px] mt-5">
            <div className="grid gap-x-[15px] gap-y-[28px]  w-[100%]  sm:w-min-[500px] pl-[15px] ">
              {overviewDataType.map((item) => {
                return (
                  <div key={item.key} className={`rounded-md text-[#9F9F9F]`}>
                    <div className="text-sm relative whitespace-nowrap flex justify-between">
                      <span className="block w-[65%] sm:w-[30%]">{item.text}</span>
                      <span className="block mt-[5px] whitespace-nowrap text-[18px] truncate text-[#202020]">
                        {
                          // @ts-ignore
                          commify(data?.[item.key] || 0)
                        }
                      </span>
                    </div>
                  </div>
                )
              })}
              <hr className="border-0 border-b m-0 p-0" />
              {marketDataType.map((item) => {
                return (
                  <div key={item.key} className={`rounded-md text-[#9F9F9F] mt-[5px]`}>
                    <div className="text-sm relative whitespace-nowrap flex justify-between">
                      <span className="block w-[65%] sm:w-[55%]">{item.text}</span>
                      <span className="block whitespace-nowrap text-[18px] text-[#202020]">
                        {item.text === 'Price' ? (priceUnit === 'usd' ? '$  ' : '') : '$  '}
                        {item.text === 'Price'
                          ? priceUnit === 'usd'
                            ? zeroEllipsis(data?.market_avg_price_usd || 0)
                            : commify(data?.market_avg_price_sat || 0)
                          : commify(data?.[item.key] || 0)}
                      </span>
                    </div>
                  </div>
                )
              })}
              <hr className="border-0 border-b m-0 p-0" />
              {otherDataType.map((item) => {
                return (
                  <div key={item.key} className={`rounded-md  text-[#9F9F9F] `}>
                    <div className="text-sm relative whitespace-nowrap flex justify-between">
                      <span className="block w-[65%] sm:w-[45%]">{item.text}</span>
                      <span className="block mt-[5px] whitespace-nowrap text-[18px] truncate text-[#202020]">
                        {commify(data?.[item.key] || 0)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="bg-[#fff] rounded-[7px] pt-[10px] pl-[10px] pr-[10px] mt-5 sm:col-span-2">
            <div className="grid gap-x-[15px] gap-y-[28px] w-[100%]  sm:w-min-[500px] relative">
              <div className="flex justify-end absolute right-2 z-50 text-gray-500 cursor-pointer">
                <div
                  className={echartDayParam === '7' ? 'px-2 py-1 rounded-md bg-[#F7D56A] text-gray-800' : 'px-2 py-1'}
                  onClick={() => setEchartDayParam('7')}
                >
                  7d
                </div>
                <div
                  className={echartDayParam === '30' ? 'px-2 py-1 rounded-md bg-[#F7D56A] text-gray-800' : 'px-2 py-1'}
                  onClick={() => setEchartDayParam('30')}
                >
                  30d
                </div>
                <div
                  className={echartDayParam === 'all' ? 'px-2 py-1 rounded-md bg-[#F7D56A] text-gray-800' : 'px-2 py-1'}
                  onClick={() => setEchartDayParam('all')}
                >
                  All
                </div>
              </div>
              {/* <ReactECharts option={getPriceEchartOption()} style={{ height: '400px', width: '100%' }} /> */}
              <div className=" mt-9">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={HighChartOption}
                  style={{ height: '400px', width: '100%' }}
                />
              </div>
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
