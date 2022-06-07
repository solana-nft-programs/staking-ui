import { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import { lighten } from 'polished'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { Popover, PopoverItem } from './Popover'
import { pubKeyUrl } from './utils'
import { FiExternalLink } from 'react-icons/fi'
import Tooltip from '@mui/material/Tooltip'
import { LoadingSpinner } from './LoadingSpinner'
import { FaEllipsisH } from 'react-icons/fa'
import { useState } from 'react'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { getColorByBgColor } from './Button'
import { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { AccountData } from '@cardinal/common'
import { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { TokenListData } from 'hooks/useTokenList'
import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js'

interface QuickActionsProps {
  stakeEntry?: AccountData<StakeEntryData> | null | undefined
  tokenAccount?: {
    pubkey: PublicKey
    account: AccountInfo<ParsedAccountData>
  }
}

export const QuickActions = ({
  tokenData,
}: {
  tokenData: QuickActionsProps
}) => {
  const [loading, setLoading] = useState(false)
  const ctx = useEnvironmentCtx()
  const { data: stakePoolMetadata } = useStakePoolMetadata()

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
                color: 'white',
              }}
              className="justify-between"
              href={pubKeyUrl(
                tokenData.tokenAccount
                  ? tokenData.tokenAccount?.account.data.parsed.info.mint
                  : tokenData.stakeEntry?.parsed.originalMint,
                ctx.environment.label
              )}
              target="_blank"
              rel="noreferrer"
            >
              View
              <FiExternalLink />
            </a>
          </PopoverItem>
        </div>
      }
    >
      <Tooltip placement="bottom-start" title="Quick Actions">
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
            tokenData.tokenAccount
              ? tokenData.tokenAccount?.account.data.parsed.info.mint.toString()
              : tokenData.stakeEntry?.parsed.originalMint.toString()
          }
        >
          {loading ? <LoadingSpinner height="26px" /> : <FaEllipsisH />}
        </div>
      </Tooltip>
    </Popover>
  )
}
