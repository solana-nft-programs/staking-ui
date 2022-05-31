import { notify } from 'common/Notification'
import { DependencyList, useEffect, useMemo, useState } from 'react'

const DEBUG = true

export interface DataHookValues<T> {
  refresh: (reload?: boolean) => Promise<void>
  loaded: boolean
  refreshing: boolean
  error: string | undefined
  data: T | undefined
}

export function useDataHook<T>(
  fetchData: () => Promise<T | undefined>,
  dependencies: DependencyList,
  params?: {
    name?: string
    errorMessage?: string
    refreshInterval?: number
  }
): DataHookValues<T> {
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [data, setData] = useState<T>()
  const [error, setError] = useState<string>()

  const refresh = async (reload?: boolean) => {
    if (reload) {
      setLoaded(false)
    }

    setRefreshing(true)
    setError(undefined)
    try {
      const startTime = Date.now()
      const data = await fetchData()
      const endTime = Date.now()
      if (DEBUG && params?.name)
        console.log(`««« Data [${params?.name}] (${endTime - startTime}ms) »»»`)
      setData(data)
    } catch (e) {
      console.log('Error fetching data', e)
      if (params?.errorMessage) notify({ message: params?.errorMessage })
      setError(`${e}`)
    } finally {
      setLoaded(true)
      setRefreshing(false)
    }
  }

  useMemo(() => {
    void refresh()
  }, [...dependencies])

  if (params?.refreshInterval) {
    useEffect(() => {
      const interval = setInterval(
        (function fetchInterval(): () => void {
          refresh()
          return fetchInterval
        })(),
        params?.refreshInterval
      )
      return () => clearInterval(interval)
    }, [...dependencies])
  }

  return {
    loaded,
    refresh,
    refreshing,
    error,
    data,
  }
}
