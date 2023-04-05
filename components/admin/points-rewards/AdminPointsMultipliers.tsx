import { PublicKey } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { notify } from 'common/Notification'
import { useGenerateStakeEntryMultiplierTxs } from 'generators/useGenerateStakeEntryMultiplierTxs'
import { useHandleExecuteTransactions } from 'handlers/useHandleExecuteTransactions'
import { useState } from 'react'

import { TextAreaInput } from '@/components/UI/inputs/TextAreaInput'

import { TransactionExector } from '../TransactionExecutor'

export const AdminPointsMultipliers = () => {
  const [entryDatas, setEntryDatas] =
    useState<{ mintId: PublicKey; multiplierBasisPoints: number }[]>()
  const handleExecuteTransactions = useHandleExecuteTransactions()
  const generateStakeEntryMultiplierTxs = useGenerateStakeEntryMultiplierTxs()
  return (
    <div className="mb-5 w-full">
      <FormFieldTitleInput
        title={'Set point multipliers for tokens'}
        description={
          'Input a CSV (comma-separated rows) of token address and multiplier to set in basis points (10,000 = 1x, 15,000 = 1.5x)'
        }
      />
      <div className="flex gap-4">
        <TextAreaInput
          placeholder="tokenId,multiplierBasisPoints"
          onChange={(e) => {
            try {
              const rows = e.target.value
                .split('\n')
                .filter((r) => r.length > 0)
              const entrys = rows.map((row) => {
                const [mintString, multiplierString] = row.split(',')
                if (!mintString) throw 'Mint not found'
                return {
                  mintId: new PublicKey(mintString),
                  multiplierBasisPoints: Number(multiplierString),
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
            hidden={!!generateStakeEntryMultiplierTxs.data}
            loading={generateStakeEntryMultiplierTxs.isLoading}
            inlineLoader
            disabled={!entryDatas || entryDatas.length <= 0}
            onClick={() => {
              generateStakeEntryMultiplierTxs.mutate({
                entryDatas: entryDatas ?? [],
              })
              handleExecuteTransactions.reset()
            }}
          >
            Generate
          </AsyncButton>
        </div>
      </div>
      {generateStakeEntryMultiplierTxs.data &&
        generateStakeEntryMultiplierTxs.data.length > 0 && (
          <TransactionExector
            className="mt-6"
            txs={generateStakeEntryMultiplierTxs.data}
          />
        )}
    </div>
  )
}
