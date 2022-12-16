import { InformationCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

import { BodyCopy } from '@/components/UI/typography/BodyCopy'

export const AdditionalStakeConditionsTipTwo = () => {
  return (
    <>
      <div className="flex max-w-2xl flex-col items-center px-16 pb-8">
        <Image
          src="/images/stake-pool-creation/additional-stake-conditions/tip-two.png"
          height={350}
          width={300}
          objectFit="contain"
        />
      </div>
      <BodyCopy className="flex items-center pt-8">
        <InformationCircleIcon className="mr-2 h-4 w-4 text-white" />
        Provide text to display over the receipt received for tokens staked.
      </BodyCopy>
    </>
  )
}
