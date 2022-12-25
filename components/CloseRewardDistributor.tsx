import { AsyncButton } from 'common/Button'
import { useHandleRewardDistributorRemove } from 'handlers/useHandleRewardDistributorRemove'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'

export const CloseRewardDistributor = () => {
  const rewardDistributor = useRewardDistributorData()
  const rewardDistributorRemove = useHandleRewardDistributorRemove()
  if (!rewardDistributor.data) {
    return <></>
  }
  return (
    <div className="flex flex-row">
      <label
        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
        htmlFor="require-authorization"
      >
        Delete Reward Distributor
      </label>
      <div className="mb-5 flex flex-row">
        <AsyncButton
          className="ml-5 rounded-md px-3 py-1"
          loading={rewardDistributorRemove.isLoading}
          inlineLoader
          onClick={() => rewardDistributorRemove.mutate()}
        >
          <div className="text-xs">Delete Reward Distributor</div>
        </AsyncButton>
      </div>
    </div>
  )
}
