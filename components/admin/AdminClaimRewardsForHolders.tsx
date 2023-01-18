import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import type { Transaction } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { handleError } from 'common/errors'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { notify } from 'common/Notification'
import { UpgradeProgress } from 'common/UpgradeProgress'
import { useGenerateClaimRewardsForHoldersTxs } from 'generators/useGenerateClaimRewardsForHoldersTxs'
import { useHandleExecuteTransactions } from 'handlers/useHandleExecuteTransactions'
import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from 'hooks/useRewardDistributorData'
import { useState } from 'react'

import { AdminClaimRewardsForHoldersRow } from './AdminClaimRewardsForHoldersRow'

export const AdminClaimRewardsForHolders = () => {
  const [failedTxs, setFailedTxs] = useState<Transaction[]>([])
  const handleExecuteTransactions = useHandleExecuteTransactions()
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
          'As the authority of the pool, you can claim the stake pool rewards for your holders'
        }
      />
      <div className="flex w-full flex-row justify-center">
        {!!handleGenerateClaimRewardsForHoldersTxs.data &&
        handleGenerateClaimRewardsForHoldersTxs.data.length !== 0 ? (
          <AsyncButton
            className="my-5 rounded-md px-3 py-2"
            loading={handleExecuteTransactions.isLoading}
            inlineLoader
            onClick={() =>
              handleExecuteTransactions.mutate(
                {
                  transactions: handleGenerateClaimRewardsForHoldersTxs.data,
                  setFailedTxs: setFailedTxs,
                },
                {
                  onSuccess: () => {
                    notify({
                      message: 'Successfully claimed rewards for users',
                      type: 'success',
                    })
                  },
                  onError: (e) => {
                    notify({
                      message: handleError(
                        e,
                        `Failed to send transactions: ${e}`
                      ),
                      type: 'error',
                    })
                  },
                }
              )
            }
          >
            Send All
          </AsyncButton>
        ) : !!handleGenerateClaimRewardsForHoldersTxs.data &&
          handleGenerateClaimRewardsForHoldersTxs.data.length === 0 ? (
          <div className="mt-5 text-sm">
            No pending rewards to claim for holders
          </div>
        ) : (
          <AsyncButton
            className="my-5 rounded-md px-3 py-2"
            hidden={!!handleGenerateClaimRewardsForHoldersTxs.data}
            loading={handleGenerateClaimRewardsForHoldersTxs.isLoading}
            inlineLoader
            onClick={() => handleGenerateClaimRewardsForHoldersTxs.mutate()}
          >
            Generate Transactions
          </AsyncButton>
        )}
      </div>
      {handleGenerateClaimRewardsForHoldersTxs.data &&
        handleGenerateClaimRewardsForHoldersTxs.data.length !== 0 && (
          <>
            <div className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200">
              Total Transactions
            </div>
            <UpgradeProgress
              progress={handleExecuteTransactions.data?.length || 0}
              total={handleGenerateClaimRewardsForHoldersTxs.data.length}
            />
          </>
        )}
      {failedTxs.length !== 0 && (
        <div className="mt-5">
          <div className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200">
            Failed Transactions
          </div>
          <div className="w-full overflow-x-scroll rounded-xl border border-border p-4">
            <div className="flex w-full gap-4 rounded-xl bg-dark-4 px-8 py-2">
              <div className="flex-[2]">Transaction</div>
              <div className="flex-1">Status</div>
            </div>
            <div className="flex flex-col px-8">
              {failedTxs.map((tx, index) => (
                <AdminClaimRewardsForHoldersRow
                  key={index}
                  index={index}
                  tx={tx}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
