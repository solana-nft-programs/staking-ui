import type { AnchorTypes } from "@saberhq/anchor-contrib";
import { PublicKey } from "@solana/web3.js";
import * as USE_INVALIDATOR_TYPES from "../../idl/cardinal_use_invalidator";
export declare const USE_INVALIDATOR_ADDRESS: PublicKey;
export declare const USE_INVALIDATOR_SEED = "use-invalidator";
export declare const USE_INVALIDATOR_IDL: USE_INVALIDATOR_TYPES.CardinalUseInvalidator;
export declare type USE_INVALIDATOR_PROGRAM = USE_INVALIDATOR_TYPES.CardinalUseInvalidator;
export declare type UseInvalidatorTypes = AnchorTypes<USE_INVALIDATOR_PROGRAM, {
    tokenManager: UseInvalidatorData;
}>;
declare type Accounts = UseInvalidatorTypes["Accounts"];
export declare type UseInvalidatorData = Accounts["useInvalidator"];
export {};
//# sourceMappingURL=constants.d.ts.map