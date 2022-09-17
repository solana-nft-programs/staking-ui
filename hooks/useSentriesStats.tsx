import { useQuery } from 'react-query'

export type SentriesDetailsData = {
  poweredSentries: number
  stakedSentries: number
  floorPrice: number
  solPowering: number
  solPrice: number
  epoch: number
  epochPct: number
  epochTimeLeft: string
  error?: string
}

export const useSentriesStats = () => {
  return useQuery<SentriesDetailsData | undefined>(
    ['useSentriesStats'],
    async () => {
      return await fetch(
        `/v1/sentries`
      )
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
