import { getExpirationString, secondstoDuration } from '@cardinal/common'
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
  return (
    !!tokenData.stakeEntry?.parsed.cooldownStartSeconds ||
    !!stakePool?.parsed.cooldownSeconds
  )
}

export const TokenStatCooldownValue = ({
  tokenData,
}: {
  tokenData: StakeEntryTokenData
}) => {
  const { data: stakePool } = useStakePoolData()
  const { UTCNow } = useUTCNow()

  if (!stakePool?.parsed.cooldownSeconds) {
    return <></>
  }

  return (
    <>
      {!tokenData.stakeEntry?.parsed.cooldownStartSeconds ? (
        secondstoDuration(stakePool.parsed.cooldownSeconds)
      ) : tokenData.stakeEntry?.parsed.cooldownStartSeconds.toNumber() +
          stakePool.parsed.cooldownSeconds -
          Math.floor(UTCNow) >
        0 ? (
        getExpirationString(
          tokenData.stakeEntry?.parsed.cooldownStartSeconds.toNumber() +
            stakePool.parsed.cooldownSeconds,
          Math.floor(UTCNow)
        )
      ) : (
        <FaCheck />
      )}
    </>
  )
}
