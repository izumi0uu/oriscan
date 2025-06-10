// @ts-nocheck
'use client'

import { Search as SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import { ENV } from '@/utils/env'
import { useDebounceFn } from 'ahooks'

import { cn } from '@/utils/helpers'

import '@/components/SearchBar.css'
import Thumbnail from '@/components/Thumbnail'
import { Images } from '@/utils/images'

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
  // {
  //   type: GoToTypes.TxnHash,
  //   reg: /^[0-9a-f]{64}$/,
  // },
] as const

let inscriptionAbortController = null
let projectAbortController = null
let vagueInAbortController = null
let addressAbortController = null
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
      // inscriptionAbortController && inscriptionAbortController.abort()
      inscriptionAbortController = new AbortController()
      const res = await fetch(`${ENV.backend}/inscriptions/${search}`, {
        // signal: inscriptionAbortController.signal,
      })
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
      // inscriptionAbortController && inscriptionAbortController.abort()
      inscriptionAbortController = new AbortController()
      const number = search.replace('Inscription #', '').replace('inscription #').replace('#', '')
      const res = await fetch(`${ENV.backend}/inscription/search/${number}`, {
        // signal: inscriptionAbortController.signal,
      })
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
      // addressAbortController && addressAbortController.abort()
      // addressAbortController = new AbortController()
      // const res = await fetch(`${ENV.backend}/inscriptions?limit=1&address=${search}`, {
      //   signal: addressAbortController.signal,
      // })
      // if (res.status !== 200) return null
      // const result = await res.json()
      // if (result.data && result.data.length > 0) {
      //   return {
      //     type,
      //     id: search,
      //     link: `/address/${search}`,
      //     text: search,
      //     secondaryText: null,
      //   }
      // } else {
      //   return null
      // }
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

const InscriptionLink = (props: SearchResult) => {
  return (
    <>
      <div className="inline-block w-9 h-9 rounded border border-neutral-100 text-[8px] text-center leading-8">
        <Thumbnail
          inscription={{
            id: props.id,
            content_type: props.contentType,
          }}
        />
      </div>
      <p>
        <span className="text-neutral-300">
          ID {props.id.slice(0, 4)}...{props.id.slice(62)}{' '}
        </span>
        <span className="text-neutral-800"> &rarr; #{props.text}</span>
      </p>
    </>
  )
}

const SatLink = (props: SearchResult) => {
  return <p className="text-neutral-800">#{props.text}</p>
}

const BlockLink = (props: SearchResult) => {
  return <p className="text-neutral-800">#{props.text}</p>
}

const OwnerLink = (props: SearchResult) => {
  return <p className="text-neutral-800">#{props.text}</p>
}

const ProjectLink = (props: SearchResult) => {
  return (
    <p className="text-neutral-800 flex items-center" style={{ columnGap: 8 }}>
      <div
        className="w-[30px] h-[30px] rounded-full bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${props.logo || Images.COMMON.PROJECT_DEFAULT_ICON_PNG})` }}
      />
      {props.text}
    </p>
  )
}

const TxnHashLink = (props: SearchResult) => {
  return (
    <p className="text-neutral-800">
      {props.text.slice(0, 6)}...{props.text.slice(props.text.length - 6)}{' '}
    </p>
  )
}

const SearchBar = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [ipt, setIpt] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [selected, setSelected] = useState(0)
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { run } = useDebounceFn(
    (value) => {
      setSearch(value)
    },
    {
      wait: 300,
    },
  )

  // let searches: SearchTypes[] = []
  // for (const { reg, type } of searchRegexes) {
  //   const s = search.replaceAll(",", "")
  //   if (reg.test(s)) {
  //     searches.push({ type, search: s})
  //   }
  // }
  // if (!searches.length) {
  //   searches.push({ type: GoToTypes.VagueInscription, search })
  //   searches.push({ type: GoToTypes.Project, search })
  // }

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
  }, [data, error, isLoading, handleResult])

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
  }, [searchResults])
  useEffect(() => {
    if (
      groupedResult &&
      Object.keys(groupedResult).length > 0 &&
      !groupedResult[GoToTypes.Project]?.length &&
      groupedResult[GoToTypes.Inscription]?.length
    ) {
      // @ts-ignore
      if (groupedResult[GoToTypes.Inscription]?.length === 1) {
        setSelected(0)
      } else {
        setSelected(-1)
      }
    }
  }, [groupedResult])

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocused) {
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
    [isFocused, select, search, isLoading, handleResult],
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [onKeydown])

  return (
    <div
      className={cn('search-bar-container relative text-neutral-400 transition-colors h-10', isFocused && 'focused')}
    >
      <div className="search-bar-box absolute z-[1000] w-full p-[1px] bg-gradient-to-b from-neutral-0 to-neutral-200 rounded-[5px]">
        <div
          className={`bg-[#F2F2F2] m-0 p-2 mt-9  w-full text-neutral-400 transition-colors rounded-[4px] relative z-10 ${
            search.length && groupedResult && isFocused ? 'block' : 'hidden'
          }`}
        >
          {groupedResult && isFocused
            ? Object.entries(groupedResult).map(([type, results]) =>
                results.length ? (
                  <div key={type}>
                    <p className="uppercase text-neutral-300 mt-3 mb-1">
                      {type === GoToTypes.InscriptionNumber ? GoToTypes.Inscription : type}
                    </p>

                    {results.map((result) => (
                      <Link
                        className={cn(
                          'flex items-center gap-2 p-3 border-2 border-transparent rounded hover:bg-neutral-0 whitespace-nowrap overflow-hidden text-ellipsis leading-5',
                          result.index === selected && 'border-peach',
                        )}
                        key={result.id}
                        href={result.link}
                        onMouseDown={(e) => {
                          // avoid loosing focus on the input
                          e.preventDefault()
                        }}
                      >
                        {(type === GoToTypes.Inscription || type === GoToTypes.InscriptionNumber) && (
                          <InscriptionLink {...result} />
                        )}
                        {/* {type === GoToTypes.Sat && <SatLink {...result} />}
                        {type === GoToTypes.Block && <BlockLink {...result} />} */}
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
      </div>
      <div className="absolute z-[1001] w-full p-2 bg-[#F2F2F2]">
        <div className="flex gap-4">
          <SearchIcon className="text-neutral-300" />
          <input
            ref={searchInputRef}
            className="w-full outline-none font-normal placeholder:text-neutral-300 bg-[#F2F2F2]"
            type="text"
            value={ipt}
            onChange={(ev) => {
              setIpt(ev.target.value.trim())
              run(ev.target.value.trim())
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search by Address / Inscription / Token"
          />
        </div>
      </div>
    </div>
  )
}

export default SearchBar
