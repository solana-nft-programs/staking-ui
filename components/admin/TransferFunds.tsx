import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { notify } from 'common/Notification'
import { tryFormatInput, tryParseInput } from 'common/units'
import { useHandleTransferFunds } from 'handlers/useHandleTransferFunds'
import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from 'hooks/useRewardDistributorData'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { useState } from 'react'

import { TextInput } from '../UI/inputs/TextInput'

export const TransferFunds = () => {
  const [transferAmount, setTransferAmount] = useState<string>()
  const rewardMintInfo = useRewardMintInfo()
  const rewardDistributor = useRewardDistributorData()
  const handleTransferFunds = useHandleTransferFunds()
  if (
    !rewardDistributor.data ||
    (rewardDistributor.data.parsed?.kind === RewardDistributorKind.Mint &&
      !isRewardDistributorV2(rewardDistributor.data.parsed))
  ) {
    return <></>
  }
  return (
    <div>
      <FormFieldTitleInput
        title={'Transfer funds'}
        description={'Transfer funds to this reward distributor'}
      />
      <div className="mb-5 flex flex-row gap-2">
        <TextInput
          className="flex w-auto flex-grow"
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
        <AsyncButton
          className="rounded-md px-3 py-2"
          loading={handleTransferFunds.isLoading}
          inlineLoader
          onClick={() =>
            handleTransferFunds.mutate({
              transferAmount: Number(transferAmount),
            })
          }
        >
          Transfer Funds
        </AsyncButton>
      </div>
    </div>
  )
}
