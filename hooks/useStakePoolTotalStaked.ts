import * as splToken from '@solana/spl-token'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

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
          if (entry.parsed.amount.toNumber() > 1) {
            let decimals = 0
            const match = mintToDecimals.find(
              (m) => m.mint === entry.parsed.originalMint.toString()
            )
            if (match) {
              decimals = match.decimals
            } else {
              const mint = new splToken.Token(
                connection,
                entry.parsed.originalMint,
                splToken.TOKEN_PROGRAM_ID,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                null
              )
              const mintInfo = await mint.getMintInfo()
              decimals = mintInfo.decimals
              mintToDecimals.push({
                mint: entry.parsed.originalMint.toString(),
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
