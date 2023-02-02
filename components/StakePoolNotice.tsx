import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { defaultSecondaryColor } from 'api/mapping'
import { contrastify } from 'common/colors'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

export const StakePoolNotice = () => {
  const wallet = useWallet()
  const walletModal = useWalletModal()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const { data: stakePool, isFetched: stakePoolLoaded } = useStakePoolData()

  return (
    <>
      {(!stakePool && stakePoolLoaded) || stakePoolMetadata?.notFound ? (
        <div
          className="rounded-md border-[1px] bg-opacity-40 p-4 text-center text-lg font-semibold"
          style={{
            background:
              stakePoolMetadata?.colors?.secondary || defaultSecondaryColor,
            color: stakePoolMetadata?.colors?.fontColor,
            borderColor: contrastify(
              0.5,
              stakePoolMetadata?.colors?.secondary || defaultSecondaryColor
            ),
          }}
        >
          Stake pool not found
        </div>
      ) : (
        !wallet.connected && (
          <div
            className={`cursor-pointer rounded-md border-[1px]  p-4 text-center text-lg font-semibold ${
              stakePoolMetadata?.colors?.accent &&
              stakePoolMetadata?.colors.fontColor
                ? ''
                : 'border-yellow-500 bg-yellow-500 bg-opacity-40'
            }`}
            style={
              stakePoolMetadata?.colors?.accent &&
              stakePoolMetadata?.colors.fontColor
                ? {
                    background: stakePoolMetadata?.colors?.secondary,
                    borderColor: stakePoolMetadata?.colors?.accent,
                    color:
                      stakePoolMetadata?.colors?.fontColorSecondary ||
                      stakePoolMetadata?.colors?.fontColor,
                  }
                : {}
            }
            onClick={() => walletModal.setVisible(true)}
          >
            Connect wallet to continue
          </div>
        )
      )}
    </>
  )
}
