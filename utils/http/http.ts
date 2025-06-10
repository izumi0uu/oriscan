import axios from 'axios'
import { ENV } from '@/utils/env'

export const http = axios.create({
  timeout: 30000,
  baseURL: ENV.backend,
})

http.interceptors.request.use((config) => {
  // if (ENV.isOnDeployedServer) {
  //   if (/^\/api\//.test(config.url || '')) {
  //     config.baseURL = 'http://api'
  //   }
  //   if (/^\/backend\//.test(config.url || '')) {
  //     config.baseURL = 'http://backend'
  //   }
  // }
  // let token = getToken()
  // if (token) {
  //   //@ts-ignore
  //   config.headers['Authorization'] = `Bearer ${token}`
  // }
  return config
})

http.interceptors.response.use(
  (response) => {
    if (response.data.code !== 0) {
      return Promise.reject(response.data)
    }
    return response
  },
  (error) => {
    if (error?.response?.data?.code === 401) {
    }
    return Promise.reject(error)
  },
)
