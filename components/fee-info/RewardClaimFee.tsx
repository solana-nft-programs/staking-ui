import { TagIcon } from '@heroicons/react/24/solid'
import { BN } from '@project-serum/anchor'
import { formatAmountAsDecimal } from 'common/units'
import { useClaimRewardsPaymentInfo } from 'hooks/useClaimRewardsPaymentInfo'
import { useMintDecimals } from 'hooks/useMintDecimals'
import { useMintSymbol } from 'hooks/useMintSymbol'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'

export const RewardClaimFee: React.FC = () => {
  const stakePool = useStakePoolData()
  const claimRewardsPaymentInfo = useClaimRewardsPaymentInfo()
  const { data: claimRewardsPaymentMintSymbol } = useMintSymbol(
    claimRewardsPaymentInfo.isFetched
      ? claimRewardsPaymentInfo?.data?.parsed?.paymentMint
      : undefined
  )
  const { data: claimRewardsPaymentMintDecimals } = useMintDecimals(
    claimRewardsPaymentInfo.isFetched
      ? claimRewardsPaymentInfo?.data?.parsed?.paymentMint
      : undefined
  )

  return (
    <>
      {!!stakePool.isFetched &&
        stakePool?.data?.parsed &&
        isStakePoolV2(stakePool.data.parsed) && (
          <div className="flex items-center gap-2">
            <TagIcon className="h-5 w-5 text-medium-4" />
            <div className="text-medium-4">Reward Claim Fee: </div>
            <div>
              {!!claimRewardsPaymentMintDecimals &&
                claimRewardsPaymentInfo.data &&
                formatAmountAsDecimal(
                  claimRewardsPaymentMintDecimals,
                  new BN(claimRewardsPaymentInfo.data.parsed.paymentAmount),
                  claimRewardsPaymentMintDecimals
                )}
            </div>
            <>
              {!!claimRewardsPaymentMintSymbol &&
                `$${claimRewardsPaymentMintSymbol}`}
            </>
          </div>
        )}
    </>
  )
}
