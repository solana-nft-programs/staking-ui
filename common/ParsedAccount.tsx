import { tryPublicKey } from '@solana-nft-programs/common'
import type { PublicKey } from '@solana/web3.js'
import Image from 'next/image'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { ShortPubKeyUrl } from './Pubkeys'

export const ParsedAccount = ({
  data,
}: {
  data?: { parsed: { [k: string]: any }; pubkey: PublicKey } | null
}) => {
  const { environment } = useEnvironmentCtx()
  if (!data) return <></>
  return (
    <div className="overflow-hidden rounded-t-lg border-[1px] border-border">
      <div className="bold flex justify-between gap-4 bg-border py-2 px-2 font-bold">
        <div>Address</div>
        <div className="flex items-center gap-2">
          <ShortPubKeyUrl
            pubkey={data.pubkey}
            cluster={environment.label}
            className="text-base text-blue-500 hover:underline"
          />
          <Image src="/logos/solana-explorer.png" width={14} height={14} />
        </div>
      </div>
      {Object.entries(data.parsed).map(([k, v], i) => (
        <div
          key={i}
          className={`flex justify-between gap-4 px-2 py-1 ${
            i % 2 === 1 ? 'bg-dark-4' : ''
          }`}
        >
          <div>{k}</div>
          <div>
            {tryPublicKey(v?.toString()) ? (
              <ShortPubKeyUrl
                pubkey={tryPublicKey(v)!}
                cluster={environment.label}
                className="text-base text-blue-500 hover:underline"
              />
            ) : (
              v?.toString() ?? '-'
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
