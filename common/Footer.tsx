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
        <div className="xs:text-xs sm:text-xs md:text-xs flex items-center justify-center md:gap-2 text-gray-400">
          <span>Powered by <a target="_blank" href="https://cardinal.so/">Cardinal</a></span>
        </div>
        <div className="xs:text-xs sm:text-xs md:text-xs lg:text-sm flex flex-row justify-center text-gray-400">
          <span>Copyright Sentries. All rights reserved.</span>
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
