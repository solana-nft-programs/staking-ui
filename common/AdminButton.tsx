import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { AsyncButton } from './Button'

export const AdminButton = () => {
  const router = useRouter()
  const wallet = useWallet()
  const { environment } = useEnvironmentCtx()

  return (
    <AsyncButton
      disabled={!wallet.connected}
      className="rounded-md px-3 py-1"
      onClick={async () => {
        router.push(
          `/admin${environment.label === 'devnet' ? '?cluster=devnet' : ''}`
        )
      }}
    >
      <div className="text-xs">Admin</div>
    </AsyncButton>
  )
}
