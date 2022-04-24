import { useWallet } from '@solana/wallet-adapter-react'
import {
  useWalletModal,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { AddressImage, DisplayAddress } from '@cardinal/namespaces-components'

import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'
import { firstParam, shortPubKey } from './utils'
import { HiUserCircle } from 'react-icons/hi'
import { stakePoolMetadatas } from 'api/mapping'
import { Airdrop } from './Airdrop'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

export const Header = () => {
  const router = useRouter()
  const { stakePoolId } = router.query
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()
  const { setVisible } = useWalletModal()
  const [tab, setTab] = useState<string>('wallet')
  const [headerName, setHeaderName] = useState('Cardinal')
  const { data: stakePoolMetadata } = useStakePoolMetadata()

  useEffect(() => {
    const anchor = router.asPath.split('#')[1]
    if (anchor !== tab) setTab(anchor || 'wallet')
  }, [router.asPath, tab])

  const walletAddressFormatted = wallet?.publicKey
    ? shortPubKey(wallet?.publicKey)
    : ''

  const nameMapping = stakePoolMetadatas.find(
    (p) => p.name === (stakePoolId as String)
  )
  const addressMapping = stakePoolMetadatas.find(
    (p) => p.pubkey.toString() === (stakePoolId as String)
  )
  useEffect(() => {
    if (stakePoolId) {
      const setData = async () => {
        try {
          setHeaderName(
            nameMapping?.displayName ||
              addressMapping?.displayName ||
              shortPubKey(firstParam(stakePoolId))
          )
        } catch (e) {
          console.log(e)
        }
      }
      setData().catch(console.error)
    }
  }, [stakePoolId])

  return (
    <div className={`flex h-20 justify-between pl-5 text-white`}>
      <div className="flex items-center gap-3">
        <a
          href={
            nameMapping?.websiteUrl ||
            addressMapping?.websiteUrl ||
            `/${
              ctx.environment.label !== 'mainnet'
                ? `?cluster=${ctx.environment.label}`
                : ''
            }`
          }
          className="cursor-pointer text-xl font-semibold text-white hover:text-gray-400"
        >
          {headerName} Staking UI
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
      <div className="relative my-auto flex items-center pr-8 align-middle">
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
              <div style={{ color: 'gray' }}>{walletAddressFormatted}</div>
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
