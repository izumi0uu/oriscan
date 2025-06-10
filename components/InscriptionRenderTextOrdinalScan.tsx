import useSWR from 'swr'

import { pipe } from 'fp-ts/lib/function'
import { match, tryCatch } from 'fp-ts/lib/Option'
import { getFontSize } from '@/utils/helpers'
import { InscriptionResponse } from '@/utils/types'
import InscriptionRenderJson from './InscriptionRenderJson'

const InscriptionRenderTextOrdinalScan = (props: { inscription: any; className?: string; contentUri?: string }) => {
  const data = props.inscription.content
  // if (!data) return <div>Loading...</div>
  return pipe(
    tryCatch(() => JSON.parse(data)),
    match(
      () => <ContentText {...props} text={data} />,
      (content) => <InscriptionRenderJson {...props} content={content} />,
    ),
  )
}

function showGradient(length: number) {
  return length > 20
}

const ContentText = (props: { inscription: InscriptionResponse; text: string; className?: string }) => {
  return (
    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-[#F2F0ED] p-3">
      <p
        className="inline-block w-full whitespace-pre-wrap break-all text-center"
        style={{ fontSize: getFontSize(props.inscription.content_length) }}
      >
        {props.text}
      </p>
      {showGradient(props.inscription.content_length) && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(rgba(242, 240, 237, 0),rgba(242, 240, 237, 0),rgba(242, 240, 237, 1))',
          }}
        />
      )}
    </div>
  )
}

export default InscriptionRenderTextOrdinalScan
