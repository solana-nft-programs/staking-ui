import { getProgramIdlAccounts } from '@cardinal/rewards-center'
import type { Connection } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'

export const snapshot = async (
  connection: Connection,
  stakePoolId: PublicKey
) => {
  const stakeEntries = await getProgramIdlAccounts(connection, 'stakeEntry', {
    filters: [
      {
        memcmp: {
          offset: 10,
          bytes: stakePoolId.toString(),
        },
      },
    ],
  })
  return stakeEntries
    .filter(
      (entry) =>
        entry.parsed?.lastStaker.toString() !== PublicKey.default.toString()
    )
    .map((e) => {
      return { pubkey: e.pubkey, parsed: e.parsed }
    })
}
