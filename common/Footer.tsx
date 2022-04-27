import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { darken } from 'polished'

export const Footer = () => {
  const { data: stakePoolMetadata } = useStakePoolMetadata()

  return (
    <div
      className="mt-10 py-10"
      style={{
        background: darken(
          0.06,
          stakePoolMetadata?.colors?.primary
            ? stakePoolMetadata?.colors?.primary
            : 'rgb(26, 27, 32)'
        ),
      }}
    >
      <div className="mx-32 flex flex-row justify-start py-10">
        <span className="flex w-3/5 flex-row">
          <img
            className="inline-block h-[40px]"
            src="./cardinal-crosshair.svg"
          />
          <span className="ml-3 text-3xl font-bold">Cardinal</span>
        </span>
        <div className="flex w-1/3 gap-20 self-start text-center">
          <span className="flex flex-col items-start">
            <div className="mb-5 text-xl font-bold">App</div>
            <a href="/" className="text-lg text-gray-400">
              Pools
            </a>
            <a href="/admin" className="text-lg text-gray-400">
              Admin
            </a>
          </span>
          <span className="flex flex-col items-start">
            <div className="mb-5 text-xl font-bold">Resources</div>
            <a
              href="https://docs.cardinal.so/"
              className="text-lg text-gray-400"
            >
              Docs
            </a>
            <a
              href="https://github.com/cardinal-labs"
              className="text-lg text-gray-400"
            >
              Github
            </a>
            <a href="" className="text-lg text-gray-400">
              Terms
            </a>
            <a href="" className="text-lg text-gray-400">
              Privacy
            </a>
          </span>
          <span className="flex flex-col items-start">
            <div className="mb-5 text-xl font-bold">Company</div>
            <a
              href="https://www.cardinal.so/"
              className="text-lg text-gray-400"
            >
              Website
            </a>
            <a href="" className="text-lg text-gray-400">
              Blog
            </a>
            <a
              href="https://twitter.com/cardinal_labs"
              className="text-lg text-gray-400"
            >
              Twitter
            </a>
            <a
              href="https://discord.com/invite/byq6uNTugq"
              className="text-lg text-gray-400"
            >
              Discord
            </a>
          </span>
        </div>
      </div>
      <div className="text-md flex flex-row justify-center font-medium">
        Copyright 2022 Cardinal Labs. All rights reserved
      </div>
    </div>
  )
}
