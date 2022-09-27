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
  colorized,
  content,
  className,
}: Props) => {
  const { data: config } = useStakePoolMetadata()
  return (
    <div
      className={`relative z-0 flex items-center gap-4 overflow-hidden rounded-xl px-8 py-4 text-xl ${
        config?.colors?.fontColor ? '' : 'text-gray-200'
      } bg-white bg-opacity-5 ${className}`}
      style={{
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
      <div className="text-white">
        {icon &&
          {
            time: <MdAccessTimeFilled />,
            featured: <AiFillStar />,
            available: (
              <MdSell className="h-[68px] w-[68px] rounded-full border-[2px] border-medium-4 p-3" />
            ),
            info: <GlyphQuestion />,
            activity: (
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-[2px] border-medium-4 p-3">
                <div className="scale-[2]">
                  <GlyphActivity />
                </div>
              </div>
            ),
            performance: <GlyphPerformance />,
          }[icon]}
      </div>
      <div className="flex flex-col">
        <div className="text-medium-3">{header}</div>
        <div className="text-light-0">{description}</div>
      </div>
      {content}
    </div>
  )
}
