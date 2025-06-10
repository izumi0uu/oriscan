import { API_URL } from '@/utils/constants'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { StringDecoder } from 'string_decoder'
import styled from 'styled-components'
import Avg from '@/components/home/Avg2'
import { Skeleton } from 'antd'

// 提取上面str字符串中href的部分
const parseStr = (str: string) => {
  const hrefRegex = /href=["'](.*?)["']/g
  let matches
  const hrefValues = []
  while ((matches = hrefRegex.exec(str)) !== null) {
    if (matches[1].includes('content')) {
      hrefValues.push(matches[1].split('/content/')[1])
      continue
    }
  }
  return Array.from(new Set(hrefValues))
}

const ParseRecure: FC<{ id: StringDecoder }> = ({ id }) => {
  const [list, setList] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const getContent = async () => {
    const res = await fetch(`https://cdn.ordinalscan.net/content/${id}`)
    const text = await res.text()
    getList(text)
  }

  const getDetail = async (id: string) => {
    const res = await fetch(`${API_URL}/inscriptions/${id}`)
    return await res.json()
  }
  const getList = async (str: string) => {
    setIsLoading(true)
    const idList = parseStr(str)
    const res = idList.map((item) => {
      return getDetail(item)
    })
    const list = await Promise.all(res)
    setList(list)
    setIsLoading(false)
  }
  useEffect(() => {
    getContent()
  }, [])
  if (isLoading) return <Skeleton active />
  return (
    <>
      {list.length > 0 ? (
        <div className="mb-[2.62rem]">
          <div className="text-3xl  font-bold text-[#333]">Recursive Submodules</div>
          <ListWrapper>
            {list.map((item: any, index: number) => {
              return (
                <div
                  className="flex items-center justify-between bg-[#F0F0F0] py-[15px] pl-[19px] pr-[21px]"
                  key={index}
                  onClick={() => {
                    // router
                  }}
                >
                  <div>
                    <div className="text-[#4f4f4f] text-lg">Inscription</div>
                    <div className="flex items-center justify-between">
                      <div className="w-[5px] h-[5px] rounded bg-[#D9D9D9] mr-[5px]"></div>
                      <Link href={`/inscription/${item?.id}`} className="text-[#3498DB] cursor-pointer text-[14px]">
                        {`${item?.id.slice(0, 6)}...${item?.id.slice(item?.id.length - 6)}`}
                      </Link>
                    </div>
                  </div>
                  <div className="w-[48px]">
                    <Avg inscription_id={item?.id} content_type={item?.content_type} json_protocol={'test'} />
                  </div>
                </div>
              )
            })}
          </ListWrapper>
        </div>
      ) : null}
    </>
  )
}
const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 267px);
  grid-gap: 1.37rem;
  margin-top: 1.25rem;
  @media screen and (max-width: 750px) {
    grid-template-columns: repeat(auto-fill, 100%);
  }
`
export default ParseRecure
