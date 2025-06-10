'use client'
import Footer from '@/components/Footer'
import Header from '@/components/CommonHeader/CommonHeader'
import InscriptionCard from '@/components/InscriptionCard'
import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { mobileStyle } from '@/utils/commonStyle'
import { useSearchParams } from 'next/navigation'

type TUrlParams = {
  search: string
}

const SearchResults = (props: { params: { search: string } }) => {
  const search = props.params.search
  let searchAPI = `https://ordinalscan.net/api/inscription/search?keyword=${search}&limit=50`

  const queryParams = useSearchParams()
  const tp = queryParams?.get('tp')
  if (tp === 'txnhash') {
    // searchAPI = `${HOME_API_URL}/api/txnhash/search?keyword=${search}&limit=50`
  }

  const [list, setList] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState<TUrlParams>({} as TUrlParams)
  const getList = async (search: string) => {
    if (search) {
      setLoading(true)
      const res = await fetch(searchAPI)
      if (res.status !== 200) return null
      const result = await res.json()
      setList(result.data)
      setLoading(false)
    }
  }
  useEffect(() => {
    if (search) {
      setSearchParams({ search: decodeURIComponent(search) })
      getList(search)
    }
  }, [search])
  return (
    <>
      <Header />
      <main className="py-8 w-[85%] sm:w-[80%] flex-grow max-w-[1200px] mx-auto">
        <div className="">
          Searched for <span className="font-bold">{`"${searchParams.search || ''}"`}</span>, found{' '}
          {list?.length || '0'} results
        </div>
        <ListWrapper>
          {list?.map((i: any, index: number) => <InscriptionCard key={i?.id ?? index} inscription={i} light />)}
        </ListWrapper>
        <div className="mt-[18px]">
          {loading && (
            <div className="absolute z-10 inset-0 flex items-center justify-center">
              <div className="w-6 h-6 max-w-full max-h-full rounded-full border-2 border-primary animate-spinnerBulqg"></div>
            </div>
          )}
          {!loading && <div className="text-[12px] text-[gray] text-center">No More Data</div>}
        </div>
      </main>
      <Footer />
    </>
  )
}
const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 182px);
  grid-gap: 10px;
  justify-content: space-between;
  margin-top: 20px;
  ${mobileStyle(css`
    grid-template-columns: repeat(auto-fill, 48%);
  `)}
`
export default SearchResults
