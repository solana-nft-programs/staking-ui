import Image from 'next/image'

import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { BodyTextSizes } from '@/types/index'

export const RewardSupplyTipThree = () => {
  const { SMALL } = BodyTextSizes
  return (
    <>
      <div className="flex w-full justify-center">
        <Image
          src="/images/stake-pool-creation/reward-supply/reward-supply-three.png"
          width={310}
          height={420}
        />
      </div>
      <div className="mt-8 max-w-lg space-y-4 px-4">
        <BodyCopy>
          Configuration to set the stake multiplier for given mints. Does your
          collection include rarity? For example let’s double (2x) the reward
          rate for some legendary NFTs.
        </BodyCopy>
        <BodyCopy>
          Information about boosted reward rate in your Stake Pool will be
          visible on users assets when browsing your Stake Pool page.
        </BodyCopy>
        <BodyCopy textSize={SMALL}>
          For a 1x multiplier, enter value 100, for a 2x multiplier enter value
          200 ... <br /> <br /> For decimal multipliers, work with the
          multiplierDecimals of the reward distributor. If you set
          multiplierDecimals = 1, then for 1.5x multiplier, enter value 15 so
          that value/10**multiplierDecimals = 15/10^1 = 1.5 <br /> <br />
          NOTE that for 1.5x, you could set multiplierDecimals = 2 and enter
          value 150, or multiplierDecimals = 3 and enter value 1500...
        </BodyCopy>
      </div>
    </>
  )
}
