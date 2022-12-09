import Image from 'next/image'

import { BodyCopy } from '@/components/UI/typography/BodyCopy'

export const RewardSupplyTipThree = () => {
  return (
    <>
      <Image
        src="/images/stake-pool-creation/reward-supply/reward-supply-three.png"
        width={310}
        height={420}
      />
      <div className="mt-8 max-w-lg space-y-4 px-4">
        <BodyCopy>
          Set the stake multiplier for given mints. Does your collection include
          rarity? For example let’s double (2x) the reward rate for some
          legendary NFTs.
        </BodyCopy>
        <BodyCopy>
          Information about boosted reward rate in your Stake Pool will be
          visible on users’ assets when browsing your Stake Pool page.
        </BodyCopy>
      </div>
    </>
  )
}
