import { PublicKey } from "@solana/web3.js";
/**
 * Finds the reward entry id.
 * @returns
 */
export declare const findRewardEntryId: (rewardDistributorId: PublicKey, stakeEntryId: PublicKey) => Promise<[PublicKey, number]>;
/**
 * Finds the reward distributor id.
 * @returns
 */
export declare const findRewardDistributorId: (stakePoolId: PublicKey) => Promise<[PublicKey, number]>;
//# sourceMappingURL=pda.d.ts.map