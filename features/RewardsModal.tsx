import { Dialog } from '@headlessui/react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { Rewards, useSentryPower } from 'hooks/useSentryPower'

type RewardsModal = {
  isOpen: boolean,
  setIsOpen: (open: boolean) => void,
}

type RewardsListProps = {
  rewards: Rewards | undefined | false
}

export function RewardsModal(props: RewardsModal) {
  const { isOpen, setIsOpen } = props
  const fasz = useSentryPower()

  const hasRewards = !!fasz?.data?.rewards.rewardAmount
  const rewards = hasRewards && fasz?.data?.rewards

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-1/2 rounded-lg text-neutral-200 bg-neutral-900 border border-neutral-700">
          {fasz.isFetching 
            ? <div className="h-full flex justify-center items-center py-48">
              <LoadingSpinner />
            </div>
            : <RewardsList rewards={rewards} />
          }
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

function RewardsList(props: RewardsListProps) {
  const { rewards } = props

  if (!rewards) {
    return (
      <div className="py-48 mx-auto text-center w-1/2">
        <h3 className="text-xl">No Rewards Yet</h3>
        <p className="text-neutral-600">Once you start earning rewards, they will be listed here and broken down by epoch.</p>
      </div>
    )
  }

  const formattedData = formatRewardsTable(rewards)
  const tHead = ['Epoch', 'Amount (SOL)', 'Post Balance']
  return (
    <>
      <div className="p-8">
        <Dialog.Title className="text-2xl text-neutral-200 font-semibold">
          Your Rewards
        </Dialog.Title>
        <p className="text-neutral-400 text-sm">Showing last 12 epochs</p>
      </div>
      <table className="border-collapse table-fixed w-full">
        <thead>
          <tr className="text-left p-2 text-neutral-500">
            {tHead.map(head => 
              <th 
                key={head}
                className="py-2 px-8 border-b border-neutral-800 font-normal"
              >
                {head}
              </th>
              )}
          </tr>
        </thead>
        <tbody>
          {formattedData.map((row, id) => 
            <tr key={id}>
              {row.map(col =>
                <td 
                  key={col}
                  className="py-2 px-8 border-b border-neutral-800 bg-neutral-800/20 text-neutral-300"
                >
                  {col}
                </td>
              )}
            </tr>  
          )}
        </tbody>
        <div className="pt-4 px-8">
          {rewards.rewardEpoch.length > 12
            ? <p className="text-sm text-neutral-400">
                Showing 12 out of {rewards.rewardEpoch.length}
              </p> 
            : null}
        </div>
      </table>
    </>
  )
}

function formatRewardsTable(rewards: Rewards) {
  const { rewardAmount, rewardEpoch, rewardPostBalance } = rewards
  const table = []

  for (let i = 11; i >= 0; i--) {
    table.push([
      rewardEpoch[i], 
      rewardAmount[i] as number / LAMPORTS_PER_SOL, 
      rewardPostBalance[i] as number / LAMPORTS_PER_SOL
    ])
  }

  return table
}