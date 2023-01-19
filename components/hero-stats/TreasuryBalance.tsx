import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { BN } from '@project-serum/anchor'
import { formatMintNaturalAmountAsDecimal } from 'common/units'
import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from 'hooks/useRewardDistributorData'
import { useRewardDistributorTokenAccount } from 'hooks/useRewardDistributorTokenAccount'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export const TreasuryBalance = ({ className }: Props) => {
  const rewardDistributorData = useRewardDistributorData()
  const rewardMintInfo = useRewardMintInfo()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const rewardDistributorTokenAccountData = useRewardDistributorTokenAccount()

  const isZeroBalance = () => {
    return new BN(
      rewardDistributorTokenAccountData.data?.amount.toString() || 0
    ).eq(new BN(0))
  }

  return (
    <>
      {!rewardMintInfo.data ||
      !rewardDistributorData.data ||
      !rewardDistributorTokenAccountData.isFetched ? (
        <div className="h-6 w-10 animate-pulse rounded-md bg-border"></div>
      ) : (
        <div
          className={className}
          style={{
            color: isZeroBalance()
              ? '#f87171' // text-red-400
              : stakePoolMetadata?.colors?.fontColor,
          }}
        >
          {rewardDistributorData.data.parsed?.kind ===
            RewardDistributorKind.Mint &&
          !isRewardDistributorV2(rewardDistributorData.data.parsed)
            ? formatMintNaturalAmountAsDecimal(
                rewardMintInfo.data.mintInfo,
                new BN(rewardMintInfo.data.mintInfo.supply.toString()),
                Math.min(rewardMintInfo.data.mintInfo.decimals, 6)
              )
            : formatMintNaturalAmountAsDecimal(
                rewardMintInfo.data.mintInfo,
                new BN(
                  rewardDistributorTokenAccountData.data?.amount.toString() || 0
                ) || new BN(0),
                Math.min(rewardMintInfo.data.mintInfo.decimals, 6)
              )}
        </div>
      )}
    </>
  )
}
