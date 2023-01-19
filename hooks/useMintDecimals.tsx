import { PublicKey } from '@solana/web3.js'
import { useMintInfo } from 'hooks/useMintInfo'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export const useMintDecimals = (mint: PublicKey | undefined) => {
  const { data: mintInfo } = useMintInfo(
    mint?.toString() === PublicKey.default.toString() ? undefined : mint
  )

  const isSol = () => {
    return mint?.toString() === PublicKey.default.toString()
  }

  const [mintDecimals, setMintDecimals] = useState<number | undefined>(
    undefined
  )

  useEffect(() => {
    if (!mint || !mintInfo) return
    console.log('mintInfo', mintInfo)
    setMintDecimals(mintInfo.decimals)
  }, [mint, mintInfo])

  return useQuery<number | undefined>(
    ['useRewardMintInfo', mint?.toString()],
    async () => {
      if (!mint) return
      if (isSol()) return 9
      return mintDecimals
    },
    {
      enabled: !!mintInfo, // make sure u have mintInfo.isFetched as a boolean for whether useMintDecimals is enabled
    }
  )
}
