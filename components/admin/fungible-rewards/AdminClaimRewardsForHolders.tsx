import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { useGenerateClaimRewardsForHoldersTxs } from 'generators/useGenerateClaimRewardsForHoldersTxs'
import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from 'hooks/useRewardDistributorData'

import { TransactionExector } from '../TransactionExecutor'

export const AdminClaimRewardsForHolders = () => {
  const handleGenerateClaimRewardsForHoldersTxs =
    useGenerateClaimRewardsForHoldersTxs()
  const rewardDistributor = useRewardDistributorData()

  if (
    !rewardDistributor.data ||
    (rewardDistributor.data.parsed?.kind === RewardDistributorKind.Mint &&
      !isRewardDistributorV2(rewardDistributor.data.parsed))
  ) {
    return <></>
  }
  return (
    <div className="mb-5">
      <FormFieldTitleInput
        title={'Claim Rewards for Stakers'}
        description={
          'As the authority of the pool, you can claim the stake pool rewards for your holders. Clicking generate will show all transactions and allow you to execute them individually or as a batch'
        }
      />
      <div className="flex w-full flex-row justify-center">
        <AsyncButton
          className="my-5 rounded-md px-3 py-2"
          hidden={!!handleGenerateClaimRewardsForHoldersTxs.data}
          loading={handleGenerateClaimRewardsForHoldersTxs.isLoading}
          inlineLoader
          onClick={() => handleGenerateClaimRewardsForHoldersTxs.mutate({})}
        >
          Generate
        </AsyncButton>
      </div>
      {handleGenerateClaimRewardsForHoldersTxs.data &&
        handleGenerateClaimRewardsForHoldersTxs.data.length > 0 && (
          <TransactionExector
            className="mt-6"
            txs={handleGenerateClaimRewardsForHoldersTxs.data}
          />
        )}
    </div>
  )
}
