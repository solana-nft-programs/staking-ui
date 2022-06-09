import type { Connection, PublicKey } from "@solana/web3.js";
import type { AccountData } from "../../utils";
import type { TimeInvalidatorData } from "./constants";
export declare const getTimeInvalidator: (connection: Connection, timeInvalidatorId: PublicKey) => Promise<AccountData<TimeInvalidatorData>>;
export declare const getTimeInvalidators: (connection: Connection, timeInvalidatorIds: PublicKey[]) => Promise<AccountData<TimeInvalidatorData>[]>;
export declare const getExpiredTimeInvalidators: (connection: Connection) => Promise<AccountData<TimeInvalidatorData>[]>;
export declare const getAllTimeInvalidators: (connection: Connection) => Promise<AccountData<TimeInvalidatorData>[]>;
//# sourceMappingURL=accounts.d.ts.map