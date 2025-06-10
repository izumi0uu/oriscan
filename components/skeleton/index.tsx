import './index.css'
import { FC } from 'react'

const SkeletonTable = () => {
  return (
    <div className="table-skeleton grid gap-y-[10px]">
      <div className="table-item  rounded" />
      <div className="table-item  rounded" />
      <div className="table-item  rounded" />
      <div className="table-item  rounded" />
      <div className="table-item  rounded" />
      <div className="table-item  rounded" />
      <div className="table-item  rounded" />
      <div className="table-item  rounded" />
    </div>
  )
}

type TSkeleton = {
  table?: boolean
}
const Skeleton: FC<TSkeleton> = ({ table }) => {
  if (table) return <SkeletonTable />
  return <></>
}
export default Skeleton
