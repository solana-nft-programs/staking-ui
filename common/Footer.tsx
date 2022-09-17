import { darken, lighten } from 'polished'
import { FaDiscord, FaGithub, FaMedium, FaTwitter } from 'react-icons/fa'
import { contrastColorMode, hexColor } from './utils'

const SOCIALS = {
  discord: { icon: <FaDiscord />, link: 'https://discord.gg/sentries' },
  github: { icon: <FaGithub />, link: 'https://github.com/sentrieshq' },
  medium: { icon: <FaMedium />, link: 'https://sentrieshq.medium.com/' },
  twitter: { icon: <FaTwitter />, link: 'https://twitter.com/sentries_sol' },
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
      className="container relative mx-auto rounded-xl bg-neutral-800 p-6"
    >
      <div
        className="text-md flex items-center justify-between py-8 text-gray-400"
      >
        <div className="flex items-center justify-center gap-2 text-gray-400">
          Powered by <a target="_blank" href="https://cardinal.so/">Cardinal</a>
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
                className={`hover:text-primary opacity-80 transition-opacity hover:opacity-100`}
              >
                {icon}
              </a>
            )
          })}
        </div>
      </div>
      <div className="text-sm flex flex-row justify-center text-gray-400">
        Copyright Sentries. All rights reserved
      </div>
    </div>
  )
}
