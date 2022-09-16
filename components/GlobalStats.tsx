import { useGlobalStats } from 'hooks/useGlobalStats'

export const GlobalStats = () => {
  const stats = useGlobalStats()
  return !stats.isFetched ? (
    <></>
  ) : stats.data ? (
    <div className="flex flex-wrap justify-center md:flex-nowrap lg:flex lg:flex-row">
      {Object.keys(stats.data).map((name, i) => {
        return (
          <div key={i} className="mx-5 gap-1 pt-2 text-xs">
            <span className="font-semibold">{name}:</span>
            <span className="ml-2 text-green-500">
              {Number(stats.data![name]!.data.parsed.value).toLocaleString()}
            </span>
          </div>
        )
      })}
    </div>
  ) : (
    <></>
  )
}
