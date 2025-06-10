'use client'
import { FC } from 'react'
import Dropdown, { MenuItemText, MenuItemWrapper } from '@/components/dropdown'

const Trade: FC<{ data: any }> = ({ data }) => {
  return (
    <>
      {data?.trade_urls && !!data?.trade_urls.length && (
        <Dropdown
          contentStyle={{ width: '100%' }}
          menu={data?.trade_urls.map((item: any, index: number) => {
            return {
              key: index,
              label: (
                <MenuItemWrapper
                  onClick={() => {
                    window.open(`${item.url}`, '_blank')
                  }}
                >
                  <MenuItemText style={{ marginLeft: 5 }}>{item.name}</MenuItemText>
                </MenuItemWrapper>
              ),
            }
          })}
        >
          <div className="border w-[90px] h-[30px] flex items-center justify-center text-[#656565]  rounded-[13px]">
            Trade
          </div>
        </Dropdown>
      )}
    </>
  )
}
export default Trade
