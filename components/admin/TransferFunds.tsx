import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { useHandleTransferFunds } from 'handlers/useHandleTransferFunds'
import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from 'hooks/useRewardDistributorData'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { useState } from 'react'

import { BNInput } from '../UI/inputs/BNInput'

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
        <BNInput
          className="flex w-auto flex-grow"
          placeholder={'1000000'}
          value={transferAmount}
          decimals={rewardMintInfo.data?.mintInfo.decimals}
          handleChange={(v) => setTransferAmount(v)}
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
