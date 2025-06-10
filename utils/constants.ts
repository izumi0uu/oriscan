export const TILE_SIZE = 16
console.log('process.env.NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL)
export const API_URL =
  // process.env.NEXT_PUBLIC_API_URL ?? "https://api.hiro.so/ordinals/v1";
  process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hiro.so/ordinals/v1'
export const HOME_API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://ordinalscan.net/api'
export const CDN = process.env.NEXT_PUBLIC_API_URL ?? 'https://cdn.ordinalscan.net'
export const HOME_API_URL_TEST = 'https://tests.ordinalscan.net/api'
