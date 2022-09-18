import { useQuery } from 'react-query'
import { useWallet } from '@solana/wallet-adapter-react'

export type Rewards = {
  rewardEpoch: number[],
  rewardAmount: number[],
  rewardPostBalance: number[],
  stake: number[]
}

export type SentriesStakingData = {
  nftCount: number
  sentryOwnerAddress: string
  totalStaked: number
  maxPowerLevelSol: number
  stakeAccountWithdrawAuthority: string
  rewards: Rewards
  error?: string
}

export const useSentriesStats = () => {
  const wallet = useWallet()

  const address = wallet.publicKey?.toString()
  return useQuery<SentriesStakingData[] | undefined>(
    [
      'useSentriesStats',
      address
    ],
    async () => {
      return await fetch(
        `https://api.sentries.io/v1/power/${address}`
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
