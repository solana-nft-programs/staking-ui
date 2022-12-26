import { InformationCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

import { BodyCopy } from '@/components/UI/typography/BodyCopy'

export const AuthorizationTipThree = () => {
  return (
    <>
      <div className="pr-16 xl:pr-80">
        <Image
          src="/images/stake-pool-creation/authorization/tip-three.png"
          height={600}
          width={600}
          layout="fixed"
          objectFit="contain"
        />
      </div>
      <BodyCopy className="flex items-center justify-center text-center">
        <InformationCircleIcon className="mr-2 inline-block h-6 w-6" />
        Allow any NFTs to be staked in your pool with collection addresses
        specified.
      </BodyCopy>
    </>
  )
}
