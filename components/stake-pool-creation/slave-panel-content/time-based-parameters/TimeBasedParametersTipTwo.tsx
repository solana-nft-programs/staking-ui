import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import Image from 'next/image'

export const TimeBasedParametersTipTwo = () => {
  return (
    <>
      <Image
        src="/images/stake-pool-creation/time-based-parameters/tip-two.png"
        objectFit="contain"
        width={500}
        height={400}
      />
      <BodyCopy className="mt-8 max-w-lg">
        The cooldown period is the timeframe before the newly unstaked tokens
        are available to withdraw. If your Stake Pool has no cooldown period,
        then stakers can unstake and receive their assets at any time.
      </BodyCopy>
    </>
  )
}
