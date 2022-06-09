import type { AccountData } from "@cardinal/common";
import type { web3 } from "@project-serum/anchor";
import { BN } from "@project-serum/anchor";
import type { Wallet } from "@saberhq/solana-contrib";
import type { ConfirmOptions, Connection, PublicKey, Signer, Transaction } from "@solana/web3.js";
import type { RewardDistributorData, RewardEntryData } from "./programs/rewardDistributor";
import type { StakeEntryData } from "./programs/stakePool";
export declare const executeTransaction: (connection: Connection, wallet: Wallet, transaction: Transaction, config: {
    silent?: boolean | undefined;
    signers?: web3.Signer[] | undefined;
    confirmOptions?: web3.ConfirmOptions | undefined;
    callback?: ((success: boolean) => void) | undefined;
}) => Promise<string>;
/**
 * Get total supply of mint
 * @param connection
 * @param originalMintId
 * @returns
 */
export declare const getMintSupply: (connection: web3.Connection, originalMintId: web3.PublicKey) => Promise<BN>;
/**
 * Get pending rewards of mintIds for a given reward distributor
 * @param connection
 * @param wallet
 * @param mintIds
 * @param rewardDistributor
 * @returns
 */
export declare const getPendingRewardsForPool: (connection: Connection, wallet: PublicKey, mintIds: PublicKey[], rewardDistributor: AccountData<RewardDistributorData>, UTCNow: number) => Promise<{
    rewardMap: {
        [mintId: string]: {
            claimableRewards: BN;
            nextRewardsIn: BN;
        };
    };
    claimableRewards: BN;
}>;
/**
 * Get the map of rewards for stakeEntry to rewards and next reward time
 * Also return the total claimable rewards from this map
 * @param stakeEntries
 * @param rewardEntries
 * @param rewardDistributor
 * @param remainingRewardAmount
 * @returns
 */
export declare const getRewardMap: (stakeEntries: AccountData<StakeEntryData>[], rewardEntries: AccountData<RewardEntryData>[], rewardDistributor: AccountData<RewardDistributorData>, remainingRewardAmount: BN, UTCNow: number) => {
    rewardMap: {
        [stakeEntryId: string]: {
            claimableRewards: BN;
            nextRewardsIn: BN;
        };
    };
    claimableRewards: BN;
};
/**
 * Calculate claimable rewards and next reward time for a give mint and reward and stake entry
 * @param rewardDistributor
 * @param stakeEntry
 * @param rewardEntry
 * @param remainingRewardAmount
 * @param UTCNow
 * @returns
 */
export declare const calculatePendingRewards: (rewardDistributor: AccountData<RewardDistributorData>, stakeEntry: AccountData<StakeEntryData>, rewardEntry: AccountData<RewardEntryData> | undefined, remainingRewardAmount: BN, UTCNow: number) => [BN, BN];
//# sourceMappingURL=utils.d.ts.map