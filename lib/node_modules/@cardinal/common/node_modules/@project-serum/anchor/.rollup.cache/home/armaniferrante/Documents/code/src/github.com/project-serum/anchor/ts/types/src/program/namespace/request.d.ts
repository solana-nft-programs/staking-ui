import { ConfirmOptions, AccountMeta, Transaction, TransactionInstruction, TransactionSignature } from "@solana/web3.js";
import { SimulateResponse } from "./simulate";
import { TransactionFn } from "./transaction.js";
import { Idl } from "../../idl.js";
import { AllInstructions, InstructionContextFn, MakeInstructionsNamespace } from "./types";
import { InstructionFn } from "./instruction";
import { RpcFn } from "./rpc";
import { SimulateFn } from "./simulate";
export declare class RequestBuilderFactory {
    static build<IDL extends Idl, I extends AllInstructions<IDL>>(ixFn: InstructionFn<IDL>, txFn: TransactionFn<IDL>, rpcFn: RpcFn<IDL>, simulateFn: SimulateFn<IDL>): RequestFn;
}
export declare class RequestBuilder<IDL extends Idl, I extends AllInstructions<IDL>> {
    private _args;
    private _ixFn;
    private _txFn;
    private _rpcFn;
    private _simulateFn;
    private _accounts;
    private _remainingAccounts;
    private _signers;
    private _preInstructions;
    private _postInstructions;
    constructor(_args: Array<any>, _ixFn: InstructionFn<IDL>, _txFn: TransactionFn<IDL>, _rpcFn: RpcFn<IDL>, _simulateFn: SimulateFn<IDL>);
    accounts(accounts: any): RequestBuilder<IDL, I>;
    remainingAccounts(accounts: Array<AccountMeta>): RequestBuilder<IDL, I>;
    preInstructions(ixs: Array<TransactionInstruction>): RequestBuilder<IDL, I>;
    postInstructions(ixs: Array<TransactionInstruction>): RequestBuilder<IDL, I>;
    send(options: ConfirmOptions): Promise<TransactionSignature>;
    simulate(options: ConfirmOptions): Promise<SimulateResponse<any, any>>;
    instruction(): Promise<TransactionInstruction>;
    transaction(): Promise<Transaction>;
}
export declare type RequestNamespace<IDL extends Idl = Idl, I extends AllInstructions<IDL> = AllInstructions<IDL>> = MakeInstructionsNamespace<IDL, I, any>;
export declare type RequestFn<IDL extends Idl = Idl, I extends AllInstructions<IDL> = AllInstructions<IDL>> = InstructionContextFn<IDL, I, RequestBuilder<IDL, I>>;
//# sourceMappingURL=request.d.ts.map