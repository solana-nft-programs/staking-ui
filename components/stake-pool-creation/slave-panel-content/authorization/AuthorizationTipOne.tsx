import { InformationCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

import { BodyCopy } from '@/components/UI/typography/BodyCopy'

export const AuthorizationTipOne = () => {
  return (
    <>
      <div className="pl-16 xl:pl-80">
        <Image
          src="/images/stake-pool-creation/authorization/tip-one.png"
          height={600}
          width={600}
          layout="fixed"
          objectFit="contain"
        />
      </div>
      <BodyCopy className="flex items-center justify-center text-center">
        <InformationCircleIcon className="mr-2 inline-block h-6 w-6" />
        Allow for staking any tokens with specified by you creator address(es).
      </BodyCopy>
    </>
  )
}
