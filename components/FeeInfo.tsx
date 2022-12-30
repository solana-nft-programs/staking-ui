import { Tooltip } from 'common/Tooltip'
import { useStakePaymentInfo } from 'hooks/useStakePaymentInfo'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { BsFillCreditCardFill, BsFillInfoCircleFill } from 'react-icons/bs'

export const FeeInfo: React.FC = () => {
  const { data: stakePool } = useStakePoolData()
  const { data: paymentInfoData } = useStakePaymentInfo()

  return (
    <div className="flex space-x-8">
      {!!stakePool?.parsed && (
        <div>
          <Tooltip
            title={`This is the version of the stake pool protocol that this stake pool is using. Each version handles fees differently.`}
          >
            <div className="flex cursor-pointer flex-row items-center justify-center gap-2">
              <BsFillInfoCircleFill className="text-medium-4" />
              <div className="text-medium-4">Protocol version: </div>
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
        <div className="flex flex-row items-center justify-center gap-2">
          <BsFillCreditCardFill className="text-medium-4" />
          <div className="text-medium-4">Fee: </div>
          <>{JSON.stringify(paymentInfoData?.amount)}</>
          {/* {JSON.stringify(stakePool.parsed.unstakePaymentInfo)}
          {JSON.stringify(stakePool.parsed.stakePaymentInfo)}
          {JSON.stringify(
            rewardDistributorData?.parsed.claimRewardsPaymentInfo
          )} */}
        </div>
      )}
    </div>
  )
}
