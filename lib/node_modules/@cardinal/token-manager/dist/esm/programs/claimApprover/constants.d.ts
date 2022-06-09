import type { AnchorTypes } from "@saberhq/anchor-contrib";
import { PublicKey } from "@solana/web3.js";
import * as CLAIM_APPROVER_TYPES from "../../idl/cardinal_paid_claim_approver";
export declare const CLAIM_APPROVER_ADDRESS: PublicKey;
export declare const CLAIM_APPROVER_SEED = "paid-claim-approver";
export declare const CLAIM_APPROVER_IDL: CLAIM_APPROVER_TYPES.CardinalPaidClaimApprover;
export declare type CLAIM_APPROVER_PROGRAM = CLAIM_APPROVER_TYPES.CardinalPaidClaimApprover;
export declare type ClaimApproverTypes = AnchorTypes<CLAIM_APPROVER_PROGRAM, {
    tokenManager: PaidClaimApproverData;
}>;
declare type Accounts = ClaimApproverTypes["Accounts"];
export declare type PaidClaimApproverData = Accounts["paidClaimApprover"];
export {};
//# sourceMappingURL=constants.d.ts.map