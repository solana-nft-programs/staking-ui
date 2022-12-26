import { PublicKey } from '@solana/web3.js'
import { formatAmountAsDecimal } from 'common/units'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardEntries } from 'hooks/useRewardEntries'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

export interface TokenStatBoostValueProps {
  tokenData: StakeEntryTokenData
}

export const TokenStatBoostValue = ({
  tokenData,
}: TokenStatBoostValueProps) => {
  const rewardDistributorData = useRewardDistributorData()
  const rewardEntries = useRewardEntries()

  if (!tokenData.stakeEntry?.pubkey) return <></>

  return (
    <>
      {(rewardDistributorData.data?.parsed?.multiplierDecimals !== undefined &&
        formatAmountAsDecimal(
          rewardDistributorData.data?.parsed.multiplierDecimals || 0,
          rewardEntries.data
            ? rewardEntries.data.find((entry) =>
                entry.parsed?.stakeEntry.equals(
                  tokenData.stakeEntry?.pubkey || PublicKey.default
                )
              )?.parsed?.multiplier ||
                rewardDistributorData.data.parsed.defaultMultiplier
            : rewardDistributorData.data.parsed.defaultMultiplier,
          rewardDistributorData.data.parsed.multiplierDecimals
        ).toString()) ||
        1}
    </>
  )
}
