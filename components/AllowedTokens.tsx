import type { IdlAccountData } from '@cardinal/rewards-center'
import { useStakeAuthorizationsForPool } from 'hooks/useStakeAuthorizationsForPool'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { ShortPubKeyUrl } from '../common/Pubkeys'

export const AllowedTokens = ({
  stakePool,
}: {
  stakePool: Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'> | undefined
}) => {
  const { environment } = useEnvironmentCtx()
  const stakeAuthorizations = useStakeAuthorizationsForPool()
  return (
    <div className="my-4 flex w-full flex-row justify-start">
      <div className="flex flex-col">
        <span className="mb-2">Allowed Creators:</span>
        {stakePool?.parsed?.allowedCreators.length === 0 ? (
          <span className="text-xs text-gray-500">No allowed creators</span>
        ) : (
          <span className="flex flex-col">
            {stakePool?.parsed?.allowedCreators.map((c) => (
              <ShortPubKeyUrl
                key={c.toString()}
                pubkey={c}
                cluster={environment.label}
              />
            ))}
          </span>
        )}
      </div>
      <div className="ml-5 flex flex-col">
        <span className="mb-2">Allowed Collections:</span>
        {stakePool?.parsed?.allowedCollections.length === 0 ? (
          <span className="text-xs text-gray-500">No allowed collections</span>
        ) : (
          <span className="flex flex-col">
            {stakePool?.parsed?.allowedCollections.map((c) => (
              <ShortPubKeyUrl
                key={c.toString()}
                pubkey={c}
                cluster={environment.label}
              />
            ))}
          </span>
        )}
      </div>
      <div className="ml-5 flex flex-col">
        <span className="mb-2">White Listed Mints:</span>
        {!stakeAuthorizations.isFetched ? (
          <span className="h-4 w-full animate-pulse rounded-md bg-white bg-opacity-5"></span>
        ) : stakeAuthorizations.data?.length === 0 ? (
          <span className="text-xs text-gray-500">No whitelisted mints</span>
        ) : (
          <span className="flex flex-col">
            {stakeAuthorizations.data?.map((a) => (
              <ShortPubKeyUrl
                key={a.parsed?.mint.toString()}
                pubkey={a.parsed?.mint}
                cluster={environment.label}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  )
}
