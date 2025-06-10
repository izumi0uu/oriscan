'use client'
import styled from 'styled-components'
import useCopyClipboard from '@/hooks/useCopy'
import { CSSProperties, FC } from 'react'
import { Images } from '@/utils/images'

const Copy: FC<{ copyText: string; style?: CSSProperties }> = ({ copyText, style }) => {
  const [isCopied, staticCopy] = useCopyClipboard(800)
  return (
    <CopyWrapper className="mx-2" style={{ position: 'relative', width: '37px' }}>
      {!isCopied ? (
        <img
          className="copy-img"
          src={Images.COMMON.COPY_SVG}
          onClick={(e) => {
            e.stopPropagation()
            staticCopy(copyText)
          }}
          style={style}
          alt=""
        />
      ) : (
        <CopiedTip>Copied</CopiedTip>
      )}
    </CopyWrapper>
  )
}
const CopyWrapper = styled.span`
  width: 14px;
  height: 14px;
  position: relative;
  .copy-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
`
// const CopyIcon = styled(img)`
//   max-width: 12px;
//   max-height: 12px;
//   cursor: pointer;
// `
const CopiedTip = styled.span`
  color: #9f9f9f;
  font-size: 12px;
  position: absolute;
  left: 0;
  top: 0;
`

export default Copy
