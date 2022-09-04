import { useQuery } from 'react-query'
import { useWallet } from '@solana/wallet-adapter-react'

export type SentriesStakingData = {
  nft_count: number
  sentry_owner_address: string
  total_staked: number
  max_power_level_sol: number
  stake_account_withdraw_authority: string
  error?: string
}

export const useSentriesStats = () => {
  const wallet = useWallet()

  const address = wallet.publicKey?.toString()
  return useQuery<SentriesStakingData[] | undefined>(
    ['useSentriesStats', address],
    async () => {
      return await fetch(
        `https://api.sentries.io/v1/power/${address}` // TODO: Changeme
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          return data
        })
    },
    {
      retry: 2,
    }
  )
}
