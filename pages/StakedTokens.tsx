import { AccountData } from '@cardinal/common'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getStakePool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { STAKE_POOL_ID } from 'api/constants'
import { TokenData } from 'api/types'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakedTokenData } from 'providers/StakedTokenDataProvider'
import { useEffect, useState } from 'react'

export function StakedTokens() {
  const { connection } = useEnvironmentCtx()
  const { stakedTokenDatas, stakedLoaded } = useStakedTokenData()
  const [filteredTokens, setFilteredTokens] = useState<TokenData[]>([])

  const filterTokens = async () => {
    const stakePool = await getStakePool(connection, STAKE_POOL_ID)
    if (!stakePool) {
      return stakedTokenDatas
    }

    return stakedTokenDatas.filter((token) => {
      let valid = false
      const creatorAddresses = stakePool.parsed.requiresCreators
      const collectionAddresses = stakePool.parsed.requiresCollections
      creatorAddresses.forEach((filterCreator) => {
        if (
          token?.metadata?.data?.properties?.creators.some(
            (creator: { address: string }) =>
              creator.address === filterCreator.toString()
          )
        ) {
          valid = true
        }
      })
      return valid
    })
  }

  useEffect(() => {
    const filtered = async () => {
      let data = await filterTokens()
      setFilteredTokens(data)
    }
    filtered().catch(console.error);
  }, [])
//   const isTokenSelected = (tk: TokenData) => selectedTokens.includes(tk)

  return (
    <div className="my-3 flex-auto overflow-auto">
      <div className="my-auto mb-4  rounded-md bg-white bg-opacity-5 p-5">
        {loaded ? (
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3">
            {filteredTokens.map((tk) => (
              <div
                className="relative"
                key={tk?.tokenAccount?.pubkey.toBase58()}
              >
                <label
                  htmlFor={tk?.tokenAccount?.pubkey.toBase58()}
                  className="relative"
                >
                  <div className="relative">
                    <img
                      className="mt-2 rounded-lg"
                      src={tk.metadata?.data.image}
                      alt={tk.metadata?.data.name}
                    ></img>

                    <input
                      type="checkbox"
                      // checked={isJamboSelected(token)}
                      className="absolute top-[8px] right-[8px] h-4 w-4 rounded-sm text-green-600"
                      id={tk?.tokenAccount?.pubkey.toBase58()}
                      name={tk?.tokenAccount?.pubkey.toBase58()}
                    //   onChange={() => {
                    //     if (isTokenSelected(tk)) {
                    //       setSelectedTokens((tks) =>
                    //         tks.filter(
                    //           (data) =>
                    //             data.tokenAccount?.account.data.parsed.info.mint.toString() !==
                    //             tk.tokenAccount?.account.data.parsed.info.mint.toString()
                    //         )
                    //       )
                    //     } else {
                    //       setSelectedTokens((tokens) => tokens.concat(tk))
                    //     }
                    //   }}
                    />
                  </div>
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading your NFTs...</p>
        )}
      </div>
    </div>
  )
}
