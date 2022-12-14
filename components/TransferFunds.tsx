import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { AsyncButton } from 'common/Button'
import { notify } from 'common/Notification'
import { tryFormatInput, tryParseInput } from 'common/units'
import { useHandleTransferFunds } from 'handlers/useHandleTransferFunds'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardDistributorTokenAccount } from 'hooks/useRewardDistributorTokenAccount'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { useState } from 'react'

export const TransferFunds = () => {
  const [transferAmount, setTransferAmount] = useState<string>()
  const rewardMintInfo = useRewardMintInfo()
  const rewardDistributor = useRewardDistributorData()
  const rewardDistributorTokenAccount = useRewardDistributorTokenAccount()
  const handleTransferFunds = useHandleTransferFunds()
  if (
    !rewardDistributor.data ||
    rewardDistributor.data.parsed?.kind !== RewardDistributorKind.Treasury
  ) {
    return <></>
  }
  return (
    <div>
      <label
        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
        htmlFor="require-authorization"
      >
        Transfer Funds
      </label>
      <div className="mb-5 flex flex-row">
        <div
          className={`flex appearance-none justify-between rounded border border-gray-500 bg-gray-700 py-2 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
        >
          <input
            className={`mr-5 w-full bg-transparent focus:outline-none`}
            type="text"
            placeholder={'1000000'}
            value={tryFormatInput(
              transferAmount,
              rewardMintInfo.data?.mintInfo.decimals || 0,
              '0'
            )}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (Number.isNaN(value)) {
                notify({
                  message: `Invalid reclaim amount`,
                  type: 'error',
                })
                return
              }
              setTransferAmount(
                tryParseInput(
                  e.target.value,
                  rewardMintInfo.data?.mintInfo.decimals || 0,
                  transferAmount ?? ''
                )
              )
            }}
          />
        </div>
        <AsyncButton
          className="ml-5 rounded-md px-3 py-1"
          loading={handleTransferFunds.isLoading}
          inlineLoader
          onClick={() =>
            handleTransferFunds.mutate({
              transferAmount: Number(transferAmount),
            })
          }
        >
          <div className="text-xs">Transfer Funds</div>
        </AsyncButton>
      </div>
    </div>
  )
}
