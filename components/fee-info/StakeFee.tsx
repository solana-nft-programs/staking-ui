import { ArrowDownOnSquareIcon } from '@heroicons/react/24/solid'
import { BN } from '@project-serum/anchor'
import { formatAmountAsDecimal } from 'common/units'
import { useMintDecimals } from 'hooks/useMintDecimals'
import { useMintSymbol } from 'hooks/useMintSymbol'
import { useStakePaymentInfo } from 'hooks/useStakePaymentInfo'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'

export const StakeFee: React.FC = () => {
  const stakePool = useStakePoolData()

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

  return (
    <>
      {!!stakePool.isFetched &&
        stakePool?.data?.parsed &&
        isStakePoolV2(stakePool.data.parsed) && (
          <div className="flex items-center gap-2">
            <ArrowDownOnSquareIcon className="h-5 w-5 text-medium-4" />
            <div className="text-medium-4">Stake Fee:</div>
            <div>
              {!!stakePaymentMintDecimals &&
                !!stakePaymentInfo.data &&
                formatAmountAsDecimal(
                  stakePaymentMintDecimals,
                  new BN(stakePaymentInfo.data.parsed.paymentAmount),
                  stakePaymentMintDecimals
                )}
            </div>
            <>{!!stakePaymentMintSymbol && `$${stakePaymentMintSymbol}`}</>
          </div>
        )}
    </>
  )
}
