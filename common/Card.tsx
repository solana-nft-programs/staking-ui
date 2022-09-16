export type Badge = {
  badgeType: 'recent' | 'trending' | 'expiration'
  position?: 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right'
  content?: JSX.Element | string
}
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  header?: string | JSX.Element
  subHeader?: string | JSX.Element
  badges?: Badge[]
  hero?: JSX.Element
  content?: JSX.Element
  skeleton?: boolean
  className?: string
}

export const Card: React.FC<Props> = ({
  header,
  subHeader,
  badges,
  hero,
  content,
  skeleton,
  className,
  ...props
}: Props) => {
  return (
    <div
      {...props}
      className={`${className} relative flex flex-col gap-2 rounded-lg border-[1px] border-border bg-dark-4 p-4`}
    >
      {badges?.map(({ badgeType, position, content }, i) => (
        <div
          key={i}
          className={`absolute z-20 rounded-md bg-dark-5 px-2 py-1 text-sm ${
            {
              'top-right': 'right-6 top-6',
              'top-left': 'left-6 top-6',
              'bottom-right': 'right-6 bottom-6',
              'bottom-left': 'left-6 bottom-6',
            }[position ?? 'top-right']
          }`}
        >
          {
            {
              recent: <span className="text-primary">👋 Recently listed</span>,
              trending: <span className="text-primary">🔥 Trending</span>,
              expiration: <span className="text-light-0">⏰ {content}</span>,
              content: { content },
            }[badgeType]
          }
        </div>
      ))}
      <div className="aspect-square w-full overflow-hidden rounded-xl">
        {skeleton ? (
          <div className="h-full w-full min-w-[320px] animate-pulse bg-border"></div>
        ) : (
          hero
        )}
      </div>
      {header && (
        <div className="text-lg text-white">
          {skeleton ? (
            <div className="h-5 w-[65%] animate-pulse rounded-md bg-border"></div>
          ) : (
            header
          )}
        </div>
      )}
      {subHeader && (
        <div className="text-lg text-primary">
          {skeleton ? (
            <div className="h-6 w-[40%] animate-pulse rounded-md bg-border"></div>
          ) : (
            subHeader
          )}
        </div>
      )}
      {content && (
        <div className="grow">
          {skeleton ? (
            <div className="h-10 w-full animate-pulse rounded-md bg-border"></div>
          ) : (
            content
          )}
        </div>
      )}
    </div>
  )
}
