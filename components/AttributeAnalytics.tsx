import { usePoolAnalytics } from 'hooks/usePoolAnalytics'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

export const AttributeAnalytics = () => {
  const analytics = usePoolAnalytics()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const data = analytics.data
  if (!data || Object.keys(data).length === 0) return <></>
  return (
    <div
      className={`flex w-full flex-col flex-wrap gap-y-5 rounded-xl px-12 py-6 md:flex-row ${
        stakePoolMetadata?.colors?.fontColor ? '' : 'text-gray-200'
      } justify-evenly bg-white bg-opacity-5`}
      style={{
        background: stakePoolMetadata?.colors?.backgroundSecondary,
        border: stakePoolMetadata?.colors?.accent
          ? `2px solid ${stakePoolMetadata?.colors?.accent}`
          : '',
      }}
    >
      {Object.keys(data).map((key, i) => {
        return (
          <>
            <div
              key={key}
              className="flex flex-1 flex-col items-center justify-center"
            >
              <div className="text-lg text-medium-4">{key}</div>
              <div
                className={`text-center text-xl ${
                  stakePoolMetadata?.colors?.fontColor
                    ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                    : 'text-gray-500'
                }`}
              >
                {(data![key]! * 100).toFixed(2)}%
              </div>
            </div>
            {i !== Object.keys(data).length - 1 && (
              <div className="mx-6 my-auto hidden h-10 w-[1px] bg-border md:flex"></div>
            )}
          </>
        )
      })}
    </div>
  )
}
