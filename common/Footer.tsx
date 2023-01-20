import { darken, lighten } from 'polished'
import { FaDiscord, FaGithub, FaMedium, FaTwitter } from 'react-icons/fa'

import { contrastColorMode } from './utils'

export const SOCIALS = {
  discord: { icon: <FaDiscord />, link: 'https://discord.gg/byq6uNTugq' },
  github: { icon: <FaGithub />, link: 'https://github.com/cardinal-labs' },
  medium: { icon: <FaMedium />, link: 'https://cardinal-labs.medium.com/' },
  twitter: { icon: <FaTwitter />, link: 'https://twitter.com/cardinal_labs' },
}

export const Footer = ({
  bgColor = 'rgb(26, 27, 32)',
  accentColor = '#FFFFFF',
}: {
  bgColor?: string
  accentColor?: string
}) => {
  return (
    <div
      className="px-10 md:px-32"
      style={{
        background: darken(0.03, bgColor),
      }}
    >
      <div className="flex w-full flex-wrap items-start justify-between gap-10 py-10">
        <div className="flex items-center">
          <img
            alt={bgColor}
            className="inline-block h-[28px]"
            src={
              contrastColorMode(bgColor)[1]
                ? '/cardinal-crosshair.svg'
                : '/cardinal-crosshair-dark.svg'
            }
          />
          <span
            className="ml-3 text-2xl font-semibold"
            style={{ color: lighten(0.4, contrastColorMode(bgColor)[0]) }}
          >
            Cardinal
          </span>
        </div>
        <div className="flex gap-10 self-end text-center md:gap-20">
          <span className="flex flex-col items-start gap-1">
            <div
              className="mb-2 text-lg font-semibold"
              style={{ color: lighten(0.4, contrastColorMode(bgColor)[0]) }}
            >
              App
            </div>
            <a href="/" className="text-gray-400">
              Pools
            </a>
            <a href="/admin" className="text-gray-400">
              Admin
            </a>
          </span>
          <span className="flex flex-col items-start gap-1">
            <div
              className="mb-2 text-lg font-semibold"
              style={{ color: lighten(0.4, contrastColorMode(bgColor)[0]) }}
            >
              Resources
            </div>
            <a href="https://docs.cardinal.so/" className="text-gray-400">
              Documentation
            </a>
            <a
              href="https://github.com/cardinal-labs"
              className="text-gray-400"
            >
              Github
            </a>
            <a href="mailto:team@cardinal.so" className="text-gray-400">
              Contact
            </a>
            {/*<a href="" className="text-gray-400">
              Privacy
            </a> */}
          </span>
          {/* <span className="flex flex-col items-start">
            <div className="mb-5 text-lg font-semibold">Company</div>
            <a href="https://www.cardinal.so/" className="text-gray-400">
              Website
            </a>
            <a href="" className="text-gray-400">
              Blog
            </a>
            <a
              href="https://twitter.com/cardinal_labs"
              className="text-gray-400"
            >
              Twitter
            </a>
            <a
              href="https://discord.com/invite/byq6uNTugq"
              className="text-gray-400"
            >
              Discord
            </a>
          </span> */}
        </div>
      </div>
      <div
        className="text-md flex items-center justify-between border-t py-8 text-gray-400"
        style={{ borderColor: lighten(0.2, bgColor) }}
      >
        <div className="flex items-center justify-center gap-2 text-gray-400">
          Powered by Cardinal
        </div>
        <div className="flex gap-4 text-gray-200">
          {Object.entries(SOCIALS).map(([id, { icon, link }]) => {
            return (
              <a
                key={id}
                href={link}
                target="_blank"
                rel="noreferrer"
                style={{ color: accentColor }}
                className={`opacity-80 transition-opacity hover:text-primary hover:opacity-100`}
              >
                {icon}
              </a>
            )
          })}
        </div>
      </div>
      {/* <div className="text-md flex flex-row justify-center font-medium">
        Copyright 2022 Cardinal Labs. All rights reserved
      </div> */}
    </div>
  )
}
