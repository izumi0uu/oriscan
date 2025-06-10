'use client'
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { NoOperation } from '@/utils'
import { storage } from '@/utils/storage'

const WalletContext = createContext<{
  connected: boolean
  account?: string | null
  publicKey?: string | null
  balance: {
    confirmed: number
    unconfirmed: number
    total: number
  }
  active: () => any
  signPsbt: (unsignedStr: string) => Promise<string>
  pushPsbt: (signedStr: string) => Promise<any>
  signMessage: (message: string) => Promise<string>
  deActive: () => void
}>({
  connected: false,
  account: null,
  publicKey: null,
  signPsbt: async () => '',
  pushPsbt: async () => {},
  balance: {
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  },
  active: NoOperation,
  signMessage: async () => '',
  deActive: NoOperation,
})

export default function WalletContextProvider(props: { children?: ReactNode }) {
  const [unisatInstalled, setUnisatInstalled] = useState(false)
  const [connected, setConnected] = useState(false)
  const [accounts, setAccounts] = useState<string[]>([])
  const [publicKey, setPublicKey] = useState('')
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  })
  const selfRef = useRef<{ accounts: string[] }>({
    accounts: [],
  })
  const [network, setNetwork] = useState('livenet')
  const self = selfRef.current
  const getBasicInfo = async () => {
    const unisat = (window as any).unisat
    const [address] = await unisat.getAccounts()
    setAddress(address)

    const publicKey = await unisat.getPublicKey()
    setPublicKey(publicKey)

    const balance = await unisat.getBalance()
    setBalance(balance)

    const network = await unisat.getNetwork()
    setNetwork(network)
  }
  const handleAccountsChanged = (_accounts: string[]) => {
    if (self.accounts[0] === _accounts[0]) {
      setConnected(true)
      // prevent from triggering twice
      return
    }
    self.accounts = _accounts
    if (_accounts.length > 0) {
      setAccounts(_accounts)
      setConnected(true)

      setAddress(_accounts[0])

      getBasicInfo()
    } else {
      setConnected(false)
    }
  }

  const handleNetworkChanged = (network: string) => {
    setNetwork(network)
    getBasicInfo()
  }
  useEffect(() => {
    const unisat = (window as any).unisat
    if (unisat) {
      setUnisatInstalled(true)
    } else {
      return
    }
    const isConneted = storage.getItem('connected')
    if (!isConneted) return
    unisat.getAccounts().then((accounts: string[]) => {
      handleAccountsChanged(accounts)
    })

    unisat.on('accountsChanged', handleAccountsChanged)
    unisat.on('networkChanged', handleNetworkChanged)

    return () => {
      unisat.removeListener('accountsChanged', handleAccountsChanged)
      unisat.removeListener('networkChanged', handleNetworkChanged)
    }
  }, [])
  const active = useCallback(async () => {
    const unisat = (window as any).unisat
    if (!unisat) return
    const result = await unisat.requestAccounts()
    handleAccountsChanged(result)
  }, [])
  const signPsbt = useCallback(async (unsignedPsbt: string) => {
    const unisat = (window as any).unisat
    if (!unisat) return
    const data = await unisat.signPsbt(unsignedPsbt)
    return data
  }, [])

  const pushPsbt = useCallback(async (signedPsbt: string) => {
    const unisat = (window as any).unisat
    if (!unisat) return
    const data = await unisat.pushPsbt(signedPsbt)
    return data
  }, [])

  const signMessage = useCallback(async (text: string) => {
    const unisat = (window as any).unisat
    if (!unisat) return
    const data = await unisat.signMessage(text)
    return data
  }, [])

  const deActive = useCallback(() => {
    setConnected(false)
  }, [])
  useEffect(() => {
    if (!connected) return
    if (address) {
      storage.setItem('currentORDAddress', address)
    } else {
      storage.remove('currentORDAddress')
    }
  }, [address, connected])
  useEffect(() => {
    storage.setItem('connected', connected)
  }, [connected])
  return (
    <WalletContext.Provider
      value={{
        connected,
        account: address,
        balance,
        active,
        signPsbt,
        publicKey,
        pushPsbt,
        signMessage,
        deActive,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  )
}

export function useUnisatWallet() {
  return useContext(WalletContext)
}
