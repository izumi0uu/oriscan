import { FC } from 'react'

const FilterTag: FC<{ onClose: () => void; text: string }> = ({ onClose, text }) => {
  return (
    <div className="bg-[#F5BD07] px-[10px] py-[4px] uppercase relative">
      {text}
      <div
        className="absolute right-[-7px] top-[-7px] text-xs bg-[#949494] rounded-2xl text-[#ffffff] w-[14px] h-[14px] flex justify-center items-center cursor-pointer"
        onClick={() => {
          onClose && onClose()
        }}
      >
        ×
      </div>
    </div>
  )
}
export default FilterTag
