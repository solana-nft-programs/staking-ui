import { shortPubKey } from '@cardinal/namespaces-components'
import { useStakePoolId } from 'hooks/useStakePoolId'

import { HeroStats } from '../components/HeroStats'

export const HeroSmall: React.FC = () => {
  const stakePoolId = useStakePoolId()
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-16 py-8 px-4 lg:justify-between lg:px-10">
      <div className="flex items-center gap-4">
        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-border bg-dark-5">
          {/* <img
            className={`w-full  ${config.logoPadding && 'p-3'}`}
            src={config.logoImage}
            alt={config.name}
          /> */}
        </div>
        <div className="text-3xl text-light-0">{shortPubKey(stakePoolId)}</div>
      </div>
      <HeroStats />
    </div>
  )
}
