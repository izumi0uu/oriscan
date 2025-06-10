import { InscriptionResponse } from '@/utils/types'
import Iframe from './Iframe'
import InscriptionRenderImage from './InscriptionRenderImage'
import InscriptionRenderJson, { WithContentJson } from './InscriptionRenderJson'
import InscriptionRenderText from './InscriptionRenderText'
import hljs from 'highlight.js'
import { CDN } from '@/utils/constants'
import React from 'react'
import useSWR from 'swr'
import { textFetcher } from '@/utils/helpers'

const JsRender = ({ src }: { src: string }) => {
  const { data, error, isLoading } = useSWR<string>(src, textFetcher)

  return data ? (
    <div className="bg-[#22272e] h-full w-full overflow-auto">
      <div
        className="hljs code"
        dangerouslySetInnerHTML={{
          __html: hljs.highlight(data, { language: 'javascript' }).value,
        }}
      ></div>
    </div>
  ) : null
}

const InscriptionRender = (props: { inscription: InscriptionResponse; className?: string; contentUri?: string }) => {
  // const pathname = usePathname()

  if (props.inscription.content_type?.startsWith('image/')) {
    return <InscriptionRenderImage {...props} contentUri={props.contentUri} />
  }

  if (props.inscription.content_type?.startsWith('application/json')) {
    return WithContentJson(props, InscriptionRenderJson)
  }

  if (props.inscription.content_type?.startsWith('text/javascript')) {
    return <JsRender src={props.contentUri || `https://ordin-delta.vercel.app/content/${props.inscription.id}`} />
  }

  if (props.inscription.content_type?.startsWith('text/html')) {
    // also handles json parseable content from plain text
    return (
      <Iframe {...props} src={props.contentUri || `https://ordin-delta.vercel.app/content/${props.inscription.id}`} />
    )
  }

  if (props.inscription.content_type?.startsWith('text/')) {
    // also handles json parseable content from plain text
    return <InscriptionRenderText {...props} />
  }

  if (props.inscription.content_type?.startsWith('video/')) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-[#121518]">
        <video autoPlay loop controls className="w-full h-full">
          <source src={props.contentUri || `${CDN}/content/${props.inscription.id}`} type="audio/mpeg"></source>
        </video>
      </div>
    )
  }

  if (props.inscription.content_type?.startsWith('audio/')) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-[#121518]">
        <audio controls>
          <source src={props.contentUri || `${CDN}/content/${props.inscription.id}`} type="audio/mpeg"></source>
        </audio>
      </div>
    )
  }

  return <Iframe {...props} src={props.contentUri || `/preview/${props.inscription.id}`} />
}

export default InscriptionRender
