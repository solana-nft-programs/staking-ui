import { PublicKey } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { notify } from 'common/Notification'
import { useGenerateRewardEntryMultiplierTxs } from 'generators/useGenerateRewardEntryMultiplierTxs'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useState } from 'react'

import { TextAreaInput } from '@/components/UI/inputs/TextAreaInput'

import { TransactionExector } from '../TransactionExecutor'

export const MintMultipliers = () => {
  const rewardDistributor = useRewardDistributorData()
  const [entryDatas, setEntryDatas] =
    useState<{ mintId: PublicKey; multiplier: number }[]>()
  const generateRewardEntryMultiplierTxs = useGenerateRewardEntryMultiplierTxs()

  if (!rewardDistributor.data) return <></>
  return (
    <div>
      <FormFieldTitleInput
        title={'Set multiplier for given mints'}
        description={
          <div>
            <p className="text-sm italic text-gray-300">
              Set the stake multiplier for given mints.
              <br />
              For a 1x multiplier, enter value{' '}
              {10 ** (rewardDistributor.data.parsed?.multiplierDecimals || 0)},
              for a 2x multiplier enter value{' '}
              {2 *
                10 **
                  (rewardDistributor.data.parsed?.multiplierDecimals || 0)}{' '}
              ...
            </p>
            <p className="text-sm italic text-gray-300">
              For decimal multipliers, work with the reward distributor
              {"'"}s <b>multiplierDecimals</b>. If you set multiplierDecimals =
              1, then for 1.5x multiplier, enter value 15 so that
              value/10**multiplierDecimals = 15/10^1 = 1.5
            </p>
            <p className="mt-2 text-sm italic text-gray-300">
              <b>NOTE</b> that for 1.5x, you could set multiplierDecimals = 2
              and enter value 150, or multiplierDecimals = 3 and enter value
              1500 ...
            </p>
            <p className="mt-2 mb-5 text-sm italic text-gray-300">
              Input a CSV (comma-separated rows) of token address and multiplier
            </p>
          </div>
        }
      />
      <div className="mb-5 w-full">
        <div className="flex gap-4">
          <TextAreaInput
            placeholder="tokenId,multiplier"
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
                    multiplier: Number(multiplierString),
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
              hidden={!!generateRewardEntryMultiplierTxs.data}
              loading={generateRewardEntryMultiplierTxs.isLoading}
              inlineLoader
              disabled={!entryDatas || entryDatas.length <= 0}
              onClick={() =>
                generateRewardEntryMultiplierTxs.mutate({
                  entryDatas: entryDatas ?? [],
                })
              }
            >
              Generate
            </AsyncButton>
          </div>
        </div>
        {generateRewardEntryMultiplierTxs.data &&
          generateRewardEntryMultiplierTxs.data.length > 0 && (
            <TransactionExector
              className="mt-6"
              txs={generateRewardEntryMultiplierTxs.data}
            />
          )}
      </div>
    </div>
  )
}
