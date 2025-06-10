'use client'

import AddressDetails from '@/components/AddressDetails'
import Footer from '@/components/Footer'
import Header from '@/components/CommonHeader/CommonHeader'
import { useTitle } from 'ahooks'

const LocationById = ({ params }: { params: { aid: string } }) => {
  useTitle(`${params.aid || 0}  | Ordinalscan`)
  return (
    <>
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto">
        <AddressDetails aid={params.aid} />
      </main>
      <Footer />
    </>
  )
}

export default LocationById
