import { lighten } from 'polished'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { Airdrop } from './Airdrop'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { styled } from '@mui/system'
import { AccountConnect } from '@cardinal/namespaces-components'
import { Wallet } from '@saberhq/solana-contrib'
import { useStakePoolId } from 'hooks/useStakePoolId'
import { useUTCNow } from 'providers/UTCNowProvider'
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
          className="flex w-full items-center justify-center rounded-md text-center"
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
      <div className={`flex justify-end px-5 text-white`}>
        <div className="flex flex-col cols-1">
          <div className="relative my-auto flex gap-3 align-middle">
            <div className="flex flex-row gap-3 mt-2 h-6">
              {stakePoolId && stakePoolMetadata ? (
                stakePoolMetadata.links?.map((link) => (
                  <a key={link.value} href={link.value}>
                    <p className="my-auto mr-10 hover:cursor-pointer">
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
              {ctx.environment.label !== 'mainnet-beta' && (
                <div className="cursor-pointer rounded-md bg-[#9945ff] p-1 text-[10px] italic text-white">
                  {ctx.environment.label}
                </div>
              )}
              {ctx.environment.label !== 'mainnet-beta' ? (
                <Airdrop />
              ) : (
                ''
              )}
            </div>
            <div className="flex flex-col cols-1 mt-2 pr-5">
              {(wallet.connected && wallet.publicKey) && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
