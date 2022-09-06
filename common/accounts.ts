/* eslint-disable @typescript-eslint/no-redeclare */
import {
    AccountInfo,
    InflationReward,
    ParsedAccountData,
    PublicKey,
    StakeProgram,
  } from '@solana/web3.js'
import { Infer, number, nullable, enums, type } from "superstruct"
import { create } from 'superstruct'
import { coerce, instance, string } from "superstruct"
import BN from "bn.js"

export interface StakeAccountMeta {
    address: PublicKey
    seed: string
    lamports: number
    stakeAccount: StakeAccount
    inflationRewards: InflationReward[]
}

export async function promiseAllInBatches<T>(
    tasks: (() => Promise<T>)[],
    batchSize: number
  ) {
    let results: T[] = [];
    while (tasks.length > 0) {
      const currentTasks = tasks.splice(0, batchSize);
      results = results.concat(
        await Promise.all(currentTasks.map((task) => task()))
      );
      console.log('batch finished');
    }
    return results;
  }
  
  export function accounInfoToStakeAccount(
    account: AccountInfo<Buffer | ParsedAccountData>
  ): StakeAccount | undefined {
    return (
      ('parsed' in account?.data && create(account.data.parsed, StakeAccount)) ||
      undefined
    );
  }
  
  export function sortStakeAccountMetas(stakeAccountMetas: StakeAccountMeta[]) {
    stakeAccountMetas.sort((a, b) => {
      if (a.seed < b.seed) {
        return -1;
      } else if (a.seed > b.seed) {
        return 1;
      }
      return 0;
    });
  }

export const BigNumFromString = coerce(instance(BN), string(), (value) => {
  if (typeof value === "string") return new BN(value, 10);
  throw new Error("invalid big num");
});

export const PublicKeyFromString = coerce(
  instance(PublicKey),
  string(),
  (value) => new PublicKey(value)
);

export type StakeAccountType = Infer<typeof StakeAccountType>;
export const StakeAccountType = enums([
  "uninitialized",
  "initialized",
  "delegated",
  "rewardsPool",
]);

export type StakeMeta = Infer<typeof StakeMeta>;
export const StakeMeta = type({
  rentExemptReserve: BigNumFromString,
  authorized: type({
    staker: PublicKeyFromString,
    withdrawer: PublicKeyFromString,
  }),
  lockup: type({
    unixTimestamp: number(),
    epoch: number(),
    custodian: PublicKeyFromString,
  }),
});

export type StakeAccountInfo = Infer<typeof StakeAccountInfo>;
export const StakeAccountInfo = type({
  meta: StakeMeta,
  stake: nullable(
    type({
      delegation: type({
        voter: PublicKeyFromString,
        stake: BigNumFromString,
        activationEpoch: BigNumFromString,
        deactivationEpoch: BigNumFromString,
        warmupCooldownRate: number(),
      }),
      creditsObserved: number(),
    })
  ),
});

export type StakeAccount = Infer<typeof StakeAccount>;
export const StakeAccount = type({
  type: StakeAccountType,
  info: StakeAccountInfo,
});