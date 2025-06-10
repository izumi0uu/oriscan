'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Images } from '@/utils/images'
import Image from 'next/image'
import { useDebounceFn, useFocusWithin } from 'ahooks'
import { ENV } from '@/utils/env'
import { InscriptionLink, OwnerLink, ProjectLink, TxnHashLink } from '../CommonHeader/components/ItemLink'
import useSWR from 'swr'
import { cn } from '@/utils/helpers'

enum GoToTypes {
  Inscription = 'inscription',
  Block = 'block',
  Sat = 'sat',
  Address = 'address',
  VagueInscription = 'vagueInscription',
  Project = 'Project',
  TxnHash = 'txnhash',
  InscriptionNumber = 'inscriptionNumber',
}
type SearchTypes = {
  type: GoToTypes
  search: string
}
type SearchResult = {
  id: string
  type: GoToTypes
  index: number
  link: string
  text: string
  secondaryText?: string
  contentType: string
  logo?: string
}
type GroupedResults = {
  [key in GoToTypes]: SearchResult[]
}

// the order of the regex matters we wan't to keep Inscription > Sat > Block
// it's reflected in the results `index` prop to handle arrow up/down selection
const searchRegexes: Readonly<{ type: GoToTypes; reg: RegExp }[]> = [
  {
    type: GoToTypes.Inscription,
    reg: /^[0-9a-f]{0,64}i[0-9]+$/,
  },
  {
    type: GoToTypes.Inscription,
    reg: /^[0-9a-zA-Z]{64,}i[0-9]{1}/,
  },
  {
    type: GoToTypes.InscriptionNumber,
    reg: /^\d+$/,
  },
  {
    type: GoToTypes.InscriptionNumber,
    reg: /^[I|i]nscription \#\d+$/,
  },
  {
    type: GoToTypes.InscriptionNumber,
    reg: /^\#\d+$/,
  },
  {
    type: GoToTypes.Sat,
    reg: /^\d+$/,
  },
  {
    type: GoToTypes.Block,
    reg: /^\d+$/,
  },
  {
    type: GoToTypes.Address,
    reg: /^[1|3|bc1][0-9A-Za-z]{25,}/,
  },
] as const

