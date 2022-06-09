import type { AnchorTypes } from "@saberhq/anchor-contrib";
import { PublicKey } from "@solana/web3.js";
import * as TIME_INVALIDATOR_TYPES from "../../idl/cardinal_time_invalidator";
export declare const TIME_INVALIDATOR_ADDRESS: PublicKey;
export declare const TIME_INVALIDATOR_SEED = "time-invalidator";
export declare const TIME_INVALIDATOR_IDL: TIME_INVALIDATOR_TYPES.CardinalTimeInvalidator;
export declare type TIME_INVALIDATOR_PROGRAM = TIME_INVALIDATOR_TYPES.CardinalTimeInvalidator;
export declare type TimeInvalidatorTypes = AnchorTypes<TIME_INVALIDATOR_PROGRAM, {
    tokenManager: TimeInvalidatorData;
}>;
declare type Accounts = TimeInvalidatorTypes["Accounts"];
export declare type TimeInvalidatorData = Accounts["timeInvalidator"];
export {};
//# sourceMappingURL=constants.d.ts.map