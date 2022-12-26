import { getExpirationString } from '@cardinal/common'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useUTCNow } from 'providers/UTCNowProvider'
import { FaCheck } from 'react-icons/fa'

export const TokenStatMinimumStakeTimeValue = ({
  tokenData,
}: {
  tokenData: StakeEntryTokenData
}) => {
  const { data: stakePool } = useStakePoolData()
  const { UTCNow } = useUTCNow()

  if (
    !tokenData.stakeEntry?.parsed.lastStakedAt ||
    !stakePool?.parsed.minStakeSeconds
  ) {
    return <></>
  }

  return (
    <>
      {tokenData.stakeEntry?.parsed.lastStakedAt.toNumber() +
        stakePool.parsed.minStakeSeconds -
        UTCNow >
      0 ? (
        getExpirationString(
          tokenData.stakeEntry?.parsed.lastStakedAt.toNumber() +
            stakePool.parsed.minStakeSeconds,
          UTCNow
        )
      ) : (
        <FaCheck />
      )}
    </>
  )
}
