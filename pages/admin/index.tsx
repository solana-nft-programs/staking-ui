import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

import Admin from '@/components/admin/Admin'

import AdminStakePool from './[stakePoolId]'

function Home() {
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  return <>{stakePoolMetadata ? <AdminStakePool /> : <Admin />}</>
}

export default Home
