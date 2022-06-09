"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodsBuilder = exports.MethodsBuilderFactory = void 0;
const accounts_resolver_js_1 = require("../accounts-resolver.js");
class MethodsBuilderFactory {
    static build(provider, programId, idlIx, ixFn, txFn, rpcFn, simulateFn, viewFn, accountNamespace) {
        return (...args) => new MethodsBuilder(args, ixFn, txFn, rpcFn, simulateFn, viewFn, provider, programId, idlIx, accountNamespace);
    }
}
exports.MethodsBuilderFactory = MethodsBuilderFactory;
class MethodsBuilder {
    constructor(_args, _ixFn, _txFn, _rpcFn, _simulateFn, _viewFn, _provider, _programId, _idlIx, _accountNamespace) {
        this._args = _args;
        this._ixFn = _ixFn;
        this._txFn = _txFn;
        this._rpcFn = _rpcFn;
        this._simulateFn = _simulateFn;
        this._viewFn = _viewFn;
        this._accounts = {};
        this._remainingAccounts = [];
        this._signers = [];
        this._preInstructions = [];
        this._postInstructions = [];
        this._accountsResolver = new accounts_resolver_js_1.AccountsResolver(_args, this._accounts, _provider, _programId, _idlIx, _accountNamespace);
    }
    async pubkeys() {
        await this._accountsResolver.resolve();
        return this._accounts;
    }
    accounts(accounts) {
        Object.assign(this._accounts, accounts);
        return this;
    }
    signers(signers) {
        this._signers = this._signers.concat(signers);
        return this;
    }
    remainingAccounts(accounts) {
        this._remainingAccounts = this._remainingAccounts.concat(accounts);
        return this;
    }
    preInstructions(ixs) {
        this._preInstructions = this._preInstructions.concat(ixs);
        return this;
    }
    postInstructions(ixs) {
        this._postInstructions = this._postInstructions.concat(ixs);
        return this;
    }
    async rpc(options) {
        await this._accountsResolver.resolve();
        // @ts-ignore
        return this._rpcFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
            options: options,
        });
    }
    async view(options) {
        await this._accountsResolver.resolve();
        if (!this._viewFn) {
            throw new Error("Method does not support views");
        }
        // @ts-ignore
        return this._viewFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
            options: options,
        });
    }
    async simulate(options) {
        await this._accountsResolver.resolve();
        // @ts-ignore
        return this._simulateFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
            options: options,
        });
    }
    async instruction() {
        await this._accountsResolver.resolve();
        // @ts-ignore
        return this._ixFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
        });
    }
    async transaction() {
        await this._accountsResolver.resolve();
        // @ts-ignore
        return this._txFn(...this._args, {
            accounts: this._accounts,
            signers: this._signers,
            remainingAccounts: this._remainingAccounts,
            preInstructions: this._preInstructions,
            postInstructions: this._postInstructions,
        });
    }
}
exports.MethodsBuilder = MethodsBuilder;
//# sourceMappingURL=methods.js.map