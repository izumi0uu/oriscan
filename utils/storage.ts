import { ENV } from '@/utils/env'

const isServer = ENV.isServer

export interface StorageData {
  currentORDAddress: string
  connected: boolean
  isLanCN: boolean
}

type KEY = keyof StorageData

function getItem<K extends keyof StorageData, R = StorageData[K]>(key: K): R | undefined {
  if (isServer || !window.localStorage.getItem(key)) return undefined
  return JSON.parse(window.localStorage.getItem(key) as string) as R
}

function setItem<K extends keyof StorageData, V = StorageData[K]>(key: KEY, value: V) {
  if (!isServer) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

function remove(key: KEY) {
  if (!isServer) {
    window.localStorage.removeItem(key)
  }
}

function clear() {
  if (!isServer) {
    window.localStorage.clear()
  }
}

export const storage = {
  getItem,
  setItem,
  remove,
  clear,
}
