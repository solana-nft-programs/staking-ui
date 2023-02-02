import { contrastify, tryPublicKey } from '@cardinal/common'
import type { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { useHandleClaimRewards } from 'handlers/useHandleClaimRewards'
import { useHandleStake } from 'handlers/useHandleStake'
import { useHandleUnstake } from 'handlers/useHandleUnstake'
import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { lighten } from 'polished'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { AiFillLock, AiFillUnlock, AiOutlineDatabase } from 'react-icons/ai'
import { BsBookmarkCheck } from 'react-icons/bs'
import { FaEllipsisH } from 'react-icons/fa'
import { FiExternalLink } from 'react-icons/fi'
import { RiMoneyDollarCircleFill } from 'react-icons/ri'

import { LoadingSpinner } from './LoadingSpinner'
import { Popover, PopoverItem } from './Popover'
import { metadataUrl, pubKeyUrl } from './utils'

export const QuickActions = ({
  unstakedTokenData,
  stakedTokenData,
  receiptType,
  selectUnstakedToken,
  selectStakedToken,
}: {
  unstakedTokenData?: AllowedTokenData
  stakedTokenData?: StakeEntryTokenData
  receiptType?: ReceiptType
  selectUnstakedToken: (tk: AllowedTokenData) => void
  selectStakedToken: (tk: StakeEntryTokenData) => void
}) => {
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const ctx = useEnvironmentCtx()
  const handleStake = useHandleStake()
  const handleUnstake = useHandleUnstake()
  const handleClaimRewards = useHandleClaimRewards()

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
            color: contrastify(1, stakePoolMetadata?.colors?.primary || '#000'),
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
              href={pubKeyUrl(
                unstakedTokenData?.tokenAccount
                  ? tryPublicKey(unstakedTokenData.tokenAccount.parsed.mint)
                  : stakedTokenData!.stakeEntry?.parsed?.stakeMint,
                ctx.environment.label
              )}
              target="_blank"
              rel="noreferrer"
            >
              <FiExternalLink />
              View
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
                href={metadataUrl(
                  unstakedTokenData?.tokenAccount
                    ? tryPublicKey(unstakedTokenData.tokenAccount.parsed.mint)
                    : stakedTokenData!.stakeEntry?.parsed?.stakeMint,
                  ctx.environment.label
                )}
                target="_blank"
                rel="noreferrer"
              >
                <AiOutlineDatabase />
                Metadata
              </a>
            </PopoverItem>
          )}
          {!(
            (unstakedTokenData?.tokenAccount?.parsed.tokenAmount.amount ?? 0) >
            1
          ) && (
            <PopoverItem>
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={async () => {
                  if (unstakedTokenData) selectUnstakedToken(unstakedTokenData)
                  else if (stakedTokenData) selectStakedToken(stakedTokenData)
                }}
              >
                <BsBookmarkCheck />
                Select
              </div>
            </PopoverItem>
          )}
          {unstakedTokenData?.tokenAccount && (
            <PopoverItem>
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={async () => {
                  handleStake.mutate({
                    tokenDatas: [unstakedTokenData],
                    receiptType,
                  })
                }}
              >
                <AiFillLock />
                Stake
              </div>
            </PopoverItem>
          )}
          {stakedTokenData?.stakeEntry && (
            <PopoverItem>
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={async () => {
                  handleClaimRewards.mutate({ tokenDatas: [stakedTokenData] })
                }}
              >
                <RiMoneyDollarCircleFill />
                Claim Rewards
              </div>
            </PopoverItem>
          )}
          {stakedTokenData?.stakeEntry && (
            <PopoverItem>
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={async () => {
                  handleUnstake.mutate({ tokenDatas: [stakedTokenData] })
                }}
              >
                <AiFillUnlock />
                Unstake
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
          unstakedTokenData?.tokenAccount?.parsed.mint.toString() ??
          stakedTokenData?.stakeEntry?.parsed?.stakeMint.toString()
        }
      >
        {handleClaimRewards.isLoading ||
        handleUnstake.isLoading ||
        handleStake.isLoading ? (
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
