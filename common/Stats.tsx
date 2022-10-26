export const Stats = ({
  stats,
}: {
  stats: { header: string; value: string | JSX.Element }[]
}) => {
  return (
    <div className="flex w-full justify-evenly rounded-lg bg-dark-6 py-2">
      {stats?.map((stat, i) => (
        <div key={stat.header} className="flex w-full justify-center">
          <div
            key={`${stat.header}-${stat.value}`}
            className={`flex w-full flex-col items-center gap-[2px] text-medium-4`}
          >
            <div>{stat.header}</div>
            <div className="text-light-0">{stat.value}</div>
          </div>
          {i < stats.length - 1 && (
            <div className="h-full w-[2px] bg-border"></div>
          )}
        </div>
      ))}
    </div>
  )
}
