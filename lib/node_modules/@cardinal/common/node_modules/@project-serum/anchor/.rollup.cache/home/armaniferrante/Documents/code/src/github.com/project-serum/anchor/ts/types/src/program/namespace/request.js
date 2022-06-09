export class RequestBuilderFactory {
    static build(ixFn, txFn, rpcFn, simulateFn) {
        const request = (...args) => {
            return new RequestBuilder(args, ixFn, txFn, rpcFn, simulateFn);
        };
        return request;
    }
}
export class RequestBuilder {
    constructor(_args, _ixFn, _txFn, _rpcFn, _simulateFn) {
        this._args = _args;
        this._ixFn = _ixFn;
        this._txFn = _txFn;
        this._rpcFn = _rpcFn;
        this._simulateFn = _simulateFn;
        this._accounts = {};
        this._remainingAccounts = [];
        this._signers = [];
        this._preInstructions = [];
        this._postInstructions = [];
    }
    // TODO: don't use any.
    accounts(accounts) {
        Object.assign(this._accounts, accounts);
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
    async send(options) {
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
    async simulate(options) {
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
//# sourceMappingURL=request.js.map