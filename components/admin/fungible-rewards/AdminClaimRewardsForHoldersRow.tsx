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
    <div
      key={index}
      className="flex gap-4 border-b border-border py-4 md:flex-row"
    >
      <div className="flex-[2]">{index + 1}</div>
      <div className="flex-1">
        <AsyncButton
          className="w-1/2 justify-center rounded-md py-1 text-sm"
          loading={handleExecuteTransaction.isLoading}
          inlineLoader
          onClick={() => handleExecuteTransaction.mutate({ transaction: tx })}
        >
          Retry
        </AsyncButton>
      </div>{' '}
    </div>
  )
}
