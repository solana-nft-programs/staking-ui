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
      return await fetch(`https://api.sentries.io/v1/check/${address || ''}`)
        .then((response) => response.json())
        .then((data) => {
          //console.log(data)
          return data
        })
    },
    {
      retry: 2,
    }
  )
}
