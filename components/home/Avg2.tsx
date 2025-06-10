import { FC, useEffect, useState } from 'react'
import { API_URL, CDN } from '@/utils/constants'
import Image from 'next/image'

const Avg2: FC<{ inscription_id: string; content_type: string; json_protocol: string }> = ({
  inscription_id,
  content_type,
  json_protocol,
}) => {
  const [type, setType] = useState('')
  const getType = async () => {
    if (json_protocol === 'brc-20') {
      setType('BRC-20')
    } else {
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
    if (content_type === 'image/svg+xml') {
      return (
        <iframe
          src={`${CDN}/content/${inscription_id}`}
          className="w-full h-full pointer-events-none border-none aspect-square"
          loading="lazy"
          sandbox="allow-scripts"
          scrolling="no"
        />
      )
    } else {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          src={`${CDN}/content/${inscription_id}`}
          style={{ imageRendering: 'pixelated' }}
          width="100%"
          height="100%"
        />
      )
    }
  }
  return <div className="text-[12px] flex items-center justify-center w-[40px] h-[40px]">{type}</div>
}
export default Avg2
