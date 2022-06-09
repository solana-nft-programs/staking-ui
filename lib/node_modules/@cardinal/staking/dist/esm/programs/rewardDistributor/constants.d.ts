import type { AnchorTypes } from "@saberhq/anchor-contrib";
import { PublicKey } from "@solana/web3.js";
import * as REWARD_DISTRIBUTOR_TYPES from "../../idl/cardinal_reward_distributor";
export declare const REWARD_DISTRIBUTOR_ADDRESS: PublicKey;
export declare const REWARD_MANAGER: PublicKey;
export declare const REWARD_ENTRY_SEED = "reward-entry";
export declare const REWARD_DISTRIBUTOR_SEED = "reward-distributor";
export declare type REWARD_DISTRIBUTOR_PROGRAM = REWARD_DISTRIBUTOR_TYPES.CardinalRewardDistributor;
export declare const REWARD_DISTRIBUTOR_IDL: REWARD_DISTRIBUTOR_TYPES.CardinalRewardDistributor;
export declare type RewardDistributorTypes = AnchorTypes<REWARD_DISTRIBUTOR_PROGRAM>;
declare type Accounts = RewardDistributorTypes["Accounts"];
export declare type RewardEntryData = Accounts["rewardEntry"];
export declare type RewardDistributorData = Accounts["rewardDistributor"];
export declare enum RewardDistributorKind {
    Mint = 1,
    Treasury = 2
}
export {};
//# sourceMappingURL=constants.d.ts.map