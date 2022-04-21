import { AccountData } from '@cardinal/common'
import {
  StakeAuthorizationData,
  StakePoolData,
} from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getStakeAuthorizationsForPool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useCallback, useEffect, useState } from 'react'

export const AllowedTokensModal = ({
  handleClose,
  stakePool,
}: {
  handleClose: () => any
  stakePool: AccountData<StakePoolData> | undefined
}) => {
  const { connection } = useEnvironmentCtx()
  const [stakeAuths, setStakeAuths] = useState<
    AccountData<StakeAuthorizationData>[]
  >([])

  const escFunction = useCallback((event: { key: string }) => {
    if (event.key === 'Escape') {
      handleClose()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  useEffect(() => {
    if (stakePool) {
      const setData = async () => {
        let data = await getStakeAuthorizationsForPool(
          connection,
          stakePool?.pubkey
        )
        setStakeAuths(data)
      }
      setData().catch(console.error)
    }
  }, [stakePool])

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.6)',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        width: '100%',
        height: '100%',
      }}
    >
      <div
        className="fixed inset-x-0 top-8 z-50 mx-auto rounded-3xl border border-[#A7A7A7] bg-[#2A2A2A] px-7 pb-10 md:px-10"
        style={{
          border: '2px solid #A7A7A7',
          width: '90%',
          maxWidth: '1200px',
          maxHeight: 'calc(100vh - 64px)',
          overflow: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div className="top-0 left-0 z-10 flex w-full flex-col items-center justify-between gap-2 bg-[#2A2A2A] pt-7 pb-4 md:sticky md:pt-10">
          <div className="flex w-full flex-row justify-between">
            <div className="mb-1 text-left text-2xl font-bold text-white">
              Allowed Tokens For Pool
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={handleClose}
                className="my-auto mr-5 flex rounded-md bg-blue-700 px-4 py-2"
              >
                <span className="my-auto">Close or Esc</span>
              </button>
            </div>
          </div>
          <div className="mt-10 flex w-full flex-row justify-start">
            <div className="flex flex-col">
              <span className="mb-2">Allowed Creators:</span>
              {stakePool?.parsed.requiresCreators.length === 0 ? (
                <span>No required creators</span>
              ) : (
                <span className="flex flex-col">
                  {stakePool?.parsed.requiresCreators.map((c) => (
                    <a
                      className="mr-2 text-white underline underline-offset-2"
                      href={
                        'https://explorer.solana.com/address/' + c.toString()
                      }
                    >
                      {c.toString()}
                    </a>
                  ))}
                </span>
              )}
            </div>
            <div className="ml-5 flex flex-col">
              <span className="mb-2">Allowed Collections:</span>
              {stakePool?.parsed.requiresCollections.length === 0 ? (
                <span>No required collections</span>
              ) : (
                <span className="flex flex-col">
                  {stakePool?.parsed.requiresCollections.map((c) => (
                    <a
                      className="mr-2 text-white underline underline-offset-2"
                      href={
                        'https://explorer.solana.com/address/' + c.toString()
                      }
                    >
                      {c.toString()}
                    </a>
                  ))}
                </span>
              )}
            </div>
            <div className="ml-5 flex flex-col">
              <span className="mb-2">White Listed Mints:</span>
              {stakeAuths.length === 0 ? (
                <span>No whitelisted mints</span>
              ) : (
                <span className="flex flex-col">
                  {stakeAuths.map((a) => (
                    <a
                      className="mr-2 text-white underline underline-offset-2"
                      href={
                        'https://explorer.solana.com/address/' +
                        a.parsed.mint.toString()
                      }
                    >
                      {a.toString()}
                    </a>
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
