import {
  AccountInfo,
  InflationReward,
  ParsedAccountData,
  PublicKey,
  StakeProgram,
} from '@solana/web3.js'

import { StakeAccount, accounInfoToStakeAccount, sortStakeAccountMetas, promiseAllInBatches } from 'common/accounts'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'
import { useWallet } from '@solana/wallet-adapter-react'

export const STAKE_PROGRAM_ID = new PublicKey('Stake11111111111111111111111111111111111111')

export interface StakeAccountMeta {
  address: PublicKey;
  seed: string;
  lamports: number;
  stakeAccount: StakeAccount;
  inflationRewards: InflationReward[];
}

export const useDbSolStakeAccount = () => {
  const wallet = useWallet()
  const { secondaryConnection } = useEnvironmentCtx()

  const addressString = wallet.publicKey?.toString()
  const addressPub = wallet.publicKey
  //const addressPub = new PublicKey('HtH1rzar5pqmQS27r558JBWNgpsH1Q1e9HafPYc6GTVM')
  return useQuery<StakeAccountMeta[] | undefined>(
    [
      'useDbSolStakeAccount',
      addressPub
    ],
    // @ts-ignore
    async () => {
      let newStakeAccountMetas: StakeAccountMeta[] = [];
      // Create potential solflare seed PDAs
      
      const solflareStakeAccountSeedPubkeys = await Promise.all(
        Array.from(Array(20).keys()).map(async (i) => {
          const seed = `stake:${i}`;
          return PublicKey.createWithSeed(
            // @ts-ignore
            addressPub,
            seed,
            STAKE_PROGRAM_ID
          ).then((pubkey) => ({ seed, pubkey }));
        })
      );

      //console.log(solflareStakeAccountSeedPubkeys)

      const naturalStakeAccountSeedPubkeys = await Promise.all(
        Array.from(Array(20).keys()).map(async (i) => {
          const seed = `${i}`;
          return PublicKey.createWithSeed(
            // @ts-ignore
            addressPub,
            seed,
            STAKE_PROGRAM_ID
          ).then((pubkey) => ({ seed, pubkey }));
        })
      );
      //console.log(naturalStakeAccountSeedPubkeys)
      const parsedStakeAccounts = await secondaryConnection.getParsedProgramAccounts(
        StakeProgram.programId,
        {
          filters: [
            { dataSize: 200 }, // TODO: Trent said we might want to exclude the dataSize filter
            {
              memcmp: {
                offset: 12,
                // @ts-ignore
                bytes: addressPub.toBase58(),
              },
            },
          ],
        }
      );
      //console.log(parsedStakeAccounts)
      parsedStakeAccounts.forEach(({ pubkey, account }) => {
        console.log(
          'parsed' in account?.data
            ? account?.data.parsed
            : 'Does not contain parsed data'
        );
        const stakeAccount = accounInfoToStakeAccount(account);
        //console.log(stakeAccount)
        if (!stakeAccount) {
          return {error: true}
        }
    
        // We identify accounts with the solflare seed, or natural seed only for now
        const matchingSolflareSeed = solflareStakeAccountSeedPubkeys.find(
          (element) => element.pubkey.equals(pubkey)
        )?.seed;
        const matchingNaturalSeed = naturalStakeAccountSeedPubkeys.find((element) =>
          element.pubkey.equals(pubkey)
        )?.seed;
        const seed =
          matchingSolflareSeed ||
          matchingNaturalSeed ||
          `${pubkey.toBase58().slice(12)}...`;
    
        const balanceLamports = account.lamports;
        newStakeAccountMetas.push({
          address: pubkey,
          seed,
          lamports: balanceLamports,
          stakeAccount,
          inflationRewards: [],
        });
      })
      const epochInfo = await secondaryConnection.getEpochInfo();

      if(!newStakeAccountMetas || newStakeAccountMetas.length < 1){
        return {error: true}
      }

      const delegatedActivationEpochs = newStakeAccountMetas
        .filter((meta) => meta.stakeAccount.info.stake?.delegation.activationEpoch)
        .map(
          (meta) =>
            meta.stakeAccount.info.stake?.delegation.activationEpoch?.toNumber() ??
            1000
        ); // null coallescing not possible here

      if (delegatedActivationEpochs.length !== 0) {
        const minEpoch = epochInfo.epoch - 1; // Change this to bigger
        // Math.max(
        //   ...delegatedActivationEpochs,
        // );
        sortStakeAccountMetas(newStakeAccountMetas);
      }
      // @ts-ignore
      //console.log(inflationRewardsResults)
      //console.log(newStakeAccountMetas)
      return newStakeAccountMetas;
    },{
      retry: 2,
    }
  )
}