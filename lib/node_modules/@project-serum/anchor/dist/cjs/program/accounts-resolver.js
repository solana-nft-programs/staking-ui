"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStore = exports.AccountsResolver = void 0;
const camelcase_1 = __importDefault(require("camelcase"));
const web3_js_1 = require("@solana/web3.js");
const utf8 = __importStar(require("../utils/bytes/utf8.js"));
const token_js_1 = require("../utils/token.js");
const token_1 = require("../spl/token");
// Populates a given accounts context with PDAs and common missing accounts.
class AccountsResolver {
    constructor(_args, _accounts, _provider, _programId, _idlIx, _accountNamespace) {
        this._args = _args;
        this._accounts = _accounts;
        this._provider = _provider;
        this._programId = _programId;
        this._idlIx = _idlIx;
        this._accountStore = new AccountStore(_provider, _accountNamespace);
    }
    // Note: We serially resolve PDAs one by one rather than doing them
    //       in parallel because there can be dependencies between
    //       addresses. That is, one PDA can be used as a seed in another.
    //
    // TODO: PDAs need to be resolved in topological order. For now, we
    //       require the developer to simply list the accounts in the
    //       correct order. But in future work, we should create the
    //       dependency graph and resolve automatically.
    //
    async resolve() {
        for (let k = 0; k < this._idlIx.accounts.length; k += 1) {
            // Cast is ok because only a non-nested IdlAccount can have a seeds
            // cosntraint.
            const accountDesc = this._idlIx.accounts[k];
            const accountDescName = (0, camelcase_1.default)(accountDesc.name);
            // PDA derived from IDL seeds.
            if (accountDesc.pda &&
                accountDesc.pda.seeds.length > 0 &&
                !this._accounts[accountDescName]) {
                await this.autoPopulatePda(accountDesc);
                continue;
            }
            // Signers default to the provider.
            if (accountDesc.isSigner && !this._accounts[accountDescName]) {
                // @ts-expect-error
                if (this._provider.wallet === undefined) {
                    throw new Error("This function requires the Provider interface implementor to have a 'wallet' field.");
                }
                // @ts-expect-error
                this._accounts[accountDescName] = this._provider.wallet.publicKey;
                continue;
            }
            // Common accounts are auto populated with magic names by convention.
            if (Reflect.has(AccountsResolver.CONST_ACCOUNTS, accountDescName) &&
                !this._accounts[accountDescName]) {
                this._accounts[accountDescName] =
                    AccountsResolver.CONST_ACCOUNTS[accountDescName];
            }
        }
    }
    async autoPopulatePda(accountDesc) {
        if (!accountDesc.pda || !accountDesc.pda.seeds)
            throw new Error("Must have seeds");
        const seeds = await Promise.all(accountDesc.pda.seeds.map((seedDesc) => this.toBuffer(seedDesc)));
        const programId = await this.parseProgramId(accountDesc);
        const [pubkey] = await web3_js_1.PublicKey.findProgramAddress(seeds, programId);
        this._accounts[(0, camelcase_1.default)(accountDesc.name)] = pubkey;
    }
    async parseProgramId(accountDesc) {
        var _a;
        if (!((_a = accountDesc.pda) === null || _a === void 0 ? void 0 : _a.programId)) {
            return this._programId;
        }
        switch (accountDesc.pda.programId.kind) {
            case "const":
                return new web3_js_1.PublicKey(this.toBufferConst(accountDesc.pda.programId.value));
            case "arg":
                return this.argValue(accountDesc.pda.programId);
            case "account":
                return await this.accountValue(accountDesc.pda.programId);
            default:
                throw new Error(`Unexpected program seed kind: ${accountDesc.pda.programId.kind}`);
        }
    }
    async toBuffer(seedDesc) {
        switch (seedDesc.kind) {
            case "const":
                return this.toBufferConst(seedDesc);
            case "arg":
                return await this.toBufferArg(seedDesc);
            case "account":
                return await this.toBufferAccount(seedDesc);
            default:
                throw new Error(`Unexpected seed kind: ${seedDesc.kind}`);
        }
    }
    toBufferConst(seedDesc) {
        return this.toBufferValue(seedDesc.type, seedDesc.value);
    }
    async toBufferArg(seedDesc) {
        const argValue = this.argValue(seedDesc);
        return this.toBufferValue(seedDesc.type, argValue);
    }
    argValue(seedDesc) {
        const seedArgName = (0, camelcase_1.default)(seedDesc.path.split(".")[0]);
        const idlArgPosition = this._idlIx.args.findIndex((argDesc) => argDesc.name === seedArgName);
        if (idlArgPosition === -1) {
            throw new Error(`Unable to find argument for seed: ${seedArgName}`);
        }
        return this._args[idlArgPosition];
    }
    async toBufferAccount(seedDesc) {
        const accountValue = await this.accountValue(seedDesc);
        return this.toBufferValue(seedDesc.type, accountValue);
    }
    async accountValue(seedDesc) {
        const pathComponents = seedDesc.path.split(".");
        const fieldName = pathComponents[0];
        const fieldPubkey = this._accounts[(0, camelcase_1.default)(fieldName)];
        // The seed is a pubkey of the account.
        if (pathComponents.length === 1) {
            return fieldPubkey;
        }
        // The key is account data.
        //
        // Fetch and deserialize it.
        const account = await this._accountStore.fetchAccount(seedDesc.account, fieldPubkey);
        // Dereference all fields in the path to get the field value
        // used in the seed.
        const fieldValue = this.parseAccountValue(account, pathComponents.slice(1));
        return fieldValue;
    }
    parseAccountValue(account, path) {
        let accountField;
        while (path.length > 0) {
            accountField = account[(0, camelcase_1.default)(path[0])];
            path = path.slice(1);
        }
        return accountField;
    }
    // Converts the given idl valaue into a Buffer. The values here must be
    // primitives. E.g. no structs.
    //
    // TODO: add more types here as needed.
    toBufferValue(type, value) {
        switch (type) {
            case "u8":
                return Buffer.from([value]);
            case "u16":
                let b = Buffer.alloc(2);
                b.writeUInt16LE(value);
                return b;
            case "u32":
                let buf = Buffer.alloc(4);
                buf.writeUInt32LE(value);
                return buf;
            case "u64":
                let bU64 = Buffer.alloc(8);
                bU64.writeBigUInt64LE(BigInt(value));
                return bU64;
            case "string":
                return Buffer.from(utf8.encode(value));
            case "publicKey":
                return value.toBuffer();
            default:
                if (type.array) {
                    return Buffer.from(value);
                }
                throw new Error(`Unexpected seed type: ${type}`);
        }
    }
}
exports.AccountsResolver = AccountsResolver;
AccountsResolver.CONST_ACCOUNTS = {
    systemProgram: web3_js_1.SystemProgram.programId,
    tokenProgram: token_js_1.TOKEN_PROGRAM_ID,
    associatedTokenProgram: token_js_1.ASSOCIATED_PROGRAM_ID,
    rent: web3_js_1.SYSVAR_RENT_PUBKEY,
};
// TODO: this should be configureable to avoid unnecessary requests.
class AccountStore {
    // todo: don't use the progrma use the account namespace.
    constructor(_provider, _accounts) {
        this._provider = _provider;
        this._accounts = _accounts;
        this._cache = new Map();
    }
    async fetchAccount(name, publicKey) {
        const address = publicKey.toString();
        if (!this._cache.has(address)) {
            if (name === "TokenAccount") {
                const accountInfo = await this._provider.connection.getAccountInfo(publicKey);
                if (accountInfo === null) {
                    throw new Error(`invalid account info for ${address}`);
                }
                const data = (0, token_1.coder)().accounts.decode("token", accountInfo.data);
                this._cache.set(address, data);
            }
            else {
                const account = this._accounts[(0, camelcase_1.default)(name)].fetch(publicKey);
                this._cache.set(address, account);
            }
        }
        return this._cache.get(address);
    }
}
exports.AccountStore = AccountStore;
//# sourceMappingURL=accounts-resolver.js.map