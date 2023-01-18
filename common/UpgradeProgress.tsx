import { css } from '@emotion/react'

export const UpgradeProgress = ({
  progress,
  total,
}: {
  progress: number
  total: number
}) => {
  const pct = progress / total
  return (
    <div className="relative h-8 w-full overflow-hidden rounded-xl bg-white bg-opacity-10">
      <div
        className="absolute h-full bg-primary"
        css={css`
          width: ${pct * 100}%;
        `}
      />
      <div className="absolute flex h-full w-full items-center justify-center gap-2 text-sm">
        <div>{progress.toString()}</div>
        <>
          <div>/</div>
          {total}
        </>
      </div>
      <div className="absolute right-5 flex h-full items-center text-sm">
        <div className="h-2 w-2 animate-ping rounded-full bg-light-0" />
      </div>
    </div>
  )
}
