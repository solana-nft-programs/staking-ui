import React from 'react'

export function ClockdriftWarning(props: { clockDrift: number }) {
  const { clockDrift } = props
  return (
    <div className="-mt-6 mb-6 bg-amber-900 py-2 text-center">
      <div className="text-xs font-semibold text-amber-100">
        Warning{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://status.solana.com/"
          className="text-amber-400 hover:text-amber-200"
        >
          Solana
        </a>{' '}
        clock is {Math.floor(clockDrift / 60)} minutes{' '}
        {clockDrift > 0 ? 'behind' : 'ahead'}. Rewards are now shown aligned to
        solana clock.
      </div>
    </div>
  )
}
