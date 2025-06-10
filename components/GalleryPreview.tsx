// @ts-nocheck
import useSWR from 'swr'

import { API_URL } from '../utils/constants'
import { fetcher } from '../utils/helpers'
import { lastInscriptionDataAtom } from '../utils/store'

import { InscriptionResponse, ListResponse } from '../utils/types'
import Table, { TableColumn } from '@/components/table/Table'
import dayjs from 'dayjs'

const columns: TableColumn<InscriptionResponse>[] = [
  {
    name: 'Inscritions',
    sortable: false,
    key: 'address',
    render: (data) => <span>Inscritions#{data?.number}</span>,
  },
  {
    name: 'Transfer',
    sortable: false,
    key: 'timestamp',
    render: (data) => <span>{data?.timestamp}</span>,
  },
  {
    name: 'Time',
    sortable: false,
    key: 'timestamp',
    render: (data) => <span>{dayjs(data?.timestamp).format('YYYY.MM.DD HH:mm:ss')}</span>,
  },
]
const GalleryPreview = () => {
  const { data, error } = useSWR<ListResponse<InscriptionResponse>>(`${API_URL}/inscriptions`, fetcher)

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>

  const previews = data ? data.results : Array(12).fill(null) // skeleton values

  return (
    <>
      <div>
        <div>
          {previews && (
            <Table
              data={previews.slice(0, 6)}
              columns={columns}
              tableHeaderStyle={{ padding: '0 30px' }}
              tableBodyStyle={{ padding: '0 30px' }}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default GalleryPreview
