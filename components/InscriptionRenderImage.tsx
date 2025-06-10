import { CDN } from '@/utils/constants'
import { InscriptionResponse } from '@/utils/types'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/utils/helpers'
import { ENV } from '@/utils/env'

const InscriptionRenderImage = ({
  inscription,
  contentUri,
}: {
  inscription: InscriptionResponse
  contentUri?: string
}) => {
  const [htmlRes, setHtmlRes] = useState(false)
  useEffect(() => {
    const src = contentUri || `${CDN}/content/${inscription.id}`
    if (src) {
      fetch(src).then((res) => {
        try {
          res.text().then((data) => {
            if (isHTML(data) && res.headers.get('content-type')?.includes?.('ml')) {
              setHtmlRes(true)
            }
          })
        } catch (e) {}
      })
    }
  }, [contentUri, inscription.id])
  const { data: projectData } = useSWR<{
    data: {
      id: number
      name: string
      symbol: string
    } | null
  }>(`${ENV.backend}/inscription/collection/${inscription.id}`, fetcher)
  // todo: background image with hidden semantic element better?
  // <Iframe {...props} src={`/preview/${props.inscription.id}`} />
  // if (inscription.content_type === 'image/svg+xml;charset=utf-8' || htmlRes) {
  //   return <Iframe src={contentUri || `${CDN}/content/${inscription.id}`} />
  // }
  return (
    <div className="w-full h-full flex justify-center items-center bg-[#F2F0ED]">
      <img
        alt={`${projectData?.data?.name || 'Inscription'} #${inscription.number}`}
        src={contentUri || `${CDN}/content/${inscription.id}`}
        style={{ imageRendering: 'pixelated' }}
        width="100%"
        height="100%"
      />
    </div>
  )
}

export default InscriptionRenderImage

function isHTML(input: string) {
  return /<[a-z]+\d?(\s+[\w-]+=("[^"]*"|'[^']*'))*\s*\/?>|&#?\w+;/i.test(input)
}
