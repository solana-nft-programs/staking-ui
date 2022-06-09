import type { Connection, PublicKey } from "@solana/web3.js";
import type { AccountData } from "../../utils";
import type { PaidClaimApproverData } from "./constants";
export declare const getClaimApprover: (connection: Connection, tokenManagerId: PublicKey) => Promise<AccountData<PaidClaimApproverData>>;
export declare const getClaimApprovers: (connection: Connection, claimApproverIds: PublicKey[]) => Promise<AccountData<PaidClaimApproverData>[]>;
export declare const getAllClaimApprovers: (connection: Connection) => Promise<AccountData<PaidClaimApproverData>[]>;
//# sourceMappingURL=accounts.d.ts.map