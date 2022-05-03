import { darken } from 'polished'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  useWalletModal,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { AddressImage, DisplayAddress } from '@cardinal/namespaces-components'

import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { shortPubKey } from './utils'
import { HiUserCircle } from 'react-icons/hi'
import { Airdrop } from './Airdrop'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

export const Header = () => {
  const router = useRouter()
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()
  const { setVisible } = useWalletModal()
  const { data: stakePoolMetadata } = useStakePoolMetadata()

  return (
    <div className={`flex h-20 justify-between px-20 text-white`}>
      <div className="flex items-center gap-3">
        <a
          target="_blank"
          href={
            stakePoolMetadata?.websiteUrl ||
            `/${
              ctx.environment.label !== 'mainnet'
                ? `?cluster=${ctx.environment.label}`
                : ''
            }`
          }
          className="flex cursor-pointer text-xl font-semibold text-white hover:text-gray-400"
        >
          {stakePoolMetadata?.imageUrl ? (
            <img className="h-[35px]" src={stakePoolMetadata?.imageUrl} />
          ) : (
            `${stakePoolMetadata?.displayName || 'Cardinal'} Staking UI`
          )}
        </a>
        {ctx.environment.label !== 'mainnet' && (
          <div className="cursor-pointer rounded-md bg-[#9945ff] p-1 text-[10px] italic text-white">
            {ctx.environment.label}
          </div>
        )}
        {ctx.environment.label !== 'mainnet' ? (
          <div className="mt-0.5">
            <Airdrop />
          </div>
        ) : (
          ''
        )}
      </div>
      <div className="relative my-auto flex items-center align-middle">
        <div
          onClick={() =>
            router.push(
              `/${
                ctx.environment.label !== 'mainnet'
                  ? `?cluster=${ctx.environment.label}`
                  : ''
              }`
            )
          }
        >
          <p className="my-auto mr-10 hover:cursor-pointer">Stake</p>
        </div>
        <div
          onClick={() =>
            router.push(
              `/admin${
                ctx.environment.label !== 'mainnet'
                  ? `?cluster=${ctx.environment.label}`
                  : ''
              }`
            )
          }
        >
          <p className="my-auto mr-10 hover:cursor-pointer">Admin</p>
        </div>
        {wallet.connected ? (
          <div
            className="flex cursor-pointer gap-2"
            onClick={() => setVisible(true)}
          >
            <AddressImage
              connection={ctx.connection}
              address={wallet.publicKey || undefined}
              height="40px"
              width="40px"
              dark={true}
              placeholder={
                <div
                  style={{
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginRight: '5px',
                  }}
                >
                  <div style={{ height: '40px', width: '40px' }}>
                    <HiUserCircle style={{ height: '100%', width: '100%' }} />
                  </div>
                </div>
              }
            />
            <div>
              <div className="text-white ">
                <DisplayAddress
                  style={{ pointerEvents: 'none' }}
                  connection={ctx.connection}
                  address={wallet.publicKey || undefined}
                  height="12px"
                  width="100px"
                  dark={true}
                />
              </div>
              <div style={{ color: 'gray' }}>
                {wallet?.publicKey ? shortPubKey(wallet?.publicKey) : ''}
              </div>
            </div>
          </div>
        ) : (
          <WalletMultiButton
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              zIndex: 10,
              height: '38px',
              border: 'none',
              background: 'none',
              backgroundColor: 'none',
            }}
          />
        )}
      </div>
    </div>
  )
}
