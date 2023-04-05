import type { Transaction } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { useHandleExecuteTransaction } from 'handlers/useHandleExecuteTransaction'

export const AdminClaimRewardsForHoldersRow = ({
  index,
  tx,
}: {
  index: number
  tx: Transaction
}) => {
  const handleExecuteTransaction = useHandleExecuteTransaction()
  return (
    <div className="flex gap-4 border-b border-border py-4 md:flex-row">
      <div className="flex-1">{index + 1}</div>
      <div className="flex flex-1 items-center justify-end">
        <AsyncButton
          className="justify-center rounded-md py-1 text-sm"
          loading={handleExecuteTransaction.isLoading}
          inlineLoader
          onClick={() => handleExecuteTransaction.mutate({ transaction: tx })}
        >
          Retry
        </AsyncButton>
      </div>
    </div>
  )
}
