'use client'
import styled, { css } from 'styled-components'
import { useRouter } from 'next/router'
import { useRequest } from 'ahooks'
import R from '@/utils/http/request'
import { DomainDetailService } from '@/utils/http'
import useWindowInfiniteScroll from '@/hooks/useWindowInfiniteScroll'
import { I } from '@/utils/http/infinite'
import { mobileStyle } from '@/utils/commonStyle'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { storage } from '@/utils/storage'
import Link from 'next/link'
import Image from 'next/image'

import NavigationHeader from '@/components/navigationHeader/index'
import { Images } from '@/utils/images'

const Index = () => {
  const [isShowCN, setIsShowCN] = useState(false)
  useEffect(() => {
    const chromeLanguage = navigator.language
    if (typeof storage.getItem('isLanCN') === 'boolean') {
      setIsShowCN(storage.getItem('isLanCN') as boolean)
    } else {
      if (chromeLanguage === 'zh-CN') {
        setIsShowCN(true)
        storage.setItem('isLanCN', true)
      } else {
        setIsShowCN(false)
        storage.setItem('isLanCN', false)
      }
    }
  }, [])
  const [checkedCategory, setCheckedCategory] = useState<Index.TagItem>()
  const { data, loading, loadingMore, noMore } = useWindowInfiniteScroll(
    I(DomainDetailService.getV2List, {
      limit: 50,
      tag: checkedCategory?.id,
    }),
    {
      manual: true,
      threshold: 300,
      // target: () => document.body,
      reloadDeps: [checkedCategory],
      debounceWait: 300,
      isNoMore: (data1) => {
        //@ts-ignore
        return data1?.page * data1?.limit > data1?.total
      },
    },
  )
  const { data: tagsData } = useRequest(R(DomainDetailService.getV2TagList, {}), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res) => {
      if (res?.length) {
        setCheckedCategory(res[0])
      }
    },
  })
  const handleSearchByCategory = (category: Index.TagItem) => {
    if (checkedCategory?.id === category.id) {
      setCheckedCategory(undefined)
    } else {
      setCheckedCategory(category)
    }
  }
  const list = data?.list || []
  return (
    <MainWrapper>
      <Head>
        <meta property="og:site_name" content="ordinalscan" />
        <title>Ordinals Explorer | Ordinalscan</title>
        <meta
          name="description"
          content="Ordinals explorer, inscriptions, BRC20, tap, collection and domains on Bitcoin."
        />
        <meta property="og:title" content="Ordinals Explorer | Ordinalscan" />
        <meta
          property="og:description"
          content="Ordinals explorer, inscriptions, BRC20, tap, collection and domains on Bitcoin."
        />
        <meta property="og:url" content="https://nav.ordinalscan.net/navigation" />
      </Head>
      <header className="block w-full">
        <div className="w-full">
          <div
            style={{}}
            className="flex items-center justify-between py-8 min-[915px]:px-20 px-1 bg-[#f5f5f5]  fixed top-0 left-0 w-full"
          >
            <div className="flex justify-between w-full gap-1">
              <Link href="/" className="min-w-[201px]">
                <Image src={Images.COMMON.ICON3_SVG} alt="icon" width={201} height={28} />
              </Link>
              <div className="flex gap-x-[8px] flex-1 justify-end">
                <a
                  className="submit"
                  href={
                    'https://docs.google.com/forms/d/e/1FAIpQLScv8hwRGKhXRuKyJ0432BpqQ2IrTaHh-6-ch3hB_dm0xcGvAA/viewform?usp=sf_link'
                  }
                  target="_blank"
                >
                  Submit
                </a>
                <div
                  className="switch-lan"
                  onClick={() => {
                    setIsShowCN(!isShowCN)
                    storage.setItem('isLanCN', !isShowCN)
                  }}
                >
                  {isShowCN ? 'EN' : '中文'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <IndexWrapper>
        {/* <div className="switch-lan-wrapper"></div> */}
        <div className="main-title">Explorers</div>
        <div className="main-des">
          <div className="main-des-1">
            Discover the best Apps at{' '}
            <a href="https://ordinalscan.net/" target="_blank">
              Ordinalscan
            </a>
            .
          </div>
        </div>
        <div className="main-des">
          <div className="main-des-1">
            {isShowCN ? '数据更新于' : 'Data updated at'} <span style={{ color: '#f7d56a' }}>2023-11-29 10:00</span>
          </div>
        </div>
        <div className="category-list">
          {tagsData?.map((item, index) => {
            return (
              <div
                className={`category-item ${checkedCategory?.id === item.id && 'active'}`}
                key={index}
                onClick={() => {
                  handleSearchByCategory(item)
                }}
              >
                {isShowCN ? item.name_zh : item.name}
              </div>
            )
          })}
        </div>
        <div className="list">
          {list.map((item, index) => {
            return (
              <div
                key={index}
                className="list-item-wrapper"
                onClick={() => {
                  window.open(item.gpt_store_link, '_blank')
                  // router.push(`/detail?id=${item.id}`).then();
                }}
              >
                <div className="avatar-wrapper">
                  <img src={item.icon} alt="" width="80px" />
                </div>
                <div className="introduce-wrapper">
                  <div className="title">{item.name}</div>
                  <div className="des-wrapper">
                    <div className="des">{isShowCN ? item.content_zh : item.content}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {!loading && !loadingMore && noMore && <div className="no-more-data">No More Data</div>}
        {(loading || loadingMore) && (
          <div className="absolute z-10 inset-0 flex items-center justify-center">
            <div className="w-6 h-6 max-w-full max-h-full rounded-full border-2 border-primary animate-spinnerBulqg"></div>
          </div>
        )}
      </IndexWrapper>
    </MainWrapper>
  )
}
const MainWrapper = styled.div`
  .submit {
    /* color: #f7d56a; */
    border-radius: 3px;
    font-size: 14px;
    font-weight: 900;
    cursor: pointer;
    height: 32px;
    padding: 0px 12px;
    background: #f7d56a;
    line-height: 32px;
  }
  .switch-lan {
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 32px;
    background: #f3f4f6;
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid #d1d1d1;
    cursor: pointer;
    margin-right: 2px;
  }
`
const IndexWrapper = styled.div`
  padding-top: 110px;
  width: 88%;
  margin: 0 auto;
  ${mobileStyle(css`
    padding-top: 100px;
  `)}
  .category-list {
    //display: flex;
    //column-gap: 10px;
    //row-gap: 6px;
    overflow: hidden;
    padding-top: 30px;
    .category-item {
      padding: 8px 20px;
      font-size: 15px;
      border: 1px solid #d1d1d1;
      border-radius: 5px;
      cursor: pointer;
      transition: all linear 0.12s;
      float: left;
      margin-right: 10px;
      margin-bottom: 6px;
      &.active {
        background: #f7d56a;
        border: 1px solid #f7d56a;
      }
      &:hover {
        background: #f7d56a;
        border: 1px solid #f7d56a;
      }
    }
  }
  .no-more-data {
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
    color: #686868;
    padding-bottom: 20px;
  }
  .loading {
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
    color: #686868;
    padding-bottom: 50px;
  }
  .switch-lan-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  .main-title {
    color: #242424;
    font-size: 20px;
    font-weight: 500;
    margin-top: 0px;
  }
  .main-des {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .main-des-1 {
      color: #686868;
      font-size: 16px;
      margin-top: 12px;
      width: 70%;
    }
  }
  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 32.8%);
    //grid-gap: 12px;
    grid-row-gap: 12px;
    margin-top: 20px;
    justify-content: space-between;
    padding-bottom: 50px;
    ${mobileStyle(css`
      grid-template-columns: repeat(auto-fill, 100%);
    `)}
    .list-item-wrapper {
      background: #ffffff;
      padding: 25px;
      border-radius: 10px;
      display: flex;
      column-gap: 14px;
      justify-content: space-between;
      cursor: pointer;
      .introduce-wrapper {
        flex: 1;
        .title {
          font-size: 18px;
          font-weight: bolder;
        }
        .des-wrapper {
          margin-top: 14px;
          display: flex;
          column-gap: 18px;
          justify-content: space-between;
          .des {
            line-height: 20px;
            color: #686868;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            flex: 1;
          }
        }
      }
      .avatar-wrapper {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
      }
    }
  }
`
export default Index
