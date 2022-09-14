import Admin from 'components/Admin'
import { useStakePoolMetadataCtx } from 'providers/StakePoolMetadataProvider'

import AdminStakePool from './[stakePoolId]'

function Home() {
  const { stakePoolMetadata } = useStakePoolMetadataCtx()
  return <div>{stakePoolMetadata ? <AdminStakePool /> : <Admin />}</div>
}

export default Home
