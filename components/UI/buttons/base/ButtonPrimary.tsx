import { css } from '@emotion/react'
import classNames from 'classnames/dedupe'
import { contrastify } from 'common/colors'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useState } from 'react'

export type ButtonPrimary = {
  buttonWidths: 'NARROW' | 'MID'
  buttonColors: 'ORANGE' | 'TRANSPARENT'
}

export interface ButtonPrimaryProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  icon?: JSX.Element
  count?: number
  className?: string
  disabled?: boolean
  loading?: boolean
  inlineLoader?: boolean
  loader?: React.ReactElement
  width?: ButtonPrimary['buttonWidths']
  color?: ButtonPrimary['buttonColors']
  colorized?: boolean
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  children,
  onClick,
  className,
  disabled,
  loading,
  inlineLoader,
  loader,
  color = 'ORANGE',
  width = 'MID',
  colorized = true,
  ...rest
}: ButtonPrimaryProps) => {
  const [loadingClick, setLoadingClick] = useState(false)
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const loaderElement = loader || (
    <LoadingSpinner height="15" className="flex items-center justify-center" />
  )

  return (
    <button
      {...rest}
      className={classNames([
        'flex items-center justify-center rounded-lg px-8 py-2 transition-colors',
        {
          'w-auto': width === 'NARROW',
          'min-w-[230px]': width === 'MID',
          'cursor-default opacity-50': disabled,
          'cursor-pointer bg-orange-500 text-white hover:bg-primary-hover':
            !disabled && color === 'ORANGE',
          'cursor-pointer bg-transparent text-gray-400':
            !disabled && color === 'TRANSPARENT',
        },
        className,
      ])}
      css={
        colorized &&
        css`
          background: ${stakePoolMetadata?.colors?.secondary} !important;
          color: ${stakePoolMetadata?.colors?.secondary &&
          contrastify(1, stakePoolMetadata?.colors?.secondary)} !important;
          &:hover {
            background: ${!disabled &&
            stakePoolMetadata?.colors?.secondary &&
            contrastify(0.05, stakePoolMetadata?.colors?.secondary)} !important;
          }
        `
      }
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
    </button>
  )
}
