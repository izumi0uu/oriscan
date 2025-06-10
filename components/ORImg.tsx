'use client'

import { FC } from 'react'

const ORImg: FC<{ src: string; alt?: string; width?: number }> = ({ src, alt, width }) => {
  return <img src={src} alt={alt} width={width} />
}
export default ORImg
