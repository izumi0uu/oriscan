import { PeriodResponse } from '../pages/api/period/[pid]'
import Blocks from './Blocks'

const BlocksWrapper = ({ data }: { data: PeriodResponse }) => {
  return (
    <div className="my-4">
      <Blocks blocks={data} />
    </div>
  )
}

export default BlocksWrapper
