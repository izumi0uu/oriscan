import { Service } from 'ahooks/es/useRequest/src/types'
import { PaginationData, PaginationParams } from './service'
import { Data, Service as IService } from 'ahooks/es/useInfiniteScroll/types'

interface InfiniteData<T> extends Data {
  list: T[]
  total: number
}

export function I<T, P extends PaginationParams>(
  service: Service<PaginationData<T>, [P]>,
  params1: Omit<P, 'page'>,
): IService<P & InfiniteData<T>> {
  // @ts-ignore
  return async function (params: P & InfiniteData<T>) {
    const page = params ? Math.floor(params.list.length / params.limit) + 1 : 1
    const serviceParams = { ...params1, ...params, list: undefined, page, total: undefined, items: undefined }
    const data = await service(serviceParams)
    return {
      ...data,
      items: data.items,
      list: data.items || [],
      limit: data.limit,
      total: data.total,
    }
  } as IService<P & InfiniteData<T>>
}

export const isNoMore = <T extends InfiniteData<any>>(data?: T) => (data ? data.list.length >= data.total : false)
