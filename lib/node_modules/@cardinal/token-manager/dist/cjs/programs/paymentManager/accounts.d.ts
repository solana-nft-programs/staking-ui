import type { Connection, PublicKey } from "@solana/web3.js";
import type { AccountData } from "../../utils";
import type { PaymentManagerData } from ".";
export declare const getPaymentManager: (connection: Connection, paymentManagerId: PublicKey) => Promise<AccountData<PaymentManagerData>>;
export declare const getPaymentManagers: (connection: Connection, paymentManagerIds: PublicKey[]) => Promise<AccountData<PaymentManagerData>[]>;
export declare const getAllPaymentManagers: (connection: Connection) => Promise<AccountData<PaymentManagerData>[]>;
//# sourceMappingURL=accounts.d.ts.map