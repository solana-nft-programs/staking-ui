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
  rewards: Rewards,
  error?: string
}

export const useSentryPower = () => {
  const wallet = useWallet()

  const address = wallet.publicKey?.toString()
  return useQuery<SentriesStakingData | undefined>(
    ['useSentryPower', address],
    async () => {
      return await fetch(
        `/v1/power/${address}`
      )
        .then((response) => response.json())
        .then((data) => {
          return data
        })
    },
    {
      enabled: !!address,
      retry: 2,
    }
  )
}
