export interface PaginationData<T> {
  page: number
  limit: number
  items: T[]
  total: number
}

export interface PaginationParams {
  page: number
  limit: number
}
