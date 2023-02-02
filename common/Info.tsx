import { GlyphActivity } from 'assets/GlyphActivity'
import { GlyphPerformance } from 'assets/GlyphPerformance'
import { GlyphQuestion } from 'assets/GlyphQuestion'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { AiFillStar } from 'react-icons/ai'
import { MdAccessTimeFilled, MdSell } from 'react-icons/md'

export type InfoIcon =
  | 'time'
  | 'featured'
  | 'available'
  | 'info'
  | 'performance'
  | 'activity'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  colorized?: boolean
  header?: string
  description?: string
  content?: React.ReactNode
  icon?: InfoIcon
}
export const Info: React.FC<Props> = ({
  header,
  description,
  icon,
  content,
  className,
}: Props) => {
  const { data: config } = useStakePoolMetadata()
  return (
    <div
      className={`relative z-0 flex flex-col items-center overflow-hidden rounded-xl bg-white bg-opacity-5 px-8 py-4 text-center text-xl md:flex-row md:text-left ${className}`}
      style={{
        color: config?.colors?.fontColor,
        background: config?.colors?.backgroundSecondary,
        border: config?.colors?.accent
          ? `2px solid ${config?.colors?.accent}`
          : '',
      }}
    >
      {/* <div
        className="blur-4xl absolute left-10 -z-10 h-[180px] w-[30%] -rotate-[60deg] bg-glow blur-[190px]"
        css={
          colorized &&
          css`
            background: ${config?.colors?.accent} !important;
          `
        }
      />
      <div
        className="blur-4xl absolute right-40 -z-10 h-[180px] w-[20%] rotate-[60deg] bg-glow blur-[150px]"
        css={
          colorized &&
          css`
            background: ${config?.colors?.accent} !important;
          `
        }
      /> */}
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <div>
          {icon &&
            {
              time: <MdAccessTimeFilled color={config?.colors?.fontColor} />,
              featured: <AiFillStar color={config?.colors?.fontColor} />,
              available: (
                <MdSell
                  className="h-[68px] w-[68px] rounded-full border-[2px] border-medium-4 p-3"
                  color={config?.colors?.fontColor}
                />
              ),
              info: <GlyphQuestion color={config?.colors?.fontColor} />,
              activity: (
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-[2px] border-medium-4 p-3">
                  <div className="scale-[2]">
                    <GlyphActivity color={config?.colors?.fontColor} />
                  </div>
                </div>
              ),
              performance: (
                <GlyphPerformance color={config?.colors?.fontColor} />
              ),
            }[icon]}
        </div>
        <div className="flex flex-col">
          <div>{header}</div>
          <div className="text-sm opacity-75">{description}</div>
        </div>
      </div>
      {content}
    </div>
  )
}
