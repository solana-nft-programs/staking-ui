import { useQuery } from 'react-query'
import { useRouter } from 'next/router'

export type SentriesStakeCheck = {
  info: Object
}

export const useTokenCheck = () => {
  const {
    query: { address },
  } = useRouter()
  return useQuery<SentriesStakeCheck[] | undefined>(
    ['useSentriesStats', address],
    async () => {
      return await fetch(`/v1/check/${address || ''}`)
        .then((response) => response.json())
        .then((data) => {
          return data
        })
    },
    {
      retry: 2,
    }
  )
}
