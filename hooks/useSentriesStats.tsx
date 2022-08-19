import { useQuery } from 'react-query'

export type SentriesStakingData = {
  nft_count: number
  sentry_owner_address: string
  total_staked: number
  max_power_level_sol: number
  stake_account_withdraw_authority: string
}

export const useSentriesStats = () => {
  return useQuery<SentriesStakingData[] | undefined>(
    ['useSentriesStats'],
    async () => {
      return await fetch(
        'DOMAIN' // TODO: Changeme
      )
        .then((response) => response.json())
        .then((data) => data['response']) // TODO: Changeme
    },
    {
      retry: 2,
    }
  )
}
