import type { IdlAccountData } from '@cardinal/rewards-center'
import { PublicKey } from '@solana/web3.js'
import { formatAmountAsDecimal } from 'common/units'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

export interface calculateBoostArgs {
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
}: calculateBoostArgs) => {
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

export const hasBoost = ({
  rewardDistributorData,
  rewardEntriesData,
  tokenData,
}: calculateBoostArgs) => {
  const boost = Number(
    calculateBoost({
      rewardDistributorData,
      rewardEntriesData,
      tokenData,
    })
  )
  return boost > 1
}
