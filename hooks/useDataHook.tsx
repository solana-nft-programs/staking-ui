import { DependencyList, useMemo, useState } from 'react'

export interface DataHookValues<T> {
  refresh: (reload?: boolean) => void
  loaded: boolean
  refreshing: boolean
  error: string | undefined
  data: T | undefined
}

export function useDataHook<T>(
  fetchData: () => Promise<T | undefined>,
  dependencies: DependencyList
): DataHookValues<T> {
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [data, setData] = useState<T>()
  const [error, setError] = useState<string>()

  const refresh = async (reload?: boolean) => {
    if (reload) {
      setLoaded(false)
    }

    setError(undefined)
    try {
      const data = await fetchData()
      setData(data)
    } catch (e) {
      console.log('Error fetching data', e)
      setError(`${e}`)
    } finally {
      setLoaded(true)
      setRefreshing(false)
    }
  }

  useMemo(() => {
    void refresh()
  }, [...dependencies])

  return {
    loaded,
    refresh,
    refreshing,
    error,
    data,
  }
}
