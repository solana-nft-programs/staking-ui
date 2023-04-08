import { BN } from '@coral-xyz/anchor'
import { TagIcon } from '@heroicons/react/24/solid'
import { formatAmountAsDecimal } from 'common/units'
import { useClaimRewardsPaymentInfo } from 'hooks/useClaimRewardsPaymentInfo'
import { useMintDecimals } from 'hooks/useMintDecimals'
import { useMintSymbol } from 'hooks/useMintSymbol'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { BsFillCreditCardFill } from 'react-icons/bs'

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

  console.log(claimRewardsPaymentInfo.data?.parsed.paymentAmount)
  return (
    <>
      {!!stakePool.isFetched &&
        stakePool?.data?.parsed &&
        (isStakePoolV2(stakePool.data.parsed) ? (
          claimRewardsPaymentInfo.data && (
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
          )
        ) : (
          <div className="flex flex-row items-center justify-center gap-2">
            <BsFillCreditCardFill className="text-medium-4" />
            <div className="text-medium-4">Fee: </div>
            <a
              className="text-gray-400 underline"
              target="_blank"
              rel="noreferrer"
              href="//cardinal-labs.notion.site/Cardinal-Staking-Costs-14e66a64fb2d4615892937c5dbaa91cc"
            >
              View staking costs
            </a>
          </div>
        ))}
    </>
  )
}
