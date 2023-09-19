import { transactionUrl } from '@solana-nft-programs/common'
import { css } from '@emotion/react'
import type { Transaction } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { useHandleExecuteTransaction } from 'handlers/useHandleExecuteTransaction'
import { useHandleExecuteTransactions } from 'handlers/useHandleExecuteTransactions'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  txs?: Transaction[]
}
export const TransactionExector = ({ txs, ...props }: Props) => {
  const handleExecuteTransactions = useHandleExecuteTransactions()
  const [successfulTxIxs, setSuccessfulTxIxs] = useState<number[]>([])
  const [failedTxIxs, setFailedTxIxs] = useState<number[]>([])
  const [txids, setTxids] = useState<(string | null)[]>()
  const [viewAll, setViewAll] = useState(false)
  useEffect(() => setSuccessfulTxIxs([]), [txs?.length])
  if (!txs || txs.length <= 0) return <></>
  return (
    <div {...props}>
      {txs.length > 0 && (
        <>
          <div className="mb-2 flex items-center justify-between text-gray-200">
            <div className="text-xs font-bold uppercase tracking-wide">
              Total Transactions
            </div>
            <div
              className="cursor-pointer text-xs underline"
              onClick={() => setViewAll((v) => !v)}
            >
              {viewAll ? 'Hide details' : 'View details'}
            </div>
          </div>
          <TxProgress
            progress={successfulTxIxs.length || 0}
            total={txs.length}
          />
          {viewAll && (
            <div className="mt-2 w-full overflow-y-scroll rounded-xl border border-border p-4">
              <div className="flex w-full gap-4 rounded-xl bg-dark-4 px-8 py-2">
                <div className="flex-1">Transaction</div>
                <div className="flex-1 text-right">Status</div>
              </div>
              <div className="flex max-h-[500px] flex-col px-8">
                {txs.map((tx, i) => (
                  <TxRow
                    key={i}
                    txix={i}
                    tx={tx}
                    txids={txids}
                    successfulTxIxs={successfulTxIxs}
                    failedTxIxs={failedTxIxs}
                    setSuccessfulTxIxs={setSuccessfulTxIxs}
                  />
                ))}
              </div>
            </div>
          )}
          {successfulTxIxs.length < txs.length && (
            <AsyncButton
              className="mt-4 flex items-center justify-center px-3 py-2"
              loading={handleExecuteTransactions.isLoading}
              inlineLoader
              onClick={() =>
                handleExecuteTransactions.mutate(
                  {
                    transactions: txs.filter(
                      (_, i) => !successfulTxIxs.includes(i)
                    ),
                    setFailedTxIxs: setFailedTxIxs,
                    setSuccessfulTxIxs: setSuccessfulTxIxs,
                  },
                  {
                    onSuccess: (txids) => {
                      setTxids(txids)
                    },
                  }
                )
              }
            >
              Send{' '}
              {successfulTxIxs.length > 0 && successfulTxIxs.length < txs.length
                ? `Remaining (${txs.length - successfulTxIxs.length})`
                : 'All'}
            </AsyncButton>
          )}
        </>
      )}
    </div>
  )
}

export const TxRow = ({
  txix,
  tx,
  txids,
  successfulTxIxs,
  failedTxIxs,
  setSuccessfulTxIxs,
}: {
  txix: number
  tx: Transaction
  txids?: (string | null)[]
  successfulTxIxs: number[]
  failedTxIxs: number[]
  setSuccessfulTxIxs: Dispatch<SetStateAction<number[]>>
}) => {
  const { environment } = useEnvironmentCtx()
  const handleExecuteTransaction = useHandleExecuteTransaction()
  return (
    <div className="flex gap-4 border-b border-border py-4 md:flex-row">
      <div className="flex-1">{txix + 1}</div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <AsyncButton
          className="justify-center rounded-md bg-gray-700 py-1 text-sm hover:bg-gray-800"
          css={css`
            background-color: ${failedTxIxs.includes(txix) && 'red !important'};
          `}
          loading={handleExecuteTransaction.isLoading}
          inlineLoader
          onClick={() =>
            handleExecuteTransaction.mutate(
              { transaction: tx },
              {
                onSuccess: () => {
                  setSuccessfulTxIxs((v) => [...v, txix])
                },
              }
            )
          }
        >
          {successfulTxIxs.includes(txix)
            ? 'Resend'
            : failedTxIxs.includes(txix)
            ? 'Retry'
            : 'Send'}
        </AsyncButton>
        {successfulTxIxs.includes(txix) && txids?.at(txix) && (
          <AsyncButton
            className="justify-center rounded-md py-1 text-sm"
            onClick={() =>
              window.open(
                transactionUrl(txids?.at(txix) ?? '', environment.label)
              )
            }
          >
            View
          </AsyncButton>
        )}
      </div>
    </div>
  )
}

export const TxProgress = ({
  progress,
  total,
}: {
  progress: number
  total: number
}) => {
  const pct = progress / total
  return (
    <div className="relative h-8 w-full overflow-hidden rounded-lg bg-white bg-opacity-10">
      <div
        className="absolute h-full bg-primary"
        css={css`
          width: ${pct * 100}%;
        `}
      />
      <div className="absolute flex h-full w-full items-center justify-center gap-2 text-sm">
        <div>{progress.toString()}</div>
        <>
          <div>/</div>
          {total}
        </>
      </div>
      <div className="absolute right-5 flex h-full items-center text-sm">
        <div className="h-2 w-2 animate-ping rounded-full bg-light-0" />
      </div>
    </div>
  )
}
