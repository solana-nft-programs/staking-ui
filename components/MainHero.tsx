import { GlyphPlus } from 'assets/GlyphPlus'
import { statsNameMapping, useGlobalStats } from 'hooks/useGlobalStats'
import { useRouter } from 'next/router'

export const MainHero = () => {
  const stats = useGlobalStats()
  const router = useRouter()
  return (
    <div className="flex flex-wrap justify-between gap-10 px-8 py-24 md:px-16">
      <div className="flex flex-col gap-2">
        <div className="text-5xl text-light-0">Staking</div>
        <div className="text-lg text-medium-3">
          Lock your NFTs or tokens to earn rewards from various reward
          mechanisms including
          <br />
          tokens, merchandise, redeemable rewards, referral tokens and more.
        </div>
      </div>
      <div className="flex flex-col items-end justify-end gap-5 ">
        <div className="flex items-center gap-2 lg:gap-6">
          <div className="text-lg text-medium-3">
            Does your NFT collection or tokens need staking?
          </div>
          <div
            className="flex cursor-pointer items-center gap-1 rounded-lg bg-primary p-3 text-light-0 transition-colors hover:bg-primary-hover"
            onClick={() => {
              router.push('/admin')
            }}
          >
            <>Create your pool</>
            <GlyphPlus />
          </div>
        </div>
        <div className="flex w-fit gap-3 rounded-xl border-[2px] border-border p-4">
          {statsNameMapping.map(({ displayName, key }) => (
            <div className="flex items-center gap-2" key={key}>
              <div className="text-medium-3">{displayName}</div>
              <div className="text-light-0">
                {stats.data && stats.data[displayName] ? (
                  Number(
                    stats.data[displayName]!.data.parsed.value
                  ).toLocaleString('en-US')
                ) : (
                  <div className="mt-[1px] h-5 w-12 animate-pulse rounded-md bg-border" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
