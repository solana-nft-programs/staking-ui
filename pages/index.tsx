import { useStakePoolMetadataCtx } from 'providers/StakePoolMetadataProvider'

import Homepage from '../components/Homepage'
import StakePoolHome from './kureiji'

function Home() {
  const { stakePoolMetadata } = useStakePoolMetadataCtx()
  return <div>{stakePoolMetadata ? <StakePoolHome /> : <Homepage />}</div>
}

export default Home
