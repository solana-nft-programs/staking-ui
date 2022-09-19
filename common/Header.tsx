import { AccountConnect } from '@cardinal/namespaces-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { GlyphWallet } from 'assets/GlyphWallet'
import { useStakePoolId } from 'hooks/useStakePoolId'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { Airdrop } from './Airdrop'
import { ButtonSmall } from './ButtonSmall'
import { contrastColorMode } from './utils'
import { asWallet } from './Wallets'

export const Header = () => {
  const router = useRouter()
  const { environment, secondaryConnection } = useEnvironmentCtx()
  const wallet = useWallet()
  const walletModal = useWalletModal()
  const stakePoolId = useStakePoolId()
  const { data: stakePoolMetadata } = useStakePoolMetadata()

  return (
    <div>
      <div
        className={`mb-5 flex flex-wrap justify-between gap-6 px-5 pt-5 text-white`}
        style={{ color: stakePoolMetadata?.colors?.fontColor }}
      >
        <div className="flex items-center gap-3">
          <a
            target="_blank"
            href={
              stakePoolMetadata?.websiteUrl ||
              `/${
                environment.label !== 'mainnet-beta'
                  ? `?cluster=${environment.label}`
                  : ''
              }`
            }
            className="flex cursor-pointer text-xl font-semibold"
            rel="noreferrer"
          >
            {stakePoolMetadata?.imageUrl ? (
              <>
                <div className="flex flex-row">
                  <img
                    className="flex h-[35px] flex-col rounded-lg"
                    src={stakePoolMetadata?.imageUrl}
                    alt={stakePoolMetadata?.imageUrl}
                  />
                  {stakePoolMetadata.nameInHeader && (
                    <span
                      className="ml-5 mt-1 flex flex-col"
                      style={{ color: stakePoolMetadata?.colors?.fontColor }}
                    >
                      {stakePoolMetadata?.displayName}
                    </span>
                  )}
                </div>
                {stakePoolMetadata?.secondaryImageUrl && (
                  <div className="ml-2 flex flex-row">
                    <img
                      className="flex h-[35px] flex-col"
                      src={stakePoolMetadata?.secondaryImageUrl}
                      alt={stakePoolMetadata?.secondaryImageUrl}
                    />
                    {stakePoolMetadata.nameInHeader && (
                      <span
                        className="ml-5 mt-1 flex flex-col"
                        style={{ color: stakePoolMetadata?.colors?.fontColor }}
                      >
                        {stakePoolMetadata?.displayName}
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 text-white">
                {stakePoolMetadata?.displayName || (
                  <img
                    alt={'/cardinal-crosshair.svg'}
                    className="inline-block w-4"
                    src={'/cardinal-crosshair.svg'}
                  />
                )}{' '}
                Staking
              </div>
            )}
          </a>
          {environment.label !== 'mainnet-beta' && (
            <div className="cursor-pointer rounded-md bg-[#9945ff] p-1 text-[10px] italic text-white">
              {environment.label}
            </div>
          )}
          {environment.label !== 'mainnet-beta' ? (
            <div className="mt-0.5">
              <Airdrop />
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="relative my-auto flex flex-wrap items-center gap-y-6 align-middle">
          <div className="mr-10 flex flex-wrap items-center justify-center gap-8">
            {stakePoolId && stakePoolMetadata ? (
              stakePoolMetadata.links?.map((link) => (
                <a
                  key={link.value}
                  href={link.value}
                  className="cursor-pointer transition-all hover:opacity-80"
                >
                  <p style={{ color: stakePoolMetadata?.colors?.fontColor }}>
                    {link.text}
                  </p>
                </a>
              ))
            ) : (
              <>
                <div
                  onClick={() =>
                    router.push(
                      `/admin${
                        environment.label !== 'mainnet-beta'
                          ? `?cluster=${environment.label}`
                          : ''
                      }`
                    )
                  }
                >
                  <p className="my-auto mr-10 hover:cursor-pointer">Admin</p>
                </div>
              </>
            )}
          </div>
          {wallet.connected && wallet.publicKey ? (
            <AccountConnect
              dark={
                stakePoolMetadata?.colors?.backgroundSecondary
                  ? contrastColorMode(stakePoolMetadata?.colors?.primary)[1]
                  : true
              }
              connection={secondaryConnection}
              environment={environment.label}
              handleDisconnect={() => wallet.disconnect()}
              wallet={asWallet(wallet)}
            />
          ) : (
            <ButtonSmall
              className="text-xs"
              onClick={() => walletModal.setVisible(true)}
            >
              <>
                <GlyphWallet />
                <div className="text-white">Connect wallet</div>
              </>
            </ButtonSmall>
          )}
        </div>
      </div>
    </div>
  )
}
