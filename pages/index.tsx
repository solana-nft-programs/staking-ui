import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

import Homepage from '../components/Homepage'
import StakePoolHome from './[stakePoolId]'

function Home() {
  const { data: stakePoolMetadata } = useStakePoolMetadata()
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
