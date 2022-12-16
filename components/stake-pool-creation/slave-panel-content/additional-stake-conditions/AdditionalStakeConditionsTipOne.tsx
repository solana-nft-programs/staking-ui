import { InformationCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

import { BodyCopy } from '@/components/UI/typography/BodyCopy'

export const AdditionalStakeConditionsTipOne = () => {
  return (
    <>
      <div className="flex max-w-2xl flex-col items-center px-16 pb-8">
        <div className="self-start text-white">Receipt</div>
        <BodyCopy>
          Stakers will receive a dynamically generated NFT receipt representing
          their staked assets (token will leave user’s wallet).
        </BodyCopy>
        <Image
          src="/images/stake-pool-creation/additional-stake-conditions/tip-one-a.png"
          height={250}
          width={600}
          objectFit="contain"
        />
      </div>
      <div className="flex max-w-2xl flex-col items-center px-16">
        <div className="self-start text-white">Original</div>
        <BodyCopy>
          Staked tokens will NOT leave user’s wallet, however, a non-revokable
          time lock will be applied to an asset.
        </BodyCopy>
        <Image
          src="/images/stake-pool-creation/additional-stake-conditions/tip-one-b.png"
          height={250}
          width={600}
          objectFit="contain"
        />
      </div>
      <BodyCopy className="flex items-center pt-4">
        <InformationCircleIcon className="mr-2 h-4 w-4 text-white" />
        Choose between the RECEIPT and ORIGINAL modes for your Stake Pool.
      </BodyCopy>
    </>
  )
}
