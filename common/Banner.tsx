import { useUTCNow } from 'providers/UTCNowProvider'

export const Banner: React.FC = ({}) => {
  const { clockDrift } = useUTCNow()
  return (
    <>
      {clockDrift && (
        <div className="mt-4 flex w-full items-center justify-center rounded-md text-center">
          <div className="text-xs font-semibold text-yellow-500">
            Warning{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://status.solana.com/"
              className="text-blue-400"
            >
              Solana
            </a>{' '}
            clock is {Math.floor(clockDrift / 60)} minutes{' '}
            {clockDrift > 0 ? 'behind' : 'ahead'}. Rentals are now shown aligned
            to solana clock
          </div>
        </div>
      )}
    </>
  )
}
