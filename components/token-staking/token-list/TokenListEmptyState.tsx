interface TokenListEmptyStateProps {
  fontColor?: string | undefined
  message: string
}

export const TokenListEmptyState = ({
  fontColor,
  message,
}: TokenListEmptyStateProps) => {
  return (
    <p
      className={`font-normal ${
        fontColor ? `text-[${fontColor}]` : 'text-gray-400'
      }`}
    >
      {message}
    </p>
  )
}
