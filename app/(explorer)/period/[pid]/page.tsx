'use client'

import useSWR from 'swr'

import BlocksWrapper from '../../../../components/BlocksWrapper'
import Footer from '../../../../components/Footer'
import Header from '../../../../components/CommonHeader/CommonHeader'
import Loading from '../../../../components/Loading'
import { fetcher } from '../../../../utils/helpers'
import { PeriodResponse } from '../../../../pages/api/period/[pid]'

const PeriodById = ({ params }: { params: { pid: string } }) => {
  const { data, error, isLoading } = useSWR<PeriodResponse>(`/api/period/${params.pid}`, fetcher)

  if (error) return 'Something went wrong ʕ•̠͡•ʔ'
  if (!data || isLoading) return <Loading className="min-h-screen" />

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen w-full max-w-[1280px] mx-auto">
        <h2 className="text-2xl font-bold">
          <div className="text-center">Halving Period {params.pid}</div>
        </h2>
        <BlocksWrapper data={data} />
      </main>
      <Footer />
    </>
  )
}

export default PeriodById
