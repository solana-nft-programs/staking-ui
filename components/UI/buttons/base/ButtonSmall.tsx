import { css } from '@emotion/react'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { useState } from 'react'

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children: JSX.Element | string
  className?: string
  loading?: boolean
  disabled?: boolean
  accented?: boolean
  onClick?: () => void
}

export const ButtonSmall: React.FC<Props> = ({
  children,
  onClick,
  className,
  loading,
  disabled,
  ...props
}: Props) => {
  const [loadingClick, setLoadingClick] = useState(false)
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-1 rounded-xl border-[0px] border-border bg-white bg-opacity-10 px-3 py-2 transition-all ${className} ${
        disabled
          ? 'cursor-default opacity-50'
          : 'cursor-pointer hover:bg-opacity-5'
      }`}
      css={css`
        white-space: break-spaces;
      `}
      onClick={async () => {
        if (!onClick) return
        try {
          setLoadingClick(true)
          await onClick()
        } finally {
          setLoadingClick(false)
        }
      }}
    >
      {loadingClick || loading ? <LoadingSpinner height="25px" /> : children}
    </button>
  )
}
