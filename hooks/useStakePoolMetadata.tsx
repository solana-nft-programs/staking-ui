import { tryNull, tryPublicKey } from '@cardinal/common'
import {
  getConfigEntry,
  getConfigEntryById,
} from '@cardinal/configs/dist/cjs/programs/accounts'
import type { Connection } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import type { StakePoolMetadata } from 'api/mapping'
import { stakePoolsWithHostnames } from 'api/mapping'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const useStakePoolMetadata = (hostname?: string) => {
  const { connection } = useEnvironmentCtx()
  const {
    query: { stakePoolId },
  } = useRouter()

  return useQuery(
    ['useStakePoolMetadata', stakePoolId?.toString()],
    async () => {
      const hostnameConfigFound = stakePoolsWithHostnames.find((config) =>
        hostname?.includes(config.hostname)
      )
      if (!hostnameConfigFound && !stakePoolId) return null
      return stakePoolConfig(
        connection,
        hostnameConfigFound?.stakePoolAddress ?? stakePoolId!.toString()
      )
    }
  )
}

export const stakePoolConfig = async (
  connection: Connection,
  key: string
): Promise<StakePoolMetadata | null> => {
  const stakePoolIdPubkey = tryPublicKey(key)
  if (!stakePoolIdPubkey) {
    const configEntryData = await tryNull(
      getConfigEntry(
        connection,
        Buffer.from('s', 'utf-8'),
        Buffer.from(key, 'utf-8')
      )
    )
    if (configEntryData?.parsed) {
      return JSON.parse(configEntryData.parsed.value)
    }
  } else {
    const reverseConfigEntryData = await tryNull(
      getConfigEntry(
        connection,
        Buffer.from('s', 'utf-8'),
        stakePoolIdPubkey.toBuffer()
      )
    )
    if (reverseConfigEntryData?.parsed) {
      if (reverseConfigEntryData?.parsed.extends.length === 0) {
        throw 'Invalid Pool Configuration'
      }
      const configEntryId = reverseConfigEntryData?.parsed.extends[0]
      const configEntryData = await tryNull(
        getConfigEntryById(connection, configEntryId!)
      )
      if (configEntryData?.parsed) {
        return JSON.parse(configEntryData?.parsed.value)
      }
    }
  }
  return null
}
