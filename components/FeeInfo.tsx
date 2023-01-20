import {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  TagIcon,
} from '@heroicons/react/24/solid'
import { BN } from '@project-serum/anchor'
import { Tooltip } from 'common/Tooltip'
import { formatAmountAsDecimal } from 'common/units'
import { useClaimRewardsPaymentInfo } from 'hooks/useClaimRewardsPaymentInfo'
import { useMintDecimals } from 'hooks/useMintDecimals'
import { useMintSymbol } from 'hooks/useMintSymbol'
import { useStakePaymentInfo } from 'hooks/useStakePaymentInfo'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { useUnstakePaymentInfo } from 'hooks/useUnstakePaymentInfo'
import { BsFillCreditCardFill, BsFillInfoCircleFill } from 'react-icons/bs'

export const FeeInfo: React.FC = () => {
  const { data: stakePool } = useStakePoolData()

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

  const stakePaymentInfo = useStakePaymentInfo()
  const { data: stakePaymentMintSymbol } = useMintSymbol(
    stakePaymentInfo.isFetched
      ? stakePaymentInfo?.data?.parsed?.paymentMint
      : undefined
  )
  const { data: stakePaymentMintDecimals } = useMintDecimals(
    stakePaymentInfo.isFetched
      ? stakePaymentInfo?.data?.parsed?.paymentMint
      : undefined
  )

  const unstakePaymentInfo = useUnstakePaymentInfo()
  const { data: unstakePaymentMintSymbol } = useMintSymbol(
    unstakePaymentInfo.isFetched
      ? unstakePaymentInfo?.data?.parsed?.paymentMint
      : undefined
  )
  const { data: unstakePaymentMintDecimals } = useMintDecimals(
    unstakePaymentInfo.isFetched
      ? unstakePaymentInfo?.data?.parsed?.paymentMint
      : undefined
  )

  return (
    <div className="flex flex-wrap space-x-8">
      {!!stakePool?.parsed && (
        <div>
          <Tooltip
            title={`This is the version of the stake pool protocol that this stake pool is using. Each version handles fees differently.`}
          >
            <div className="flex cursor-pointer flex-row items-center justify-center gap-2">
              <BsFillInfoCircleFill className="text-medium-4" />
              <div className="text-medium-4">Protocol: </div>
              <div className="text-light-1">
                {isStakePoolV2(stakePool.parsed) ? 'V2' : 'V1'}
              </div>
            </div>
          </Tooltip>
        </div>
      )}
      {!!stakePool?.parsed && !isStakePoolV2(stakePool.parsed) && (
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
      )}
      {!!stakePool?.parsed && isStakePoolV2(stakePool.parsed) && (
        <>
          <div className="flex items-center gap-2">
            <TagIcon className="h-5 w-5 text-medium-4" />
            <div className="text-medium-4">Reward Claim Fee: </div>
            <div>
              {!!claimRewardsPaymentMintDecimals &&
                formatAmountAsDecimal(
                  claimRewardsPaymentMintDecimals,
                  new BN(claimRewardsPaymentInfo.data.parsed.paymentAmount),
                  claimRewardsPaymentMintDecimals
                )}
            </div>
            <>{`$${claimRewardsPaymentMintSymbol}`}</>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpOnSquareIcon className="h-5 w-5 text-medium-4" />
            <div className="text-medium-4">Unstake Fee:</div>
            <div>
              {!!unstakePaymentMintDecimals &&
                formatAmountAsDecimal(
                  unstakePaymentMintDecimals,
                  new BN(unstakePaymentInfo.data.parsed.paymentAmount),
                  unstakePaymentMintDecimals
                )}
            </div>
            <>{`$${unstakePaymentMintSymbol}`}</>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDownOnSquareIcon className="h-5 w-5 text-medium-4" />
            <div className="text-medium-4">Stake Fee:</div>
            <div>
              {!!stakePaymentMintDecimals &&
                formatAmountAsDecimal(
                  stakePaymentMintDecimals,
                  new BN(stakePaymentInfo.data.parsed.paymentAmount),
                  stakePaymentMintDecimals
                )}
            </div>
            <>{`$${stakePaymentMintSymbol}`}</>
          </div>
        </>
      )}
    </div>
  )
}
