import useSWR from 'swr'

import { pipe } from 'fp-ts/lib/function'
import { match, tryCatch } from 'fp-ts/lib/Option'
import { CDN } from '@/utils/constants'
import { getFontSize, textFetcher } from '@/utils/helpers'
import { InscriptionResponse } from '@/utils/types'
import InscriptionRenderJson from './InscriptionRenderJson'

const InscriptionRenderText = (props: {
  inscription: InscriptionResponse
  className?: string
  contentUri?: string
}) => {
  const { data, error, isLoading } = useSWR<string>(
    // `${API_URL}/inscriptions/${props.inscription.id}/content`,
    props.contentUri || `${CDN}/content/${props.inscription.id}`,
    textFetcher,
  )

  if (error) return <div>Error loading inscription content. {error?.message}</div>
  if (!data || isLoading)
    return (
      <div className="relative w-full h-full">
        <div className="absolute z-10 bg-[#121518] inset-0 flex items-center justify-center">
          <div className="w-6 h-6 max-w-full max-h-full rounded-full border-2 border-primary animate-spinnerBulqg"></div>
        </div>
      </div>
    )
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
    <div className="relative flex w-full h-full items-center justify-center overflow-hidden bg-[#121518] text-white">
      <p
        className="!text-base inline-block w-full whitespace-pre-wrap break-all text-center"
        style={{ fontSize: getFontSize(props.inscription.content_length) }}
      >
        {props.text}
      </p>
      {/* {showGradient(props.inscription.content_length) && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(rgba(242, 240, 237, 0),rgba(242, 240, 237, 0),rgba(242, 240, 237, 1))',
          }}
        />
      )} */}
    </div>
  )
}

export default InscriptionRenderText
