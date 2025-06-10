export type TStatistic = {
  blocks: number
  fee: number
  inscriptions: number
  storedData: number
  totalInscriptionFee: number
  walletAddress: number
}

export type TLiveMintingItem = {
  block_height: number
  block_time: number
  content: string
  content_length: number
  content_type: string
  from_address: string
  genesis_id: string
  number: number
  to_address: string
  total: number
  tx_id: string
  inscription_id: string
  json_protocol: string
}
export type TTransicationItem = {
  block_height: number
  block_time: number
  content: string
  content_length: number
  content_type: string
  from_address: string
  genesis_id: string
  number: number
  to_address: string
  total: number
  tx_id: string
  inscription_id: string
  json_protocol: string
}
