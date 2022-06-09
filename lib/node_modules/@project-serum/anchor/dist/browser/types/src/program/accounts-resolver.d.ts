import { PublicKey } from "@solana/web3.js";
import { Idl } from "../idl.js";
import { AllInstructions } from "./namespace/types.js";
import Provider from "../provider.js";
import { AccountNamespace } from "./namespace/account.js";
export declare class AccountsResolver<IDL extends Idl, I extends AllInstructions<IDL>> {
    private _args;
    private _accounts;
    private _provider;
    private _programId;
    private _idlIx;
    static readonly CONST_ACCOUNTS: {
        systemProgram: PublicKey;
        tokenProgram: PublicKey;
        associatedTokenProgram: PublicKey;
        rent: PublicKey;
    };
    private _accountStore;
    constructor(_args: Array<any>, _accounts: {
        [name: string]: PublicKey;
    }, _provider: Provider, _programId: PublicKey, _idlIx: AllInstructions<IDL>, _accountNamespace: AccountNamespace<IDL>);
    resolve(): Promise<void>;
    private autoPopulatePda;
    private parseProgramId;
    private toBuffer;
    private toBufferConst;
    private toBufferArg;
    private argValue;
    private toBufferAccount;
    private accountValue;
    private parseAccountValue;
    private toBufferValue;
}
export declare class AccountStore<IDL extends Idl> {
    private _provider;
    private _accounts;
    private _cache;
    constructor(_provider: Provider, _accounts: AccountNamespace<IDL>);
    fetchAccount<T = any>(name: string, publicKey: PublicKey): Promise<T>;
}
//# sourceMappingURL=accounts-resolver.d.ts.map