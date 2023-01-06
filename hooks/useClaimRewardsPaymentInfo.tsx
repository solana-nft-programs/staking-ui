import { fetchIdlAccount } from '@cardinal/rewards-center'
import type { BN } from '@project-serum/anchor'
import { SOLANA_TOKEN_MINT_ADDRESS } from 'api/constants'
import { formatAmountAsDecimal } from 'common/units'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { useTokenList } from 'hooks/useTokenList'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

export const useClaimRewardsPaymentInfo = () => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { connection } = useEnvironmentCtx()
  const { data: rewardMintInfo } = useRewardMintInfo()
  const tokenList = useTokenList()

  return useQuery<
    | {
        naturalAmount: BN
        amount: string
        formattedAmountWithSymbol: string
      }
    | undefined
  >(
    [
      'useClaimRewardsPaymentInfo',
      rewardMintInfo?.mintInfo.address.toString(),
      tokenList.data,
    ],
    async () => {
      if (!rewardDistributorData?.parsed) return
      const claimRewardsPaymentInfo = await fetchIdlAccount(
        connection,
        rewardDistributorData?.parsed.claimRewardsPaymentInfo,
        'paymentInfo'
      )

      if (
        !claimRewardsPaymentInfo?.parsed ||
        !rewardMintInfo?.mintInfo ||
        !tokenList.data
      )
        return

      const isSol =
        claimRewardsPaymentInfo.parsed.paymentMint.toString() ===
        SOLANA_TOKEN_MINT_ADDRESS

      const symbol = isSol
        ? 'SOL'
        : tokenList.data.find((token) => {
            return (
              token.address ===
              claimRewardsPaymentInfo.parsed.paymentMint.toString()
            )
          })?.symbol

      const decimals = isSol
        ? 9
        : tokenList.data.find((token) => {
            return (
              token.address ===
              claimRewardsPaymentInfo.parsed.paymentMint.toString()
            )
          })?.decimals || 0

      const amount = formatAmountAsDecimal(
        decimals,
        claimRewardsPaymentInfo.parsed.paymentAmount,
        9
      )

      return {
        naturalAmount: claimRewardsPaymentInfo.parsed.paymentAmount,
        amount,
        formattedAmountWithSymbol: `${Number(amount)} ${symbol}`,
      }
    }
  )
}
