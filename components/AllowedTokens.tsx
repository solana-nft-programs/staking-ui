import { AccountData } from '@cardinal/common'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { useStakeAuthorizationsForPool } from 'hooks/useStakeAuthorizationsForPool'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { ShortPubKeyUrl } from '../common/Pubkeys'

export const AllowedTokens = ({
  stakePool,
}: {
  stakePool: AccountData<StakePoolData> | undefined
}) => {
  const { environment } = useEnvironmentCtx()
  const stakeAuthorizations = useStakeAuthorizationsForPool()
  return (
    <div className="my-4 flex w-full flex-row justify-start">
      <div className="flex flex-col">
        <span className="mb-2">Allowed Creators:</span>
        {stakePool?.parsed.requiresCreators.length === 0 ? (
          <span className="text-xs text-gray-500">No required creators</span>
        ) : (
          <span className="flex flex-col">
            {stakePool?.parsed.requiresCreators.map((c) => (
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
        {stakePool?.parsed.requiresCollections.length === 0 ? (
          <span className="text-xs text-gray-500">No required collections</span>
        ) : (
          <span className="flex flex-col">
            {stakePool?.parsed.requiresCollections.map((c) => (
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
                key={a.parsed.mint.toString()}
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
