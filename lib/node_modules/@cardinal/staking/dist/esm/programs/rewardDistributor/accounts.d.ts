import type { AccountData } from "@cardinal/common";
import type { Connection, PublicKey } from "@solana/web3.js";
import type { RewardDistributorData, RewardEntryData } from "./constants";
export declare const getRewardEntry: (connection: Connection, rewardEntryId: PublicKey) => Promise<AccountData<RewardEntryData>>;
export declare const getRewardEntries: (connection: Connection, rewardEntryIds: PublicKey[]) => Promise<AccountData<RewardEntryData>[]>;
export declare const getRewardDistributor: (connection: Connection, rewardDistributorId: PublicKey) => Promise<AccountData<RewardDistributorData>>;
export declare const getRewardDistributors: (connection: Connection, rewardDistributorIds: PublicKey[]) => Promise<AccountData<RewardDistributorData>[]>;
export declare const getRewardEntriesForRewardDistributor: (connection: Connection, rewardDistributorId: PublicKey) => Promise<AccountData<RewardEntryData>[]>;
export declare const getAllRewardEntries: (connection: Connection) => Promise<AccountData<RewardEntryData>[]>;
//# sourceMappingURL=accounts.d.ts.map