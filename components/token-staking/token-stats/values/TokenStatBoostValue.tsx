import type { IdlAccountData } from '@cardinal/rewards-center'
import { PublicKey } from '@solana/web3.js'
import { formatAmountAsDecimal } from 'common/units'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardEntries } from 'hooks/useRewardEntries'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

export interface TokenStatBoostValueProps {
  tokenData: StakeEntryTokenData
}

export interface BoostArgs {
  rewardDistributorData: Pick<
    IdlAccountData<'rewardDistributor'>,
    'pubkey' | 'parsed'
  >
  tokenData: StakeEntryTokenData
  rewardEntriesData:
    | Pick<IdlAccountData<'rewardEntry'>, 'pubkey' | 'parsed'>[]
    | undefined
}

export const calculateBoost = ({
  rewardDistributorData,
  rewardEntriesData,
  tokenData,
}: BoostArgs) => {
  return formatAmountAsDecimal(
    rewardDistributorData?.parsed.multiplierDecimals || 0,
    rewardEntriesData
      ? rewardEntriesData.find((entry) =>
          entry.parsed?.stakeEntry.equals(
            tokenData.stakeEntry?.pubkey || PublicKey.default
          )
        )?.parsed?.multiplier || rewardDistributorData.parsed.defaultMultiplier
      : rewardDistributorData.parsed.defaultMultiplier,
    rewardDistributorData.parsed.multiplierDecimals
  )
}

export const TokenStatBoostValue = ({
  tokenData,
}: TokenStatBoostValueProps) => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: rewardEntriesData } = useRewardEntries()

  if (!tokenData.stakeEntry?.pubkey) return <></>

  return (
    <>
      {(rewardDistributorData?.parsed?.multiplierDecimals !== undefined &&
        calculateBoost({
          rewardDistributorData: rewardDistributorData,
          rewardEntriesData: rewardEntriesData,
          tokenData,
        })) ||
        '1'}
    </>
  )
}