let inscriptionAbortController: any = null
let projectAbortController: any = null
let vagueInAbortController: any = null
async function searchFetcher(searches: SearchTypes[]) {
  let isHadProjectData = false
  const fetchPromises = searches.map(async ({ type, search }) => {
    if (!search) return null
    if (type === GoToTypes.Project) {
      projectAbortController && projectAbortController.abort()
      projectAbortController = new AbortController()
      const res = await fetch(`${ENV.backend}/collection/search?keyword=${encodeURIComponent(search)}&limit=3`, {
        signal: projectAbortController.signal,
      })
      if (res.status !== 200) return null
      const result = await res.json()
      if (result.data && result.data.length > 0) {
        isHadProjectData = true
        let datas = result.data.map((item: any) => ({
          type,
          id: item.id,
          // gtodo search
          link: item.protocol === 'normal' ? `/collections/${item.symbol}` : `/coin/brc20/${item.symbol}`,
          text: item.name,
          secondaryText: null,
          logo: item.logo,
        }))
        return datas.reverse()
      } else {
        return null
      }
    }
    if (type === GoToTypes.Inscription) {
      inscriptionAbortController = new AbortController()
      const res: any = await fetch(`${ENV.backend}/inscriptions/${search}`, {})
      if (res.status !== 200) return null
      const result = await res.json()
      if (result.data.id) {
        return {
          type,
          id: result.data.id,
          link: `/inscription/${result.data.id}`,
          content_type: result.data.content_type,
          text: result.data.number,
          secondaryText: result.data.id,
        }
      } else {
        return null
      }
    }
    if (type === GoToTypes.InscriptionNumber) {
      inscriptionAbortController = new AbortController()
      const number = search.replace('Inscription #', '').replace('inscription #', '').replace('#', '')
      const res = await fetch(`${ENV.backend}/inscription/search/${number}`, {})
      if (res.status !== 200) return null
      const result = await res.json()
      if (result?.data.length > 0) {
        let datas = result.data.map((item: any) => ({
          type,
          id: item.id,
          link: `/inscription/${item.id}`,
          content_type: item.content_type,
          text: item.number,
          secondaryText: item.id,
        }))
        return datas
      } else {
        return null
      }
    }
    if (type === GoToTypes.Sat) {
      return {
        type,
        id: search,
        link: `/sat/${search}`,
        text: search,
        secondaryText: null,
      }
    }
    if (type === GoToTypes.Block) {
      return {
        type,
        id: search,
        link: `/block/${search}`,
        text: search,
        secondaryText: null,
      }
    }
    // gtodo 正则匹配
    if (type === GoToTypes.Address) {
      return {
        type,
        id: search,
        link: `/address/${search}`,
        text: search,
        secondaryText: null,
      }
    }
    if (type === GoToTypes.VagueInscription) {
      vagueInAbortController && vagueInAbortController.abort()
      vagueInAbortController = new AbortController()
      const res = await fetch(`${ENV.backend}/inscription/search?keyword=${encodeURIComponent(search)}&limit=3`, {
        signal: vagueInAbortController.signal,
      })
      if (res.status !== 200) return null
      const result = await res.json()
      if (result.data && result.data.length > 0) {
        return result.data.map((item: any) => ({
          type: GoToTypes.Inscription,
          id: item.id,
          link: `/inscription/${item.id}`,
          text: item.number,
          content_type: item.content_type,
          secondaryText: null,
        }))
      } else {
        return null
      }
    }
    if (type === GoToTypes.TxnHash) {
      return {
        type,
        id: search,
        link: `/results/${search}?tp=txnhash`,
        text: search,
        secondaryText: null,
      }
    }
    return null
  })
  const results = await Promise.all(fetchPromises)
  const list = isHadProjectData ? results.flat(5).reverse() : results.flat(5)

  let hadAdd = false
  const list2 = list
    .filter((r) => !!r)
    .map((item) => {
      if (item.type === GoToTypes.Inscription || item.type === GoToTypes.InscriptionNumber) {
        if (!hadAdd) {
          hadAdd = true
          return item
        } else {
          return null
        }
      } else {
        return item
      }
    })
  return list2
    .filter((r) => !!r)
    .map(
      (r, i): SearchResult => ({
        id: `${r!.id}`,
        index: i,
        link: r!.link,
        text: `${r!.text}`,
        secondaryText: r!.secondaryText,
        contentType: r!.content_type,
        type: r!.type,
        logo: r?.logo,
      }),
    )
}
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
const SearchBar: React.FC = () => {
  const router = useRouter()
  const [ipt, setIpt] = useState('')
  const [search, setSearch] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const isFocusWithin = useFocusWithin(searchInputRef, {
    onFocus: () => {
      console.log('focus')
    },
    onBlur: () => {
      setIpt('')
      setSearchResults([])
      setSearch('')
    },
  })
  const [selected, setSelected] = useState(0)
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>([])
  const { run } = useDebounceFn(
    (value) => {
      setSearch(value)
    },
    {
      wait: 300,
    },
  )
  const searches = useMemo(() => {
    let ans: SearchTypes[] = []
    for (const { reg, type } of searchRegexes) {
      const s = search.replaceAll(',', '')
      if (reg.test(s)) {
        ans.push({ type, search: s })
      }
    }
    if (!ans.length) {
      ans.push({ type: GoToTypes.VagueInscription, search })
      ans.push({ type: GoToTypes.Project, search })
    }
    return ans
  }, [search])
  const { data, error, isLoading } = useSWR(searches, searchFetcher)
  const enterStatus = useRef(false)
  const handleResult = useCallback(
    (_selected = selected, _searchResults = searchResults) => {
      enterStatus.current = false
      if (_selected >= 0) {
        const selectedItem = _searchResults?.find((l) => l.index === _selected)
        if (!selectedItem) return
        router.push(selectedItem.link)
      } else {
        router.push(`/results/${encodeURIComponent(search)}`)
      }
    },
    [selected, searchResults, search, router],
  )

  useEffect(() => {
    if (isLoading) return
    if (error || !data) {
      setSearchResults([])
      return
    }
    if (data.length === 0) {
      enterStatus.current && handleResult(-1, [])
      setSelected(-1)
      setSearchResults(null)
      return
    }
    setSelected(0)
    enterStatus.current && handleResult(0, data)
    setSearchResults(data)
  }, [data, error, isLoading])

  const select = useCallback(
    (delta: 1 | -1) => {
      if (!searchResults) return
      const newValue = selected + delta
      if (newValue < 0 || newValue >= searchResults.length) return
      setSelected(selected + delta)
    },
    [setSelected, selected, searchResults],
  )

  const groupedResult = useMemo(() => {
    return searchResults?.reduce(
      (acc, r) => ({
        ...acc,
        [r.type]: acc[r.type].concat(r),
      }),
      {
        [GoToTypes.Project]: [],
        [GoToTypes.Inscription]: [],
        [GoToTypes.InscriptionNumber]: [],
        [GoToTypes.Address]: [],
        [GoToTypes.Sat]: [],
        [GoToTypes.Block]: [],
        [GoToTypes.VagueInscription]: [],
        [GoToTypes.TxnHash]: [],
      } as GroupedResults,
    )
  }, [searchResults, search])
  useEffect(() => {
    if (
      groupedResult &&
      Object.keys(groupedResult).length > 0 &&
      !groupedResult[GoToTypes.Project]?.length &&
      groupedResult[GoToTypes.Inscription]?.length
    ) {
      if (groupedResult[GoToTypes.Inscription]?.length === 1) {
        setSelected(0)
      } else {
        setSelected(-1)
      }
    }
  }, [groupedResult])

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusWithin) {
        e.preventDefault()
        searchInputRef.current?.blur()
      } else if (e.key === 'Enter') {
        if (search) {
          if (isLoading) {
            enterStatus.current = true
            return
          }
          handleResult()
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        select(1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        select(-1)
      }
    },
    [isFocusWithin, select, search, isLoading, handleResult],
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [onKeydown])

  const renderSuffix = (isFocused: boolean) => {
    return isFocused ? (
      <div
        className="w-[1.25rem] h-[1.25rem] mr-[.625rem] cursor-pointer"
        onClick={() => {
          searchInputRef.current?.blur()
        }}
      >
        <Image src={Images.COMMON.NEW_CLOSE_SVG} alt="icon" width={20} height={20} />
      </div>
    ) : (
      <div className="w-[1.75rem] h-[1.25rem] rounded-[0.375rem] bg-[#D7D8DA] flex items-center justify-center text-[#666] mr-[.625rem]">
        /
      </div>
    )
  }
  const renderSearchInput = () => {
    return (
      <div
        className={`flex items-center  z-[1001] ${
          isFocusWithin ? 'w-[24.8125rem] absolute -top-[20px] -left-[191px] bg-[#FFF]' : 'w-[12.25rem] bg-[#F2F2F2]'
        } h-[2.5rem] ml-[11.94rem] ${isFocusWithin && ipt !== '' ? 'rounded-t-[0.625rem]' : 'rounded-[0.625rem]'}`}
        style={isFocusWithin && ipt === '' ? { boxShadow: '0px 0px 4px 0px rgba(100, 117, 139, 0.25)' } : {}}
      >
        <Image src={Images.COMMON.NEW_SEARCH_SVG} alt="icon" width={12} height={12} className="ml-[1rem]" />
        <input
          ref={searchInputRef}
          className={`w-full outline-none font-normal placeholder:#C3C3C4 ml-[0.5rem] ${
            isFocusWithin ? 'bg-[#FFF]' : 'bg-[#F2F2F2]'
          }`}
          type="text"
          value={ipt}
          onChange={(ev) => {
            setIpt(ev.target.value.trim())
            run(ev.target.value.trim())
          }}
          placeholder={isFocusWithin ? 'Search by inscription,sat,or block' : 'Search'}
        />
        {renderSuffix(isFocusWithin)}
      </div>
    )
  }

  const renderSearchResult = () => {
    return (
      <div className="min-[1440px]:w-[24.8125rem] rounded-[0.625rem] bg-[#FFF] z-[1000] absolute -top-[1.2rem] left-0 iptArea pt-8">
        {groupedResult && isFocusWithin
          ? Object.entries(groupedResult).map(([type, results]) =>
              results.length ? (
                <div key={type}>
                  <div className="flex items-center">
                    <p className="text-neutral-300 mt-3 mb-[0.62rem] z-[1001] text-xs ml-[1rem]">
                      {type === GoToTypes.InscriptionNumber
                        ? GoToTypes.Inscription.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
                        : type.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())}
                    </p>
                    <div className="h-[1px] w-full bg-[#EFF2F5] mt-[.1rem] ml-[0.38rem]"></div>
                  </div>
                  {results.map((result) => (
                    <Link
                      className={cn(
                        'flex rounded-[0.625rem] h-[2.5rem] items-center border-2 border-transparent hover:bg-[#F0F2F5] whitespace-nowrap overflow-hidden text-ellipsis leading-5 z-[1001]',
                      )}
                      key={result.id}
                      href={
                        type !== GoToTypes.Inscription && type !== GoToTypes.InscriptionNumber
                          ? { pathname: result.link }
                          : { pathname: result.link, hash: result.text }
                      }
                      onMouseDown={(e) => {
                        e.preventDefault()
                      }}
                    >
                      {(type === GoToTypes.Inscription || type === GoToTypes.InscriptionNumber) && (
                        <InscriptionLink {...result} />
                      )}
                      {type === GoToTypes.Address && <OwnerLink {...result} />}
                      {type === GoToTypes.Project && <ProjectLink {...result} />}
                      {type === GoToTypes.TxnHash && <TxnHashLink {...result} />}
                    </Link>
                  ))}
                </div>
              ) : null,
            )
          : null}
        {search.length && searchResults === null ? (
          <p className="text-neutral-300 uppercase mt-5">¯\_(ツ)_/¯ No results</p>
        ) : null}
      </div>
    )
  }

  return (
    <>
      {ipt === '' ? (
        <div className="relative hidden xl:block min-[1440px]:w-[24rem]">{renderSearchInput()}</div>
      ) : (
        <div className="relative hidden xl:block min-[1440px]:w-[24rem]">
          {renderSearchInput()}
          {renderSearchResult()}
        </div>
      )}
    </>
  )
}

export default SearchBar
