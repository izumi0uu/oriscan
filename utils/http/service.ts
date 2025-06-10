import { http } from './http'
import { Method } from 'axios'
import { Service } from 'ahooks/es/useRequest/src/types'
import { ServerCode } from '@/utils/http/serverCode'

export interface ResponseType<T> {
  code: number
  message: string
  data: T
}

export type HttpError = ResponseType<string>

export interface PaginationData<T> {
  page: number
  limit: number
  items: T[]
  total: number
}

export interface PaginationEventData<T> {
  page_no: number
  page_size: number
  items: T[]
  total: number
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginationEventParams {
  page_no: number
  page_size: number
}

export interface GetestParams {
  captcha_output: string
  gen_time: string
  lot_number: string
  pass_token: string
}

export interface ServiceError {
  code: ServerCode
  message: string
  data: string
}

type MethodWithBody = 'post' | 'POST' | 'put' | 'PUT'

function httpService<R, D, Q>(method: MethodWithBody, url: string) {
  return function (data: D, query?: Q) {
    return http
      .request<ResponseType<R>>({
        method,
        url,
        data,
        params: query,
      })
      .then((res) => {
        if (res.data.code === 0 || res.data.code === 200) {
          return res.data.data
        } else {
          throw new Error(res.data.message)
        }
      })
  } as Service<R, [D, Q] | [D]>
}

function httpServiceNoBody<R, Q>(method: Exclude<Method, MethodWithBody>, url: string) {
  return function (query?: Q) {
    return http
      .request<ResponseType<R>>({
        method,
        url,
        params: query,
      })
      .then((res) => {
        if (res.data.code === 0 || res.data.code === 200) {
          return res.data.data
        } else {
          throw new Error(res.data.message)
        }
      })
  } as Service<R, [Q] | []>
}

export function getHttpService<R, Q = {}>(url: string) {
  return httpServiceNoBody<R, Q>('get', url)
}

export function postHttpService<R, D, Q = {}>(url: string) {
  return httpService<R, D, Q>('post', url)
}

export function putHttpService<R, D, Q = {}>(url: string) {
  return httpService<R, D, Q>('put', url)
}
