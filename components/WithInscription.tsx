'use client'

import useSWR from 'swr'
import { API_URL } from '../utils/constants'
import { fetcher } from '../utils/helpers'
import { InscriptionResponse } from '../utils/types'
import Loading from './Loading'

// todo: improve type to ensure that the component has the correct props
const WithInscription = (iid: string, Content: React.ComponentType<any>) => {
  const { data, error, isLoading } = useSWR<InscriptionResponse>(`${API_URL}/inscriptions/${iid}`, fetcher)

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>
  if (!data) return <Loading />

  return <Content inscription={data} />
}

export default WithInscription
