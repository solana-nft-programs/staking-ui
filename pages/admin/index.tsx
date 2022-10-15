import Admin from 'components/Admin'
import { useStakePoolMetadataCtx } from 'providers/StakePoolMetadataProvider'

import AdminStakePool from './4N7HUCG4UzbG2sAJ6RUXkX3cEXvQ1T5ipdFdNY76bLnc'

function Home() {
  const { stakePoolMetadata } = useStakePoolMetadataCtx()
  return <div>{stakePoolMetadata ? <AdminStakePool /> : <Admin />}</div>
}

export default Home
