import { PaginationData, PaginationParams } from './service'

import { Service } from 'ahooks/es/useRequest/src/types'
import { Service as PService } from 'ahooks/es/usePagination/types'

interface PaginationServiceData<T> {
  list: T[]
  total: number
}

interface PaginationServiceParams {
  current: number
  pageSize: number
}

export function P<T, P extends PaginationParams>(
  service: Service<PaginationData<T>, [P]>,
  params1: Omit<P, keyof PaginationParams>,
): PService<PaginationServiceData<T>, [PaginationServiceParams]> {
  return async function (params) {
    const serviceParams = {
      limit: params.pageSize,
      page: params.current,
      ...params1,
    } as P
    const data = await service(serviceParams)
    return {
      list: data.items || [],
      total: data.total,
    }
  }
}
