import { TipHeading } from '@/components/stake-pool-creation/tip-layout/TipHeading'

export type PrimaryTipLayoutProps = {
  children: React.ReactNode
  title: string
}

export const PrimaryTipLayout = ({
  children,
  title,
}: PrimaryTipLayoutProps) => {
  return (
    <>
      <TipHeading text={title} />
      <div className="max-w-md px-4 text-center">{children}</div>
    </>
  )
}
