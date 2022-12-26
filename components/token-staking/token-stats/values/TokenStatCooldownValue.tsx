import { getExpirationString } from '@cardinal/common'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useUTCNow } from 'providers/UTCNowProvider'
import { FaCheck } from 'react-icons/fa'

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
