import { PublicKey } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { notify } from 'common/Notification'
import { useGenerateSetStakeEntrySecondsTxs } from 'generators/useGenerateSetStakeEntrySecondsTxs'
import { useHandleExecuteTransactions } from 'handlers/useHandleExecuteTransactions'
import { useState } from 'react'

import { TextAreaInput } from '@/components/UI/inputs/TextAreaInput'

import { TransactionExector } from '../TransactionExecutor'

export const AdminPointsSetPoints = () => {
  const [entryDatas, setEntryDatas] =
    useState<{ mintId: PublicKey; multiplierStakeSeconds: number }[]>()
  const handleExecuteTransactions = useHandleExecuteTransactions()
  const generateSetStakeEntrySecondsTxs = useGenerateSetStakeEntrySecondsTxs()
  return (
    <div className="mb-5 w-full">
      <FormFieldTitleInput
        title={'Set points for tokens'}
        description={
          'Input a CSV (comma-separated rows) of token address and seconds to set'
        }
      />
      <div className="flex gap-4">
        <TextAreaInput
          placeholder="tokenId,stakeSeconds"
          onChange={(e) => {
            try {
              const rows = e.target.value
                .split('\n')
                .filter((r) => r.length > 0)
              const entrys = rows.map((row) => {
                const [mintString, secondsString] = row.split(',')
                if (!mintString) throw 'Mint not found'
                return {
                  mintId: new PublicKey(mintString),
                  multiplierStakeSeconds: Number(secondsString),
                }
              })
              setEntryDatas(entrys)
            } catch (e) {
              notify({ message: 'Error parsing input', description: `${e}` })
            }
          }}
        />
        <div>
          <AsyncButton
            className="flex items-center justify-center rounded-md px-3 py-2"
            hidden={!!generateSetStakeEntrySecondsTxs.data}
            loading={generateSetStakeEntrySecondsTxs.isLoading}
            inlineLoader
            disabled={!entryDatas || entryDatas.length <= 0}
            onClick={() => {
              generateSetStakeEntrySecondsTxs.mutate({
                entryDatas: entryDatas ?? [],
              })
              handleExecuteTransactions.reset()
            }}
          >
            Generate
          </AsyncButton>
        </div>
      </div>
      {generateSetStakeEntrySecondsTxs.data &&
        generateSetStakeEntrySecondsTxs.data.length > 0 && (
          <TransactionExector
            className="mt-6"
            txs={generateSetStakeEntrySecondsTxs.data}
          />
        )}
    </div>
  )
}
