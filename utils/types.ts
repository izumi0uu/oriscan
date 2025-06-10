export type SatResponse = {
  coinbase_height: number
  cycle: number
  decimal: string
  degree: string
  inscription_id?: string
  epoch: number
  name: string
  offset: number
  percentile: string
  period: number
  rarity: string
}

export type InscriptionResponse = {
  id: string
  number: number
  address: string
  genesis_address: string
  genesis_block_height: number
  genesis_block_hash: string
  genesis_tx_id: string
  genesis_fee: string
  genesis_timestamp: number
  tx_id: string
  location: string
  output: string
  offset: string
  sat_ordinal: string
  sat_rarity: string
  sat_coinbase_height: number
  mime_type: string
  content_type: string
  content_length: number
  timestamp: number
  in_mempool: boolean
  mempool_tx_id: string
}

export type ListResponse<T> = {
  limit: number
  offset: number
  total: number
  results: T[]
}
export type InscriptionTransferResponse = {
  block_height: number
  block_hash: string
  address: string
  tx_id: string
  location: string
  output: string
  value: string
  offset: string
  timestamp: number
}
export type BaseResponse<T> = {
  code: number
  data: T
  message: string
}
export type ActivityListItem = {
  block_height: number
  block_time: number
  content_length: number
  content_type: string
  from_address: string
  inscription_id: string
  is_mint: boolean
  number: number
  to_address: string
  tx_id: string
  type: string
  volume: number
  inscription_number: number
  amount: number
}

export type TransferHistoryItem = {
  inscription_id: string
  tx_id: string
  content_type: string
  content_length: number
  number: number
  to_address: string
  from_address: string
  block_height: number
  block_time: number
  content_uri: string
  json_content: string
  json_protocol: string
  type: string
  in_mempool: boolean
}

export type OrdinalScanPageResponse<T> = {
  items: T[]
  limit: number
  page: number
  total: number
}

export type InscriptionResponseOrdinalScan = {
  id: string
  number: number
  address: string
  genesis_address: string
  genesis_block_height: number
  genesis_block_hash: string
  genesis_tx_id: string
  genesis_fee: string
  genesis_timestamp: number
  tx_id: string
  location: string
  output: string
  offset: number
  sat_ordinal: string
  sat_rarity: string
  sat_coinbase_height: number
  mime_type: string
  content_type: string
  content_length: number
  timestamp: number
  in_mempool: boolean
  mempool_tx_id: string
}
