import React from 'react'
import useSWR from 'swr'

import { fetcher } from '@/utils/helpers'

function useRolling(src: string, config?: { limit: number; sort: string }) {
  const total = React.useRef(0)
  const limit = config?.limit || 10

  const [page, setPage] = React.useState(1)
  const [datas, setDatas] = React.useState([])
  const { data, isLoading } = useSWR(`${src}?limit=${limit}&page=${page}&sort=${config?.sort || 'desc'}`, fetcher, {
    revalidateOnFocus: false,
  })

  React.useEffect(() => {
    if (data) {
      setDatas((prev) => prev.concat(data.data.items))
      total.current = data.data.total || 0
    }
  }, [data])

  const getMore = () => {
    setPage((prev) => {
      if ((total.current / limit) >> 0 <= prev) return prev
      else return prev + 1
    })
  }

  return [datas, isLoading, getMore]
}

export { useRolling }
export default useRolling
