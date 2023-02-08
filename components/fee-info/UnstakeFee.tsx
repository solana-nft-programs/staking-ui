import { ArrowUpOnSquareIcon } from '@heroicons/react/24/solid'
import { BN } from '@project-serum/anchor'
import { formatAmountAsDecimal } from 'common/units'
import { useMintDecimals } from 'hooks/useMintDecimals'
import { useMintSymbol } from 'hooks/useMintSymbol'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { useUnstakePaymentInfo } from 'hooks/useUnstakePaymentInfo'

export const UnstakeFee: React.FC = () => {
  const stakePool = useStakePoolData()

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
    <>
      {!!stakePool.isFetched &&
        stakePool?.data?.parsed &&
        isStakePoolV2(stakePool.data.parsed) && (
          <div className="flex items-center gap-2">
            <ArrowUpOnSquareIcon className="h-5 w-5 text-medium-4" />
            <div className="text-medium-4">Unstake Fee:</div>
            <div>
              {!!unstakePaymentMintDecimals &&
                !!unstakePaymentInfo.data &&
                formatAmountAsDecimal(
                  unstakePaymentMintDecimals,
                  new BN(unstakePaymentInfo.data?.parsed.paymentAmount),
                  unstakePaymentMintDecimals
                )}
            </div>
            <>{!!unstakePaymentMintSymbol && `$${unstakePaymentMintSymbol}`}</>
          </div>
        )}
    </>
  )
}
