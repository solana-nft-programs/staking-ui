import { InformationCircleIcon } from '@heroicons/react/24/solid'

import { PrimaryTipLayout } from '@/components/stake-pool-creation/tip-layout/PrimaryTipLayout'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'

export const Intro = () => {
  return (
    <PrimaryTipLayout title="Cardinal Team">
      <LargeCopy>
        To display useful tips here simply click on the icon next to a{' '}
        <InformationCircleIcon className="inline-block h-7 w-7 text-gray-500" />{' '}
        in a particular setting during the Stake Pool creation flow.
      </LargeCopy>
    </PrimaryTipLayout>
  )
}
