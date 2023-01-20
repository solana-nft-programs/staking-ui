import { getExpirationString } from '@cardinal/common'
import type { IdlAccountData } from '@cardinal/rewards-center'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useUTCNow } from 'providers/UTCNowProvider'
import { FaCheck } from 'react-icons/fa'

export interface CooldownArgs {
  tokenData: StakeEntryTokenData
  stakePool: Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'> | undefined
}

export const hasCooldown = ({ tokenData, stakePool }: CooldownArgs) => {
  const has =
    tokenData.stakeEntry?.parsed.cooldownStartSeconds ||
    stakePool?.parsed.cooldownSeconds
  return !!has
}

export const TokenStatCooldownValue = ({
  tokenData,
}: {
  tokenData: StakeEntryTokenData
}) => {
  const { data: stakePool } = useStakePoolData()
  const { UTCNow } = useUTCNow()

  if (
    !tokenData.stakeEntry?.parsed.cooldownStartSeconds ||
    !stakePool?.parsed.cooldownSeconds
  ) {
    return <></>
  }

  return (
    <>
      {tokenData.stakeEntry?.parsed.cooldownStartSeconds.toNumber() +
        stakePool.parsed.cooldownSeconds -
        UTCNow >
      0 ? (
        getExpirationString(
          tokenData.stakeEntry?.parsed.cooldownStartSeconds.toNumber() +
            stakePool.parsed.cooldownSeconds,
          UTCNow
        )
      ) : (
        <FaCheck />
      )}
    </>
  )
}
