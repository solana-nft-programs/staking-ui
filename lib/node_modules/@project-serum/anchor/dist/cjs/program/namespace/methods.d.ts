import { ConfirmOptions, AccountMeta, Signer, Transaction, TransactionInstruction, TransactionSignature, PublicKey } from "@solana/web3.js";
import { SimulateResponse } from "./simulate.js";
import { TransactionFn } from "./transaction.js";
import { Idl } from "../../idl.js";
import { AllInstructions, MethodsFn, MakeMethodsNamespace, InstructionAccountAddresses } from "./types.js";
import { InstructionFn } from "./instruction.js";
import { RpcFn } from "./rpc.js";
import { SimulateFn } from "./simulate.js";
import { ViewFn } from "./views.js";
import Provider from "../../provider.js";
import { AccountNamespace } from "./account.js";
import { Accounts } from "../context.js";
export declare type MethodsNamespace<IDL extends Idl = Idl, I extends AllInstructions<IDL> = AllInstructions<IDL>> = MakeMethodsNamespace<IDL, I>;
export declare class MethodsBuilderFactory {
    static build<IDL extends Idl, I extends AllInstructions<IDL>>(provider: Provider, programId: PublicKey, idlIx: AllInstructions<IDL>, ixFn: InstructionFn<IDL>, txFn: TransactionFn<IDL>, rpcFn: RpcFn<IDL>, simulateFn: SimulateFn<IDL>, viewFn: ViewFn<IDL> | undefined, accountNamespace: AccountNamespace<IDL>): MethodsFn<IDL, I, MethodsBuilder<IDL, I>>;
}
export declare class MethodsBuilder<IDL extends Idl, I extends AllInstructions<IDL>> {
    private _args;
    private _ixFn;
    private _txFn;
    private _rpcFn;
    private _simulateFn;
    private _viewFn;
    private readonly _accounts;
    private _remainingAccounts;
    private _signers;
    private _preInstructions;
    private _postInstructions;
    private _accountsResolver;
    constructor(_args: Array<any>, _ixFn: InstructionFn<IDL>, _txFn: TransactionFn<IDL>, _rpcFn: RpcFn<IDL>, _simulateFn: SimulateFn<IDL>, _viewFn: ViewFn<IDL> | undefined, _provider: Provider, _programId: PublicKey, _idlIx: AllInstructions<IDL>, _accountNamespace: AccountNamespace<IDL>);
    pubkeys(): Promise<Partial<InstructionAccountAddresses<IDL, I>>>;
    accounts(accounts: Partial<Accounts<I["accounts"][number]>>): MethodsBuilder<IDL, I>;
    signers(signers: Array<Signer>): MethodsBuilder<IDL, I>;
    remainingAccounts(accounts: Array<AccountMeta>): MethodsBuilder<IDL, I>;
    preInstructions(ixs: Array<TransactionInstruction>): MethodsBuilder<IDL, I>;
    postInstructions(ixs: Array<TransactionInstruction>): MethodsBuilder<IDL, I>;
    rpc(options?: ConfirmOptions): Promise<TransactionSignature>;
    view(options?: ConfirmOptions): Promise<any>;
    simulate(options?: ConfirmOptions): Promise<SimulateResponse<any, any>>;
    instruction(): Promise<TransactionInstruction>;
    transaction(): Promise<Transaction>;
}
//# sourceMappingURL=methods.d.ts.map