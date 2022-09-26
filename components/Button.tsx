import { ReactNode } from "react"
import arrow from '../images/long-arrow.svg'

type ButtonProps = {
  as: 'a' | 'button',
  hasArrow?: boolean,
  children: ReactNode,
  onClick?: () => void,
  variant?: 'primary' | 'secondary',
  size?: 'base' | 'sm'
}

export function Button(props: ButtonProps) {
  const { 
    as = 'button', 
    children, 
    hasArrow, 
    variant = 'primary',
    size = 'base',
    ...rest 
  } = props

  const Tag = as

  const sizes = {
    base: 'px-7 py-4',
    sm: 'px-4 py-2'
  }

  const variants = {
    primary: 'bg-purple-400 hover:bg-opacity-70',
    secondary: 'bg-neutral-800 hover:bg-neutral-700'
  }

  return (
    <Tag
      className={`${variants[variant]} ${sizes[size]} text-white rounded-full text-sm flex items-center gap-2  transition-colors focus:outline outline-teal-400 outline-2`}
      {...rest}
    >
      <span>  
        {children}
      </span>
      {hasArrow ? <img className="xs:hidden sm:hidden md:block" src={arrow.src} alt="arrow" /> : null}
    </Tag>
  )
}