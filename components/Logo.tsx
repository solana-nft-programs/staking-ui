import React from 'react'
import logo from '../images/logo.svg'

export function Logo() {
  return (
    <a
      target="_blank"
      rel="nofollow noreferrer"
      href="https://sentries.io"
      className="flex cursor-pointer text-xl font-semibold outline-2 outline-cyan-500 transition-opacity hover:opacity-60 active:outline"
    >
      <div className="flex flex-row">
        <img
          className="flex h-[55px] flex-col"
          src={logo.src}
          alt="Sentries logo"
        />
      </div>
    </a>
  )
}
