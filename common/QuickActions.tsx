import { claimRewards, executeTransaction } from '@cardinal/staking'
import type { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import type { Wallet } from '@metaplex/js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHandleStake } from 'handlers/useHandleStake'
import { useHandleUnstake } from 'handlers/useHandleUnstake'
import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardDistributorTokenAccount } from 'hooks/useRewardDistributorTokenAccount'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { lighten } from 'polished'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import { AiFillLock, AiFillUnlock, AiOutlineDatabase } from 'react-icons/ai'
import { BsBookmarkCheck } from 'react-icons/bs'
import { FaEllipsisH } from 'react-icons/fa'
import { FiExternalLink } from 'react-icons/fi'
import { RiMoneyDollarCircleFill } from 'react-icons/ri'

import { getColorByBgColor } from './Button'
import { LoadingSpinner } from './LoadingSpinner'
import { notify } from './Notification'
import { Popover, PopoverItem } from './Popover'
import { metadataUrl, pubKeyUrl } from './utils'

export const QuickActions = ({
  unstakedTokenData,
  stakedTokenData,
  receiptType,
  showFungibleTokens,
  setLoadingClaimRewards,
  setSingleTokenAction,
  selectUnstakedToken,
  selectStakedToken,
}: {
  unstakedTokenData?: AllowedTokenData
  stakedTokenData?: StakeEntryTokenData
  receiptType: ReceiptType
  showFungibleTokens: boolean
  setLoadingClaimRewards: Dispatch<SetStateAction<boolean>>
  setSingleTokenAction: Dispatch<SetStateAction<string>>
  selectUnstakedToken: (tk: AllowedTokenData) => void
  selectStakedToken: (tk: StakeEntryTokenData) => void
}) => {
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const { data: stakePool } = useStakePoolData()
  const [loading, setLoading] = useState(false)
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()
  const rewardDistributorData = useRewardDistributorData()
  const rewardDistributorTokenAccountData = useRewardDistributorTokenAccount()
  const handleStake = useHandleStake()
  const handleUnstake = useHandleUnstake()

  return (
    <Popover
      content={
        <div
          className="flex flex-col rounded-md px-1 py-1"
          style={{
            background: lighten(
              0.07,
              stakePoolMetadata?.colors?.primary || '#000'
            ),
            color: getColorByBgColor(
              stakePoolMetadata?.colors?.primary || '#000'
            ),
          }}
        >
          <PopoverItem>
            <a
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: stakePoolMetadata?.colors?.fontColor
                  ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                  : 'white',
              }}
              className="justify-between"
              href={pubKeyUrl(
                unstakedTokenData?.tokenAccount
                  ? unstakedTokenData.tokenAccount.account.data.parsed.info.mint
                  : stakedTokenData!.stakeEntry?.parsed.originalMint,
                ctx.environment.label
              )}
              target="_blank"
              rel="noreferrer"
            >
              View
              <FiExternalLink />
            </a>
          </PopoverItem>
          {ctx.environment.label !== 'devnet' && (
            <PopoverItem>
              <a
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: stakePoolMetadata?.colors?.fontColor
                    ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                    : 'white',
                }}
                className="justify-between"
                href={metadataUrl(
                  unstakedTokenData?.tokenAccount
                    ? unstakedTokenData.tokenAccount.account.data.parsed.info
                        .mint
                    : stakedTokenData!.stakeEntry?.parsed.originalMint,
                  ctx.environment.label
                )}
                target="_blank"
                rel="noreferrer"
              >
                Metadata
                <AiOutlineDatabase />
              </a>
            </PopoverItem>
          )}
          {!showFungibleTokens && (
            <PopoverItem>
              <div
                className="flex cursor-pointer items-center justify-between gap-2"
                onClick={async () => {
                  if (unstakedTokenData) selectUnstakedToken(unstakedTokenData)
                  else if (stakedTokenData) selectStakedToken(stakedTokenData)
                }}
              >
                Select
                <BsBookmarkCheck />
              </div>
            </PopoverItem>
          )}
          {unstakedTokenData?.tokenAccount && (
            <PopoverItem>
              <div
                className="flex cursor-pointer items-center justify-between gap-2"
                onClick={async () => {
                  handleStake.mutate({
                    tokenDatas: [unstakedTokenData],
                    receiptType,
                  })
                }}
              >
                Stake
                <AiFillLock />
              </div>
            </PopoverItem>
          )}
          {stakedTokenData?.stakeEntry && (
            <PopoverItem>
              <div
                className="flex cursor-pointer items-center justify-between gap-2"
                onClick={async () => {
                  if (!wallet) {
                    notify({ message: `Wallet not connected`, type: 'error' })
                    return
                  }
                  if (!stakePool) {
                    notify({ message: `Wallet not connected`, type: 'error' })
                    return
                  }
                  setLoading(true)
                  setSingleTokenAction(
                    stakedTokenData.stakeEntry!.parsed.originalMint.toString()
                  )
                  setLoadingClaimRewards(true)

                  try {
                    if (!stakedTokenData || !stakedTokenData.stakeEntry) {
                      throw new Error('No stake entry for token')
                    }
                    const tx = await claimRewards(
                      ctx.connection,
                      wallet as Wallet,
                      {
                        stakePoolId: stakePool.pubkey,
                        stakeEntryId: stakedTokenData.stakeEntry.pubkey,
                      }
                    )
                    await executeTransaction(
                      ctx.connection,
                      wallet as Wallet,
                      tx,
                      {}
                    )
                    rewardDistributorData.remove()
                    rewardDistributorTokenAccountData.remove()
                    setLoadingClaimRewards(false)
                    setLoading(false)
                    setSingleTokenAction('')
                    notify({
                      message: 'Successfully claimed rewards',
                      type: 'success',
                    })
                  } catch (e) {
                    notify({
                      message: `${e}`,
                      description: `Failed to claim rewards for token ${stakedTokenData.stakeEntry?.pubkey.toString()}`,
                      type: 'error',
                    })
                    return null
                  }
                }}
              >
                Claim Rewards
                <RiMoneyDollarCircleFill />
              </div>
            </PopoverItem>
          )}
          {stakedTokenData?.stakeEntry && (
            <PopoverItem>
              <div
                className="flex cursor-pointer items-center justify-between gap-2"
                onClick={async () => {
                  handleUnstake.mutate({ tokenDatas: [stakedTokenData] })
                }}
              >
                Unstake
                <AiFillUnlock />
              </div>
            </PopoverItem>
          )}
        </div>
      }
    >
      <div
        className={`absolute top-2 right-2 z-50 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md text-xs text-white`}
        style={{
          transition: '0.2s all',
          background: lighten(
            0.07,
            stakePoolMetadata?.colors?.primary || '#000'
          ),
        }}
        key={
          unstakedTokenData?.tokenAccount
            ? unstakedTokenData.tokenAccount?.account.data.parsed.info.mint.toString()
            : unstakedTokenData?.stakeEntry?.parsed.originalMint.toString()
        }
      >
        {loading || handleUnstake.isLoading || handleStake.isLoading ? (
          <div>
            <LoadingSpinner
              fill={
                stakePoolMetadata?.colors?.fontColor
                  ? stakePoolMetadata?.colors?.fontColor
                  : '#FFF'
              }
              height="15px"
            />
          </div>
        ) : (
          <div
            style={{
              color: stakePoolMetadata?.colors?.fontColor
                ? stakePoolMetadata?.colors?.fontColor
                : 'white',
            }}
          >
            <FaEllipsisH />
          </div>
        )}
      </div>
    </Popover>
  )
}
