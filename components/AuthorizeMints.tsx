import { PublicKey } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { notify } from 'common/Notification'
import { useGenerateAuthorizeMintTxs } from 'generators/useGenerateAuthorizeMintTxs'
import { useGenerateDeauthorizeMintTxs } from 'generators/useGenerateDeauthorizeMintTxs'
import { useState } from 'react'

import { TransactionExector } from './admin/TransactionExecutor'
import { TextAreaInput } from './UI/inputs/TextAreaInput'

export const AuthorizeMints = () => {
  const generateAuthorizeMintTxs = useGenerateAuthorizeMintTxs()
  const generateDeauthorizeMintTxs = useGenerateDeauthorizeMintTxs()
  const [entryDatas, setEntryDatas] = useState<{ mintId: PublicKey }[]>()
  return (
    <div>
      <FormFieldTitleInput
        title={'Authorize access to specific mint'}
        description={
          <div>
            <p className="mb-2 text-sm italic text-gray-300">
              Allow any specific mints access to the stake pool (separated by
              commas)
            </p>
            <p className="mb-5 text-sm italic text-gray-300">
              <b>WARNING</b> Do not set more than a few at at time. If needed
              take a look at the scripts in{' '}
              <a
                href="https://github.com/cardinal-labs/cardinal-staking/tree/main/tools"
                className="text-blue-500"
                target="_blank"
                rel="noreferrer"
              >
                tools
              </a>{' '}
              to set many at a time.
            </p>
          </div>
        }
      />
      <TextAreaInput
        placeholder="mintId"
        onChange={(e) => {
          try {
            const rows = e.target.value.split('\n').filter((r) => r.length > 0)
            const entrys = rows.map((row) => {
              const [mintString] = row.split(',')
              if (!mintString) throw 'Mint not found'
              return {
                mintId: new PublicKey(mintString),
              }
            })
            setEntryDatas(entrys)
          } catch (e) {
            notify({ message: 'Error parsing input', description: `${e}` })
          }
        }}
      />
      <div className="mt-3 flex items-center gap-2">
        <AsyncButton
          loading={generateAuthorizeMintTxs.isLoading}
          onClick={() => {
            generateDeauthorizeMintTxs.reset()
            generateAuthorizeMintTxs.mutate({
              entryDatas: entryDatas ?? [],
            })
          }}
          inlineLoader
          className="flex w-1/2 items-center justify-center"
        >
          Authorize Mints
        </AsyncButton>
        <AsyncButton
          loading={generateDeauthorizeMintTxs.isLoading}
          onClick={() => {
            generateAuthorizeMintTxs.reset()
            generateDeauthorizeMintTxs.mutate({
              entryDatas: entryDatas ?? [],
            })
          }}
          inlineLoader
          className="flex w-1/2 items-center justify-center bg-red-500 text-center hover:bg-red-600"
        >
          De-authorize Mints
        </AsyncButton>
      </div>
      <TransactionExector
        className="mt-4"
        txs={generateAuthorizeMintTxs.data}
      />
      <TransactionExector
        className="mt-4"
        txs={generateDeauthorizeMintTxs.data}
      />
    </div>
  )
}
