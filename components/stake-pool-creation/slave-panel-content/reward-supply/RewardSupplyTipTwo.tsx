import Image from 'next/image'

import { BodyCopy } from '@/components/UI/typography/BodyCopy'

export const RewardSupplyTipTwo = () => {
  return (
    <>
      <div className="flex w-full justify-center">
        <Image
          src="/images/stake-pool-creation/reward-supply/reward-supply-two.png"
          width={310}
          height={420}
        />
      </div>
      <div className="mt-8 max-w-lg space-y-4 px-4">
        <BodyCopy>
          Specify the duration to stake a single natural amount of token (1 NFT
          or 1 coin) for stakers to receive reward.
        </BodyCopy>
        <BodyCopy>
          Information about standard reward rate in your Stake Pool will be
          visible on users assets when browsing your Stake Pool page.
        </BodyCopy>
      </div>
    </>
  )
}
