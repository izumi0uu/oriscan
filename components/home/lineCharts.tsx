import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { BaseResponse } from '@/utils/types'
import { fetcher } from '@/utils/helpers'
import { commify } from 'ethers/lib/utils'
import { ENV } from '@/utils/env'

const options: Highcharts.Options = {
  chart: {
    backgroundColor: 'rgba(0,0,0,0)',
    height: '107px',
  },
  credits: {
    enabled: false,
  },
  title: {
    text: '',
  },
  xAxis: {
    labels: {
      enabled: false,
    },
    categories: ['jul 1', 'jul 2', 'jul 3'],
    lineColor: '#9F9F9F',
  },
  yAxis: [
    {
      min: 0,
      title: {
        text: '',
      },
      labels: {
        style: {
          color: '#9F9F9F',
        },
      },
    },
    {
      title: {
        text: '',
      },
      opposite: true,
    },
  ],
  legend: {
    shadow: false,
  },

  tooltip: {
    shared: true,
    formatter: function () {
      return [`<b>${this.x}</b></br>`].concat(
        // @ts-ignore
        this.points
          ? // @ts-ignore
            this.points.map(function (point) {
              return `${commify(point?.y as number)} sat/vB</br>`
            })
          : [],
      )
    },
  },
  //   plotOptions: {},

  series: [
    {
      type: 'line',
      name: '',
      color: '#707070',
      data: [1, 2, 3],
      pointPadding: 0.3,
      pointPlacement: -0.2,
      showInLegend: false,
    },
  ],
}

const LineChart = () => {
  const { data, error, isLoading } = useSWR<BaseResponse<{ date: string; avg_fee: number }[]>>(
    `${ENV.backend}/block-fee-rates`,
    fetcher,
  )
  const [chartData, setChartData] = useState<Highcharts.Options>(options)
  useEffect(() => {
    if (data && data.data) {
      const dateList = data?.data.map((item) => item.date)
      const ValueList = data?.data.map((item) => item.avg_fee)
      setChartData({
        ...options,
        xAxis: {
          labels: {
            enabled: false,
          },
          categories: dateList,
        },
        series: [
          {
            type: 'line',
            name: '',
            color: '#707070',
            data: ValueList,
            pointPadding: 0.3,
            pointPlacement: -0.2,
            showInLegend: false,
          },
        ],
      })
    }
  }, [data])
  return (
    <div className="w-full h-[80%] text-xs scale-y-90">
      <HighchartsReact highcharts={Highcharts} options={chartData} />
    </div>
  )
}

export default LineChart
