import { css } from '@emotion/react'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useState } from 'react'

import { contrastify } from './colors'
import { LoadingSpinner } from './LoadingSpinner'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  icon?: JSX.Element
  count?: number
  className?: string
  disabled?: boolean
  loading?: boolean
  inlineLoader?: boolean
  loader?: React.ReactElement
}

export const AsyncButtonSmall: React.FC<Props> = ({
  children,
  onClick,
  className,
  disabled,
  loading,
  inlineLoader,
  loader,
  ...rest
}: Props) => {
  const [loadingClick, setLoadingClick] = useState(false)
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const loaderElement = loader || (
    <LoadingSpinner height="15" className="flex items-center justify-center" />
  )
  return (
    <div
      {...rest}
      className={`flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-light-0 transition-colors hover:bg-primary-hover ${className} ${
        disabled ? 'cursor-default opacity-50' : 'cursor-pointer'
      }`}
      css={css`
        background: ${stakePoolMetadata?.colors?.accent};
        color: ${stakePoolMetadata?.colors?.accent &&
        contrastify(1, stakePoolMetadata?.colors?.accent)};
        &:hover {
          background: ${!disabled &&
          stakePoolMetadata?.colors?.accent &&
          contrastify(0.05, stakePoolMetadata?.colors?.accent)};
        }
      `}
      onClick={async (e) => {
        if (!onClick || disabled) return
        try {
          setLoadingClick(true)
          await onClick(e)
        } finally {
          setLoadingClick(false)
        }
      }}
    >
      {loading || loadingClick ? (
        inlineLoader ? (
          <div className="flex items-center justify-center gap-2">
            {loaderElement}
            {children}
          </div>
        ) : (
          loaderElement
        )
      ) : (
        children
      )}
    </div>
  )
}
