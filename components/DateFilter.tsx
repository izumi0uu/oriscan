import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '../utils/helpers'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible'

const DateFilter = ({
  name,
  onApply,
  start,
  end,
  defaultOpen = false,
  className,
}: {
  name: string
  onApply: (start: string | null, end: string | null) => void
  start: string | null
  end: string | null
  defaultOpen?: boolean
  className?: string
}) => {
  const [currentStart, setCurrentStart] = useState(start)
  const [currentEnd, setCurrentEnd] = useState(end)

  const isAppliable = start !== currentStart || end !== currentEnd

  useEffect(() => {
    setCurrentStart(start)
    setCurrentEnd(end)
  }, [start, end])
  return (
    <div className={className}>
      <Collapsible defaultOpen={defaultOpen}>
        <CollapsibleTrigger className="w-full flex justify-between">
          <div className="uppercase text-neutral-300">{name}</div>
          {/* todo: better/thinner ChevronDown icon alternative */}
          <ChevronDown size={16} className="text-neutral-300" />
          {/* todo: rotate on expand */}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4 mb-6">
            <div className="flex justify-between items-center space-x-2">
              {/* todo: hidden labels for accessibility with name prefix */}
              <input
                type="date"
                value={currentStart ?? ''}
                className="w-[90px] uppercase border rounded-[4px] px-1.5 py-1"
                onClick={(e) => e.currentTarget.showPicker()} // todo: is this still accessible?
                onChange={(e) => setCurrentStart(e.target.value)}
              />
              <p className="uppercase">to</p>
              <input
                type="date"
                value={currentEnd ?? ''}
                className="w-[90px] uppercase border rounded-[4px] px-1.5 py-1"
                onClick={(e) => e.currentTarget.showPicker()} // todo: is this still accessible?
                onChange={(e) => setCurrentEnd(e.target.value)}
              />
            </div>
            <button
              className={cn(
                'mt-4 block w-full px-4 py-2 border text-neutral-600 rounded-[4px] uppercase bg-[#F5BD07] ease-linear duration-150 hover:-translate-y-[2px] hover:-translate-x-[2px]',
                isAppliable && 'text-red-600',
              )}
              onClick={() => onApply(currentStart, currentEnd)}
            >
              {/* todo: apply button color state, hover, etc. */}
              Apply
            </button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default DateFilter
