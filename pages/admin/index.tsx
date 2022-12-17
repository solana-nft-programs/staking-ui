import Admin from 'components/Admin'
import { useStakePoolMetadataCtx } from 'providers/StakePoolMetadataProvider'

import AdminStakePool from './[stakePoolId]'

function Home() {
  const { stakePoolMetadata } = useStakePoolMetadataCtx()
  return <>{stakePoolMetadata ? <AdminStakePool /> : <Admin />}</>
}

export default Home
