import { AccountData } from '@cardinal/common'
import {
  StakeAuthorizationData,
  StakePoolData,
} from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getStakeAuthorizationsForPool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useMemo, useState } from 'react'
import { ShortPubKeyUrl } from './Pubkeys'

export const AllowedTokens = ({
  stakePool,
}: {
  stakePool: AccountData<StakePoolData> | undefined
}) => {
  const { connection, environment } = useEnvironmentCtx()
  const [stakeAuths, setStakeAuths] = useState<
    AccountData<StakeAuthorizationData>[]
  >([])

  useMemo(() => {
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
  }, [stakePool?.pubkey.toString()])

  return (
    <div className="my-4 flex w-full flex-row justify-start">
      <div className="flex flex-col">
        <span className="mb-2">Allowed Creators:</span>
        {stakePool?.parsed.requiresCreators.length === 0 ? (
          <span className="text-xs text-gray-500">No required creators</span>
        ) : (
          <span className="flex flex-col">
            {stakePool?.parsed.requiresCreators.map((c) => (
              <ShortPubKeyUrl pubkey={c} cluster={environment.label} />
            ))}
          </span>
        )}
      </div>
      <div className="ml-5 flex flex-col">
        <span className="mb-2">Allowed Collections:</span>
        {stakePool?.parsed.requiresCollections.length === 0 ? (
          <span className="text-xs text-gray-500">No required collections</span>
        ) : (
          <span className="flex flex-col">
            {stakePool?.parsed.requiresCollections.map((c) => (
              <ShortPubKeyUrl pubkey={c} cluster={environment.label} />
            ))}
          </span>
        )}
      </div>
      <div className="ml-5 flex flex-col">
        <span className="mb-2">White Listed Mints:</span>
        {stakeAuths.length === 0 ? (
          <span className="text-xs text-gray-500">No whitelisted mints</span>
        ) : (
          <span className="flex flex-col">
            {stakeAuths.map((a) => (
              <ShortPubKeyUrl
                pubkey={a.parsed.mint}
                cluster={environment.label}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  )
}
