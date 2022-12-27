export const TokenImageWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="relative aspect-square w-full grow overflow-hidden rounded-t-xl">
      {children}
    </div>
  )
}
