import { FaDiscord, FaGithub, FaMedium, FaTwitter } from 'react-icons/fa'

const SOCIALS = {
  discord: { icon: <FaDiscord />, link: 'https://discord.gg/sentries' },
  github: { icon: <FaGithub />, link: 'https://github.com/sentrieshq' },
  medium: { icon: <FaMedium />, link: 'https://sentrieshq.medium.com/' },
  twitter: { icon: <FaTwitter />, link: 'https://twitter.com/sentries_sol' },
}

export const Footer = () => {
  return (
    <div
      className="container relative mx-auto rounded-xl bg-neutral-900 bg-opacity-70 p-6 mb-6"
    >
      <div
        className="text-md flex items-center justify-between text-gray-400"
      >
        <div className="flex items-center justify-center gap-2 text-gray-400">
          Powered by <a target="_blank" href="https://cardinal.so/">Cardinal</a>
        </div>
        <div className="text-sm flex flex-row justify-center text-gray-400">
        Copyright Sentries. All rights reserved
      </div>
        <div className="flex gap-4 text-gray-200">
          {Object.entries(SOCIALS).map(([id, { icon, link }]) => {
            return (
              <a
                key={id}
                href={link}
                target="_blank"
                rel="noreferrer"
                className={`hover:text-primary opacity-80 transition-opacity hover:opacity-100`}
              >
                {icon}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
