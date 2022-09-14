import { usePoolAnalytics } from 'hooks/usePoolAnalytics'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

export const PoolAnalytics = () => {
  const analytics = usePoolAnalytics()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  if (!analytics.data || Object.keys(analytics.data).length === 0) return <></>
  return (
    <div
      className={`mx-5 mb-4 flex flex-wrap items-center gap-4 rounded-md px-10 py-6  md:flex-row md:justify-between ${
        stakePoolMetadata?.colors?.fontColor
          ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
          : 'text-gray-200'
      } ${
        stakePoolMetadata?.colors?.backgroundSecondary
          ? `bg-[${stakePoolMetadata?.colors?.backgroundSecondary}]`
          : 'bg-white bg-opacity-5'
      }`}
      style={{
        background: stakePoolMetadata?.colors?.backgroundSecondary,
        border: stakePoolMetadata?.colors?.accent
          ? `2px solid ${stakePoolMetadata?.colors?.accent}`
          : '',
      }}
    >
      <div className="relative flex flex-grow items-center justify-center">
        {Object.keys(analytics.data).map((key) => {
          return (
            <div
              key={key}
              className="relative flex flex-grow items-center justify-center text-lg"
            >
              <span
                className={`${
                  stakePoolMetadata?.colors?.fontColor
                    ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                    : 'text-gray-500'
                }`}
              >
                {key}: {(analytics.data![key]! * 100).toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
