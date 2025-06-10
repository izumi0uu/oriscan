'use client'
import React, { ImgHTMLAttributes } from 'react'

const XImage = React.forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>((props, ref) => {
  const [load, setLoad] = React.useState(true)

  const Imgref = React.useRef<HTMLImageElement>(null)

  const onLoad = () => {
    setLoad(false)
  }

  React.useImperativeHandle(ref, () => Imgref.current!)

  React.useEffect(() => {
    if (Imgref.current && Imgref.current.complete) setLoad(false)
  }, [])

  const LoadELement = React.useMemo(() => {
    if (load) {
      return (
        <div className="absolute z-10 bg-[#121518] inset-0 flex items-center justify-center">
          <div className="w-6 h-6 max-w-full max-h-full rounded-full border-2 border-primary animate-spinnerBulqg"></div>
        </div>
      )
    }
    return null
  }, [load])

  return (
    <div className="relative overflow-hidden w-full h-full">
      {LoadELement}
      <img alt={props.alt} {...props} ref={Imgref} onLoad={onLoad} />
    </div>
  )
})

export default XImage
export { XImage }
