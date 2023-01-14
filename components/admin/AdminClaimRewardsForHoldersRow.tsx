import type { Transaction } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { useHandleExecuteTransaction } from 'handlers/useHandleExecuteTransaction'

export const AdminClaimRewardsForHoldersRow = ({
  index,
  loading,
  tx,
}: {
  index: number
  loading: boolean
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
          className="my-2 justify-center rounded-md px-3 py-2"
          loading={handleExecuteTransaction.isLoading || loading}
          inlineLoader
          onClick={() => handleExecuteTransaction.mutate({ transaction: tx })}
        >
          Send
        </AsyncButton>
      </div>{' '}
    </div>
  )
}
