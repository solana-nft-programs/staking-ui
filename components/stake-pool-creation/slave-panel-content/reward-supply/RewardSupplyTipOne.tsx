import Image from 'next/image'

import { BodyCopy } from '@/components/UI/typography/BodyCopy'

export const RewardSupplyTipOne = () => {
  return (
    <>
      <div className="flex w-full justify-center">
        <Image
          src="/images/stake-pool-creation/reward-supply/reward-supply-one.png"
          width={310}
          height={420}
        />
      </div>
      <div className="mt-8 max-w-lg space-y-4 px-4">
        <BodyCopy>
          Specify the amount of tokens to be distributed per duration staked,
          e.g. 375.6 DGG per NFT staked or 0.25 DGG per single DGG coin staked.
        </BodyCopy>
        <BodyCopy>
          Information about standard reward rate in your Stake Pool will be
          visible on users’ assets when browsing your Stake Pool page.
        </BodyCopy>
      </div>
    </>
  )
}
