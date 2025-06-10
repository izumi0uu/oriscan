import { JsonView, defaultStyles, darkStyles } from 'react-json-view-lite'
import useSWR from 'swr'
import './inscriptionRenderJson.css'

import { useToggle } from 'ahooks'
import { CDN } from '@/utils/constants'
import { cn, fetcher } from '@/utils/helpers'
import { InscriptionResponse } from '@/utils/types'

import './json-viewer.css'
import React from 'react'

export const WithContentJson = (
  props: { inscription: InscriptionResponse; contentUri?: string }, // todo: is this a good pattern?
  Content: React.ComponentType<any>,
) => {
  const { data, error, isLoading } = useSWR<InscriptionResponse>(
    // `${API_URL}/inscriptions/${props.inscription.id}/content`,
    props.contentUri || `${CDN}/content/${props.inscription.id}`,
    fetcher,
  )

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>
  if (!data) return <></>

  return <Content {...props} content={data} />
}

const InscriptionRenderJson = (props: { inscription: InscriptionResponse; content: any; className?: string }) => {
  // todo: wrap in try function for non-json fallback render
  const string = JSON.stringify(props.content, null, 1)
    ?.replace(/^[\{\}]/gm, '')
    ?.replace(/[\{\}]*,*$/gm, '')
    ?.replace(/\n\s*\n/gm, '\n')
    // ?.replace(/(?<!\\)"/g, '') // remove all unescaped double quotes
    // ?.replace(/(?<!\\)\\/g, '') // remove all unescaped escape characters
    ?.replace(/\n\s/g, '\n') // replace escaped newlines with newlines
    ?.trim()
  let badge = props.content?.p ?? props.content?.protocol?.name ?? props.content?.protocol
  badge = badge?.replace(/\-/g, '')
  // todo: add tooltip for badge showing protocol name and info, links to protocol page?
  return <JsonViewer {...props} text={string} content={props.content} protocol={badge} />
}

const JsonViewer = (props: { text: string; content: object; protocol?: string; className?: string }) => {
  const [isJsonViewEnabled, { toggle }] = useToggle()

  return (
    <div className={cn('relative aspect-square w-full bg-[#121518] text-[#fff] p-[10px]', props.className)}>
      {isJsonViewEnabled ? (
        <div
          className="h-full w-full overflow-auto text-[#fff] pb-7 pt-1 text-base leading-[1.15rem] tracking-tight font-[Menlo]"
          onClick={(e) => e.preventDefault()} // prevent click through (e.g. when used in links)
        >
          <div className="json-view">
            <JsonView data={props.content} style={defaultStyles} />
          </div>
        </div>
      ) : (
        <>
          <pre className="h-full w-full overflow-auto p-0.5 pl-2 text-base leading-[1.15rem] tracking-tight">
            {props.text}
          </pre>
          <div
            className="pointer-events-none absolute inset-0"
            // style={{
            //   background: 'linear-gradient(rgba(242, 240, 237, 0),rgba(242, 240, 237, 0),rgba(242, 240, 237, 1))',
            // }}
          />
        </>
      )}
      <div className="absolute bottom-1 flex space-x-0.5 text-xs uppercase text-neutral-0">
        {props.protocol && (
          <div className="rounded border border-neutral-400 bg-neutral-400 px-1 py-0.5 leading-none shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]">
            {props.protocol}
          </div>
        )}
        <button
          className={cn(
            'rounded border border-neutral-400 px-1 py-0.5 leading-none shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] transition-colors',
            isJsonViewEnabled
              ? 'border-slate-500 bg-slate-300 text-slate-700  hover:bg-slate-200'
              : 'bg-neutral-400 hover:border-neutral-300 hover:bg-neutral-300',
          )}
          onClick={(e) => {
            toggle()
            e.preventDefault()
          }}
        >
          <div className="text-[13px] leading-[12px]">
            <span className="mr-0.5">{'{'}</span>
            <span className="">{'}'}</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default InscriptionRenderJson
