import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export const TipThree = () => {
  return (
    <>
      <div className="xl:pr-40">
        <Image
          src="/images/stake-pool-creation/authorization/tip-three.png"
          height={700}
          width={700}
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
