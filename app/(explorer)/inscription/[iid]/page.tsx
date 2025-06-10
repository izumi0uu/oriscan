import Footer from '@/components/Footer'
import Header from '@/components/CommonHeader/CommonHeader'
import InscriptionDetails from '@/components/InscriptionDetails'
import { InscriptionResponse } from '@/utils/types'
import { Metadata } from 'next'
import { ENV } from '@/utils/env'

export async function generateMetadata({ params }: { params: { iid: string } }): Promise<Metadata | undefined> {
  if (!params.iid) return

  const inscription = await getInscription(params.iid)

  if (!inscription.content_type) return

  if (!inscription.content_type.toLowerCase().startsWith('image')) return

  if (inscription.content_type.toLowerCase().includes('image/webp')) return

  return {
    openGraph: {
      // todo: add inscription number, override title, etc.
      images: [
        {
          url: `/api/og/inscriptions?id=${params.iid}`,
          width: 1200,
          height: 600,
        },
      ],
    },
  }
}

const InscriptionById = ({ params }: { params: { iid: string } }) => {
  return (
    <>
      <Header />
      <main className="py-8 w-full max-w-[1280px] max-2xl:max-w-[1000px] flex-grow m-auto px-4">
        <InscriptionDetails iid={params.iid} />
      </main>
      <Footer />
    </>
  )
}

export default InscriptionById

async function getInscription(iid: string): Promise<InscriptionResponse> {
  const response = await fetch(`${ENV.backend}/inscriptions/${iid.toLowerCase()}`)
  return await response.json()
}
