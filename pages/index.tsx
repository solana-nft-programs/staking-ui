import { useStakePoolMetadataCtx } from 'providers/StakePoolMetadataProvider'

import Homepage from '../components/Homepage'
import StakePoolHome from './[stakePoolId]'

function Home() {
  const { stakePoolMetadata } = useStakePoolMetadataCtx()
  return (
    <div>
      {stakePoolMetadata ? (
        <StakePoolHome
          stakePoolMetadataName={stakePoolMetadata.displayName ?? null}
        />
      ) : (
        <Homepage />
      )}
    </div>
  )
}

export default Home
