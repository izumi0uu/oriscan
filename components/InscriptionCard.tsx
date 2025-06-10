// @ts-nocheck
import Link from 'next/link'
import { motion } from 'framer-motion'

import { cn } from '../utils/helpers'
import { InscriptionResponse } from '../utils/types'
import InscriptionRender from './InscriptionRender'
import { LoadingOutlined } from '@ant-design/icons'

const InscriptionCard = ({ inscription, light = false }: { inscription?: InscriptionResponse; light?: boolean }) => {
  if (!inscription?.id)
    return (
      <div className="border sm:p-2 md:p-3 lg:p-5 rounded-md space-y-2 md:space-y-3 lg:space-y-5">
        <div className="rounded-[4px] aspect-square" />
        <div
          className={cn(
            'opacity-0 hidden sm:inline-block text-sm rounded-[4px] px-1 md:px-2 md:py-1',
            light && 'border',
          )}
        >
          {/* placeholder */}
          #123
        </div>
      </div>
    )

  return (
    <Link
      onClick={() => {
        window.gtag('event', 'click', {
          event_category: 'click',
          event_label: 'click',
        })
      }}
      href={{ pathname: `/inscription/${inscription.id}`, hash: `${inscription.number}` }}
      className="border sm:p-2 md:p-3  space-y-2 md:space-y-3 lg:space-y-4 ease-linear duration-150 hover:-translate-y-1 hover:-translate-x-1"
    >
      <div className="w-full aspect-square overflow-hidden">
        <div className="relative h-full">
          <InscriptionRender inscription={inscription} />
          <span className={`absolute top-[3px] right-[25px] ${inscription.in_mempool ? 'block' : 'hidden'}`}>
            <LoadingOutlined style={{ color: '#eeb60f', width: 20, height: 20, fontSize: 18 }} />
          </span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={cn('inline-block text-sm  px-1 md:px-2 pb-1', 'bg-white text-[#4F4F4F]')}
      >
        #{inscription.number}
      </motion.div>
    </Link>
  )
}

export default InscriptionCard
