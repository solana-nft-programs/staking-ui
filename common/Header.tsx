import { AccountConnect } from '@cardinal/namespaces-components'
import { styled } from '@mui/system'
import type { Wallet } from '@saberhq/solana-contrib'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useStakePoolId } from 'hooks/useStakePoolId'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useRouter } from 'next/router'
import { lighten } from 'polished'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useUTCNow } from 'providers/UTCNowProvider'

import { Airdrop } from './Airdrop'
import { contrastColorMode } from './utils'

export const StyledWalletButton = styled(WalletMultiButton)`
  color: rgb(55, 65, 81, 1);
  &:hover {
    background: none !important;
  }
  .wallet-adapter-button {
    padding: 0px;
  }
`
export const TitleText = styled('div')`
  @media (max-width: 550px) {
    font-size: 14px;
  }
`

export const Header = () => {
  const router = useRouter()
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()
  const stakePoolId = useStakePoolId()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const { clockDrift } = useUTCNow()

  return (
    <div>
      {clockDrift && (
        <div
          className="flex w-full items-center justify-center rounded-md py-2 text-center"
          style={{
            color: stakePoolMetadata?.colors?.secondary,
            background: lighten(
              0.15,
              stakePoolMetadata?.colors?.primary || '#000'
            ),
          }}
        >
          <div className="text-xs font-semibold text-yellow-500">
            Warning{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://status.solana.com/"
              className="text-blue-400"
            >
              Solana
            </a>{' '}
            clock is {Math.floor(clockDrift / 60)} minutes{' '}
            {clockDrift > 0 ? 'behind' : 'ahead'}. Rewards are now shown aligned
            to solana clock.
          </div>
        </div>
      )}
      <div
        className={`flex h-20 justify-between px-5 text-white`}
        style={{ color: stakePoolMetadata?.colors?.fontColor }}
      >
        <div className="flex items-center gap-3">
          <a
            target="_blank"
            href={
              stakePoolMetadata?.websiteUrl ||
              `/${
                ctx.environment.label !== 'mainnet-beta'
                  ? `?cluster=${ctx.environment.label}`
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
              <TitleText className="flex items-center justify-center gap-2">
                {stakePoolMetadata?.displayName || (
                  <img
                    alt={'/cardinal-crosshair.svg'}
                    className="inline-block w-4"
                    src={'/cardinal-crosshair.svg'}
                  />
                )}{' '}
                Staking
              </TitleText>
            )}
          </a>
          {ctx.environment.label !== 'mainnet-beta' && (
            <div className="cursor-pointer rounded-md bg-[#9945ff] p-1 text-[10px] italic text-white">
              {ctx.environment.label}
            </div>
          )}
          {ctx.environment.label !== 'mainnet-beta' ? (
            <div className="mt-0.5">
              <Airdrop />
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="relative my-auto hidden items-center align-middle sm:flex">
          {stakePoolId && stakePoolMetadata ? (
            stakePoolMetadata.links?.map((link) => (
              <a key={link.value} href={link.value}>
                <p
                  style={{ color: stakePoolMetadata?.colors?.fontColor }}
                  className="my-auto mr-10 hover:cursor-pointer"
                >
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
                      ctx.environment.label !== 'mainnet-beta'
                        ? `?cluster=${ctx.environment.label}`
                        : ''
                    }`
                  )
                }
              >
                <p className="my-auto mr-10 hover:cursor-pointer">Admin</p>
              </div>
            </>
          )}
          {wallet.connected && wallet.publicKey ? (
            <AccountConnect
              dark={
                stakePoolMetadata?.colors?.backgroundSecondary
                  ? contrastColorMode(stakePoolMetadata?.colors?.primary)[1]
                  : true
              }
              connection={ctx.secondaryConnection}
              environment={ctx.environment.label}
              handleDisconnect={() => wallet.disconnect()}
              wallet={wallet as Wallet}
            />
          ) : (
            <StyledWalletButton
              style={{
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
    </div>
  )
}
