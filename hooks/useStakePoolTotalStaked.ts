import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'
import { getMint } from 'spl-token-v3'

import { useStakePoolEntries } from './useStakePoolEntries'

export const useStakePoolTotalStaked = () => {
  const { connection } = useEnvironmentCtx()
  const stakePoolEntries = useStakePoolEntries()

  return useQuery<number>(
    [
      'useStakePoolTotalStaked',
      stakePoolEntries.data?.map((i) => i.pubkey.toString()),
    ],
    async () => {
      let total = 0
      if (!stakePoolEntries.data) {
        return 0
      }
      const mintToDecimals: { mint: string; decimals: number }[] = []
      for (const entry of stakePoolEntries.data) {
        try {
          if (entry.parsed?.amount && entry.parsed?.amount.toNumber() > 1) {
            let decimals = 0
            const match = mintToDecimals.find(
              (m) => m.mint === entry.parsed?.stakeMint.toString()
            )
            if (match) {
              decimals = match.decimals
            } else {
              const mintInfo = await getMint(connection, entry.parsed.stakeMint)
              decimals = mintInfo.decimals
              mintToDecimals.push({
                mint: entry.parsed.stakeMint.toString(),
                decimals: decimals,
              })
            }
            total += entry.parsed.amount.toNumber() / 10 ** decimals
          } else {
            total += 1
          }
        } catch (e) {
          console.log('Error calculating total staked tokens', e)
        }
      }
      return total
    },
    { enabled: !!stakePoolEntries.data }
  )
}
