import { InscriptionResponse } from '@/utils/types'
import Iframe from './Iframe'
import InscriptionRenderImage from './InscriptionRenderImage'
import InscriptionRenderJsonOrdinalScan, { WithContentJson } from './InscriptionRenderJsonOrdinalScan'
import InscriptionRenderTextOrdinalScan from './InscriptionRenderTextOrdinalScan'
import { usePathname } from 'next/navigation'

const InscriptionRender = (props: { inscription: any; className?: string; contentUri?: string }) => {
  const pathname = usePathname()
  if (props.inscription.content_type?.startsWith('image/')) {
    return <InscriptionRenderImage {...props} contentUri={props.contentUri} />
  }

  if (props.inscription.content_type?.startsWith('application/json')) {
    return WithContentJson(props, InscriptionRenderJsonOrdinalScan)
  }

  if (props.inscription.content_type?.startsWith('text/')) {
    // also handles json parseable content from plain text
    return (
      <div className={`${pathname?.includes('inscription') ? 'p-0 sm:p-[20px]' : ''}`}>
        <InscriptionRenderTextOrdinalScan {...props} />
      </div>
    )
  }

  return <Iframe {...props} src={props.contentUri || `/preview/${props.inscription.id}`} />
}

export default InscriptionRender
