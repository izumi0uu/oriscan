import { FC, useEffect, useState } from 'react'
import { API_URL, CDN } from '@/utils/constants'
import Image from 'next/image'

const Avg: FC<{ inscription_id: string; content_type: string }> = ({ inscription_id, content_type }) => {
  const [type, setType] = useState('')
  const getType = async () => {
    const res = await fetch(`${CDN}/content/${inscription_id}`)
    try {
      // @ts-ignore
      const data = JSON.parse(res)
      let badge = data?.p ?? data?.protocol?.name ?? data?.protocol
      badge = badge?.replace(/\-/g, '')
      if (badge === 'brc20') {
        setType('BRC-20')
      } else {
        setType('TXT')
      }
    } catch (e) {
      setType('TXT')
    }
  }
  useEffect(() => {
    if (content_type?.startsWith('application/json')) {
      setType('Binary')
    }
    if (content_type?.startsWith('video/')) {
      setType('Video')
    }
    if (content_type?.startsWith('audio/')) {
      setType('Audio')
    }
    if (content_type?.startsWith('text/')) {
      getType()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content_type])
  if (content_type?.startsWith('image/')) {
    return (
      // <iframe
      //   className="w-full aspect-square overflow-hidden"
      //   sandbox="allow-scripts"
      //   loading="lazy"
      //   src={`/preview/${inscription_id}`}
      // />

      // eslint-disable-next-line @next/next/no-img-element
      <img alt="" src={`${CDN}/content/${inscription_id}`} style={{ imageRendering: 'pixelated' }} width="100%" />
    )
  }
  return <div className="text-[12px] flex items-center justify-center w-[40px] h-[40px]">{type}</div>
}
export default Avg
