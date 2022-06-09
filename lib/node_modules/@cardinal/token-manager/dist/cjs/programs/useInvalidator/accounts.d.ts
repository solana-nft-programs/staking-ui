import type { Connection, PublicKey } from "@solana/web3.js";
import type { AccountData } from "../../utils";
import type { UseInvalidatorData } from "./constants";
export declare const getUseInvalidator: (connection: Connection, useInvalidatorId: PublicKey) => Promise<AccountData<UseInvalidatorData>>;
export declare const getUseInvalidators: (connection: Connection, useInvalidatorIds: PublicKey[]) => Promise<AccountData<UseInvalidatorData>[]>;
//# sourceMappingURL=accounts.d.ts.map