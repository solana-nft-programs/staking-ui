import { css } from '@emotion/react'
import { useEffect } from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  onDismiss: () => void
}

export const Modal: React.FC<Props> = ({
  isOpen,
  children,
  onDismiss,
  className,
  ...props
}: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const close = (e: { keyCode: number }) => {
      if (e.keyCode === 27) {
        onDismiss()
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return (
    <div
      {...props}
      onClick={() => onDismiss()}
      className={`fixed z-50 flex h-screen w-screen justify-center overflow-scroll bg-light-0 bg-opacity-[0.05] transition-all duration-300 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      css={css`
        ${isOpen
          ? 'opacity: 100; backdrop-filter: blur(15px);'
          : 'opacity: 0; backdrop-filter: blur(0px);'}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        css={css`
          box-shadow: rgba(255, 255, 255, 0.15) 0px 0px 48px;
        `}
        className={`${className} my-[10vh] h-fit w-[560px] max-w-[98vw] rounded-xl transition-all `}
      >
        {children}
      </div>
    </div>
  )
}
