import Thumbnail from '@/components/Thumbnail'
import { getEllipsisStr } from '@/utils'
import { Images } from '@/utils/images'

enum GoToTypes {
  Inscription = 'inscription',
  Block = 'block',
  Sat = 'sat',
  Address = 'address',
  VagueInscription = 'vagueInscription',
  Project = 'Project',
  TxnHash = 'txnhash',
  InscriptionNumber = 'inscriptionNumber',
}
type Props = {
  id: string
  type: GoToTypes
  index: number
  link: string
  text: string
  secondaryText?: string
  contentType: string
  logo?: string
}
const InscriptionLink: React.FC<Props> = (props: Props) => {
  return (
    <>
      <div className="inline-block rounded border border-neutral-100 text-sm text-center leading-8 z-[1001] font-medium ml-[1rem] mr-2">
        <Thumbnail
          inscription={{
            id: props.id,
            content_type: props.contentType,
          }}
        />
      </div>
      <div className="flex items-center justify-between w-[21.5rem]">
        <div className="text-sm font-medium">
          ID {props.id.slice(0, 4)}...{props.id.slice(62)}{' '}
        </div>
        <div className="text-[#64758B] text-sm pr-3">#{props.text}</div>
      </div>
    </>
  )
}

const OwnerLink: React.FC<Props> = (props: Props) => {
  return (
    <p className="text-neutral-800 z-[1001] font-medium text-sm ml-[1rem] h-[2.5rem] flex items-center">
      # {getEllipsisStr(props.text)}
    </p>
  )
}

const ProjectLink: React.FC<Props> = (props: Props) => {
  return (
    <div className="text-neutral-800 text-sm z-[1001] font-medium ml-[1rem] h-[2.5rem] flex items-center">
      <div
        className="inline-block w-[1.25rem] h-[1.25rem] rounded-full bg-center bg-no-repeat bg-cover align-middle mr-[0.63rem]"
        style={{ backgroundImage: `url(${props.logo || Images.COMMON.PROJECT_DEFAULT_ICON_PNG})` }}
      />
      <div className="flex items-center justify-between w-[21.5rem]">
        <div>{props.text}</div>
        <div className="text-[#64758B] text-sm inline-block  pr-3">#{props.id}</div>
      </div>
    </div>
  )
}

const TxnHashLink: React.FC<Props> = (props: Props) => {
  return (
    <p className="text-neutral-800 z-[1001] font-medium text-sm ml-[1rem] h-[2.5rem] flex items-center">
      {props.text.slice(0, 6)}...{props.text.slice(props.text.length - 6)}{' '}
    </p>
  )
}

export { InscriptionLink, OwnerLink, ProjectLink, TxnHashLink }
