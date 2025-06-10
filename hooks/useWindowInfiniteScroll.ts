import { useMemo, useState } from 'react'
import { useEventListener, useMemoizedFn, useRequest, useUpdateEffect } from 'ahooks'
import { getClientHeight, getScrollHeight, getScrollTop } from 'ahooks/lib/utils/rect'
import { Data, InfiniteScrollOptions, Service } from 'ahooks/lib/useInfiniteScroll/types'
import { getTargetElement } from 'ahooks/lib/utils/domTarget'
import { ENV } from '@/utils/env'

const useWindowInfiniteScroll = <TData extends Data>(
  service: Service<TData>,
  options: InfiniteScrollOptions<TData> & { target?: HTMLElement; debounceWait?: number } = {
    target: (ENV.isBrowser && document.documentElement) as HTMLElement,
    debounceWait: 0,
  },
) => {
  const { threshold = 100, reloadDeps = [], manual, onBefore, onSuccess, onError, onFinally, target } = options
  const [finalData, setFinalData] = useState<TData>()
  const [loadingMore, setLoadingMore] = useState(false)
  const isNoMore = options.isNoMore
  const noMore = useMemo(() => {
    if (!isNoMore) return false
    //@ts-ignore
    return isNoMore(finalData)
  }, [finalData, isNoMore])

  const { loading, run, runAsync, cancel } = useRequest(
    async (lastData?: TData) => {
      const currentData = await service(lastData)
      if (!lastData) {
        setFinalData(currentData)
      } else {
        setFinalData({
          ...currentData,
          // @ts-ignore
          list: [...lastData.list, ...currentData.list],
        })
      }
      return currentData
    },
    {
      manual,
      onFinally: (_, d, e) => {
        setLoadingMore(false)
        onFinally?.(d, e)
      },
      onBefore: () => onBefore?.(),
      debounceWait: options.debounceWait || 0,
      onSuccess: (d) => {
        onSuccess?.(d)
      },
      onError: (e) => onError?.(e),
    },
  )

  const loadMore = () => {
    if (noMore) return
    setLoadingMore(true)
    run(finalData)
  }

  const loadMoreAsync = () => {
    if (noMore) return Promise.reject()
    setLoadingMore(true)
    return runAsync(finalData)
  }

  const reload = () => () => {
    cancel()
    run()
  }
  const reloadAsync = () => runAsync()

  const scrollMethod = () => {
    const el = getTargetElement(() => target || document.documentElement)
    if (!el) {
      return
    }

    const scrollTop = getScrollTop(el)
    const scrollHeight = getScrollHeight(el)
    const clientHeight = getClientHeight(el)
    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      loadMore()
    }
  }
  useEventListener(
    'scroll',
    () => {
      if (loading || loadingMore) {
        return
      }
      scrollMethod()
    },
    {},
  )

  useUpdateEffect(() => {
    setFinalData(undefined)
    run()
  }, [...reloadDeps])

  return {
    data: finalData,

    loading: !loadingMore && loading,
    loadingMore,
    noMore,

    loadMore: useMemoizedFn(loadMore),
    loadMoreAsync: useMemoizedFn(loadMoreAsync),
    reload: useMemoizedFn(reload),
    reloadAsync: useMemoizedFn(reloadAsync),
    mutate: setFinalData,
    cancel,
  }
}

export default useWindowInfiniteScroll
