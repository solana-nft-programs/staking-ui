import { ButtonSmall } from 'common/ButtonSmall'
import { withCluster } from 'common/utils'
import { useStakePoolId } from 'hooks/useStakePoolId'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakePoolMetadataCtx } from 'providers/StakePoolMetadataProvider'

export const StakePoolImage = () => {
  const { environment } = useEnvironmentCtx()
  const { data: config } = useStakePoolMetadataCtx()
  const { data: stakePoolId } = useStakePoolId()

  return config?.imageUrl ? (
    <div className="relative flex w-1/4 grow items-center justify-center rounded-xl">
      <img
        className={`max-h-[200px] w-auto rounded-xl ${
          config?.logoPadding && 'p-8'
        }`}
        src={config?.imageUrl}
        alt={config?.displayName}
      />
    </div>
  ) : (
    <div className="flex min-h-[200px] w-full items-center justify-center rounded-xl bg-white bg-opacity-5 md:w-1/4 md:grow">
      <a
        target={'_blank'}
        rel="noreferrer"
        href={`https://github.com/cardinal-labs/cardinal-staking-ui#customizing-your-stake-pool`}
      >
        <ButtonSmall
          onClick={() => {
            window.open(
              withCluster(
                `/admin/${config?.name ?? stakePoolId}`,
                environment.label
              )
            )
          }}
        >
          Add image
        </ButtonSmall>
      </a>
    </div>
  )
}
