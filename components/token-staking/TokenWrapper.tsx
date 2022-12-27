import classNames from 'classnames'
import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

export interface TokenWrapperProps {
  select: (tokenData: any) => void
  selected: boolean
  children: React.ReactNode
  token: AllowedTokenData
}

export const TokenWrapper = ({
  token,
  children,
  selected,
  select,
}: TokenWrapperProps) => {
  const { data: stakePoolMetadata } = useStakePoolMetadata()

  return (
    <div
      className={classNames([
        'relative flex cursor-pointer flex-col rounded-xl outline outline-4',
        {
          'shadow-lg outline-orange-500':
            selected && !stakePoolMetadata?.colors?.secondary,
          'outline-gray-700': !selected,
        },
      ])}
      onClick={() => select(token)}
      style={{
        outlineColor: selected ? stakePoolMetadata?.colors?.secondary : '',
        boxShadow: selected
          ? `0px 0px 20px ${stakePoolMetadata?.colors?.secondary || '#FFFFFF'}`
          : '',
      }}
    >
      {children}
    </div>
  )
}
