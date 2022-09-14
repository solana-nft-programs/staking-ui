import { useQuery } from 'react-query'
import { useWallet } from '@solana/wallet-adapter-react'

export type SentriesDetailsData = {
  poweredSentries: number
  floorPrice: number
  solPowering: number
  solPrice: number
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
