import type { IdlAccountData } from '@cardinal/rewards-center'
import { AsyncButton } from 'common/Button'
import { useHandlePoolSnapshot } from 'handlers/useHandlePoolSnapshot'

export const Snapshot = () => {
  const handlePoolSnaphsot = useHandlePoolSnapshot()

  function downloadSnapshot(
    data: Pick<IdlAccountData<'stakeEntry'>, 'pubkey' | 'parsed'>[]
  ) {
    let body = `Total Staked Tokens,${data.length}\n\nMint Address,Staker Address\n`
    data.forEach((data) => {
      body += `${data.parsed.stakeMint.toString()},${data.parsed.lastStaker.toString()}\n`
    })
    const element = document.createElement('a')
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(body)
    )
    element.setAttribute('download', 'snapshot.csv')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="mb-5 text-xs font-bold uppercase text-gray-200">
        Download the list of actively staked tokens and their stakers
      </div>
      <AsyncButton
        className="mx-auto flex w-full items-center justify-center text-center"
        loading={handlePoolSnaphsot.isLoading}
        inlineLoader
        onClick={async () => {
          handlePoolSnaphsot.mutate(undefined, {
            onSuccess: (
              data: Pick<IdlAccountData<'stakeEntry'>, 'pubkey' | 'parsed'>[]
            ) => {
              downloadSnapshot(data)
            },
          })
        }}
      >
        <div>Get Snapshot</div>
      </AsyncButton>
    </div>
  )
}
