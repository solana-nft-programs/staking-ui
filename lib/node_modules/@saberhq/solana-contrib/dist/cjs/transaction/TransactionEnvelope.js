"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionEnvelope = exports.PACKET_DATA_SIZE = void 0;
const tslib_1 = require("tslib");
const web3_js_1 = require("@solana/web3.js");
const tiny_invariant_1 = tslib_1.__importDefault(require("tiny-invariant"));
const index_js_1 = require("../computeBudget/index.js");
const index_js_2 = require("../utils/index.js");
const txSizer_js_1 = require("./txSizer.js");
const utils_js_1 = require("./utils.js");
exports.PACKET_DATA_SIZE = 1280 - 40 - 8;
const ASSOCIATED_TOKEN_PROGRAM_ID = new web3_js_1.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
/**
 * Filters the required signers for a list of instructions.
 * @param ixs
 * @returns
 */
const filterRequiredSigners = (ixs, signers) => {
    // filter out the signers required for the transaction
    const requiredSigners = ixs.flatMap((ix) => ix.keys.filter((k) => k.isSigner).map((k) => k.pubkey));
    return signers.filter((s) => requiredSigners.find((rs) => rs.equals(s.publicKey)));
};
/**
 * Contains a Transaction that is being built.
 */
class TransactionEnvelope {
    constructor(
    /**
     * Provider that will be sending the transaction as the fee payer.
     */
    provider, 
    /**
     * Instructions associated with the transaction.
     */
    instructions, 
    /**
     * Optional signers of the transaction.
     */
    signers = []) {
        this.provider = provider;
        this.instructions = instructions;
        this.signers = signers;
    }
    /**
     * Prepends the given {@link TransactionInstruction}s to the {@link TransactionEnvelope}.
     * @param instructions The instructions to prepend.
     * @returns
     */
    prepend(...instructions) {
        this.instructions.unshift(...instructions.filter((ix) => !!ix));
        return this;
    }
    /**
     * Appends the given {@link TransactionInstruction}s to the {@link TransactionEnvelope}.
     * @param instructions The instructions to append.
     * @returns
     */
    append(...instructions) {
        this.instructions.push(...instructions.filter((ix) => !!ix));
        return this;
    }
    /**
     * A the given {@link TransactionInstruction}s to the {@link TransactionEnvelope}.
     * @param instructions The instructions to add.
     * @deprecated Use {@link #append} instead.
     * @returns
     */
    addInstructions(...instructions) {
        return this.append(...instructions);
    }
    /**
     * Adds the given {@link Signer}s to the {@link TransactionEnvelope}.
     * @param signers The signers to add.
     * @returns
     */
    addSigners(...signers) {
        this.signers.push(...signers);
        return this;
    }
    /**
     * Builds a transaction from this envelope.
     * @param feePayer Optional override for the fee payer.
     */
    build(feePayer = this.provider.wallet.publicKey) {
        const tx = new web3_js_1.Transaction().add(...this.instructions);
        tx.feePayer = feePayer;
        return tx;
    }
    /**
     * Builds a transaction and estimates the size in bytes.
     * Does not check to see if the transaction is too big.
     *
     * @returns Byte count
     */
    estimateSizeUnsafe() {
        const builtTx = this.build();
        // dummy blockhash that is required for building the transaction
        builtTx.recentBlockhash = "MaryHadALittLeLambZNdhAUTrsLE1ydg6rmtvFEpKT";
        return (0, txSizer_js_1.calculateTxSizeUnsafe)(builtTx);
    }
    /**
     * Builds a transaction and estimates the size in bytes. This number is primrily
     * to be used for checking to see if a transaction is too big and instructions
     * need to be split. It may not be 100% accurate.
     *
     * This is used in expectTXTable and is useful for increasing efficiency in
     * dapps that build large transactions.
     *
     * The max transaction size of a v1 Transaction in Solana is 1232 bytes.
     * For info about Transaction v2: https://docs.solana.com/proposals/transactions-v2
     */
    estimateSize() {
        return (0, index_js_2.suppressConsoleError)(() => {
            try {
                const builtTx = this.build();
                // dummy blockhash that is required for building the transaction
                builtTx.recentBlockhash = "MaryHadALittLeLambZNdhAUTrsLE1ydg6rmtvFEpKT";
                const size = (0, txSizer_js_1.calculateTxSizeUnsafe)(builtTx);
                if (size > exports.PACKET_DATA_SIZE) {
                    return { error: new index_js_2.EstimatedTXTooBigError(builtTx, size) };
                }
                return { size };
            }
            catch (e) {
                return { error: new index_js_2.TXSizeEstimationError(e) };
            }
        });
    }
    /**
     * Partition a large {@link TransactionEnvelope} into smaller, valid {@link Transaction}s.
     * This relies on this envelope already having the correct number of signers.
     *
     * @param feePayer Optional fee payer override.
     * @returns A list of {@link Transaction}s.
     */
    buildPartition(feePayer = this.provider.wallet.publicKey) {
        const partition = this.partition();
        return partition.map((env) => env.build(feePayer));
    }
    /**
     * Partition a large {@link TransactionEnvelope} into smaller, valid transaction envelopes which can be built.
     * This relies on this envelope already having the correct number of signers.
     *
     * @returns
     */
    partition() {
        const estimation = this.estimateSize();
        if ("size" in estimation) {
            return [this];
        }
        // empty partition should have no envelopes
        if (this.instructions.length === 0) {
            return [];
        }
        let lastTXEnv = new TransactionEnvelope(this.provider, this.instructions.slice(0, 1), this._filterRequiredSigners(this.instructions.slice(0, 1)));
        let lastEstimation = lastTXEnv.estimateSizeUnsafe();
        const txs = [];
        this.instructions.slice(1).forEach((ix, i) => {
            if (lastEstimation > exports.PACKET_DATA_SIZE) {
                throw new Error(`cannot construct a valid partition: instruction ${i} is too large (${lastEstimation} > ${exports.PACKET_DATA_SIZE})`);
            }
            const nextIXs = [...lastTXEnv.instructions, ix];
            const nextSigners = this._filterRequiredSigners(nextIXs);
            const nextTXEnv = new TransactionEnvelope(this.provider, nextIXs, nextSigners);
            const nextEstimation = nextTXEnv.estimateSizeUnsafe();
            // move to next tx envelope if too big
            if (nextEstimation > exports.PACKET_DATA_SIZE) {
                txs.push(lastTXEnv);
                const nextIXs = [ix];
                lastTXEnv = new TransactionEnvelope(this.provider, nextIXs, this._filterRequiredSigners(nextIXs));
                lastEstimation = lastTXEnv.estimateSizeUnsafe();
            }
            else {
                lastTXEnv = nextTXEnv;
                lastEstimation = nextEstimation;
            }
        });
        txs.push(lastTXEnv);
        return txs;
    }
    /**
     * Filters the required signers for a list of instructions.
     * @param ixs
     * @returns
     */
    _filterRequiredSigners(ixs) {
        return filterRequiredSigners(ixs, this.signers);
    }
    /**
     * Generates a link for inspecting the contents of this {@link TransactionEnvelope}.
     *
     * @returns URL
     */
    generateInspectLink(cluster = "mainnet-beta") {
        const t = this.build();
        t.recentBlockhash = utils_js_1.RECENT_BLOCKHASH_STUB;
        const str = t.serializeMessage().toString("base64");
        return (0, utils_js_1.generateInspectLinkFromBase64)(cluster, str);
    }
    /**
     * Simulates the transaction.
     * @param opts
     * @returns
     */
    simulate(opts = {
        verifySigners: true,
    }) {
        return this.provider.simulate(this.build(), opts.verifySigners ? this.signers : undefined, opts);
    }
    /**
     * Simulates the transaction, without validating signers.
     *
     * @deprecated Use {@link TXEnvelope#simulate} instead.
     * @param opts
     * @returns
     */
    simulateUnchecked(opts) {
        return this.simulate({ ...opts, verifySigners: false });
    }
    /**
     * Simulates the transaction and prints a fancy table in the console.
     * ```
     *    ┌─────┬───┬───┬───┬───────────┬──────┬─────┬──────┬───┐
     *    │index│iso│mar│cum│ programId │quota │used │ left │CPI│
     *    ├─────┼───┼───┼───┼───────────┼──────┼─────┼──────┼───┤
     *    │  0  │298│281│464│'ATokenG..'│200000│24270│175730│ 1 │
     *    │  1  │298│ 74│538│'ATokenG..'│178730│21270│157460│ 1 │
     *    │  2  │298│ 74│612│'ATokenG..'│157460│27277│130183│ 1 │
     *    │  3  │298│ 42│686│'ATokenG..'│130183│21270│108913│ 1 │
     *    │  4  │338│265│951│'qExampL..'│108913│76289│ 32624│ 3 │
     *    └─────┴───┴───┴───┴───────────┴──────┴─────┴──────┴───┘
     * ```
     *
     * - **index**: the array index of the instruction within the transaction
     * - **iso**: the isolated size of the instruction (marginal cost of only the instruction)
     * - **mar**: the marginal size cost of the instruction (when added to previous)
     * - **cum**: the cumulative size of the instructions up until that instruction
     * - **quota/used/left**: [BPF instruction compute unit info](https://docs.solana.com/developing/programming-model/runtime)
     * - **CPI**: [the maximum depth of CPI](https://docs.solana.com/developing/programming-model/calling-between-programs) (current limit in Solana is 4)
     *
     * @param opts
     * @returns
     */
    simulateTable(opts) {
        return this.simulate(opts).then((simulation) => {
            var _a;
            if ((_a = simulation === null || simulation === void 0 ? void 0 : simulation.value) === null || _a === void 0 ? void 0 : _a.logs) {
                (0, index_js_2.printTXTable)(this, simulation.value.logs, "");
            }
            return simulation;
        });
    }
    /**
     * Sends the transaction without confirming it.
     * @param opts
     * @returns
     */
    async send(opts) {
        const signed = await this.provider.signer.sign(this.build(), this.signers, opts);
        return this.provider.broadcaster.broadcast(signed, opts);
    }
    /**
     * Sends the transaction and waits for confirmation.
     * @param opts
     */
    async confirm(opts) {
        return (await this.send(opts)).wait();
    }
    /**
     * Combines the instructions/signers of the other envelope to create one large transaction.
     */
    combine(other) {
        return new TransactionEnvelope(this.provider, [...this.instructions, ...other.instructions], [...this.signers, ...other.signers]);
    }
    /**
     * Get a list of all writable accounts, deduped
     * All of these accounts likely need to be updated after the transaction is confirmed.
     */
    get writableKeys() {
        return [
            ...new Set([
                ...this.instructions
                    .map((inst) => inst.keys.filter((key) => key.isWritable).map((k) => k.pubkey))
                    .reduce((acc, el) => acc.concat(el)),
            ]).values(),
        ];
    }
    /**
     * Gets the instructions in a format that can be serialized easily to JSON.
     */
    get instructionsJSON() {
        return this.instructions.map((instruction) => ({
            programId: instruction.programId.toString(),
            keys: instruction.keys.map((m) => ({
                isSigner: m.isSigner,
                isWritable: m.isWritable,
                publicKey: m.pubkey.toString(),
            })),
            data: instruction.data.toString("base64"),
        }));
    }
    /**
     * Returns a string representation of the {@link TransactionEnvelope}.
     */
    get debugStr() {
        return [
            "=> Instructions",
            this.instructions
                .map((ser, i) => {
                return [
                    `Instruction ${i}: ${ser.programId.toString()}`,
                    ...ser.keys.map((k, i) => `  [${i}] ${k.pubkey.toString()} ${k.isWritable ? "(mut)" : ""} ${k.isSigner ? "(signer)" : ""}`),
                    `  Data (base64): ${ser.data.toString("base64")}`,
                ].join("\n");
            })
                .join("\n"),
            "=> Signers",
            this.signers.map((sg) => sg.publicKey.toString()).join("\n"),
        ].join("\n");
    }
    /**
     * Creates a new {@link TransactionEnvelope}.
     * @param provider
     * @param instructions
     * @param signers
     * @returns
     */
    static create(provider, instructions, signers = []) {
        const ixs = instructions.filter((ix) => !!ix);
        return new TransactionEnvelope(provider, ixs, signers);
    }
    /**
     * Add a memo to each transaction envelope specified.
     */
    static addMemos(memo, ...txs) {
        return txs.map((tx) => tx.addMemo(memo));
    }
    /**
     * Combines multiple TransactionEnvelopes into one.
     */
    static combineAll(...txs) {
        return txs.reduce((acc, tx) => acc.combine(tx));
    }
    /**
     * Takes a list of {@link TransactionEnvelope}s and combines them if they
     * are able to be combined under the maximum TX size limit.
     *
     * @param txs
     * @returns
     */
    static pack(...txs) {
        if (txs.length === 0) {
            return [];
        }
        const [first, ...rest] = txs;
        (0, tiny_invariant_1.default)(first);
        const { provider } = first;
        let lastTXEnv = first;
        let lastEstimation = lastTXEnv.estimateSizeUnsafe();
        const partition = [];
        rest.forEach((addedTX, i) => {
            if (lastEstimation > exports.PACKET_DATA_SIZE) {
                throw new Error(`cannot construct a valid partition: instruction ${i} is too large (${lastEstimation} > ${exports.PACKET_DATA_SIZE})`);
            }
            const nextIXs = [...lastTXEnv.instructions, ...addedTX.instructions];
            const nextSigners = filterRequiredSigners(nextIXs, [
                ...lastTXEnv.signers,
                ...addedTX.signers,
            ]);
            const nextTXEnv = new TransactionEnvelope(provider, nextIXs, nextSigners);
            const nextEstimation = nextTXEnv.estimateSizeUnsafe();
            // move to next tx envelope if too big
            if (nextEstimation > exports.PACKET_DATA_SIZE) {
                partition.push(lastTXEnv);
                lastTXEnv = addedTX;
                lastEstimation = lastTXEnv.estimateSizeUnsafe();
            }
            else {
                lastTXEnv = nextTXEnv;
                lastEstimation = nextEstimation;
            }
        });
        partition.push(lastTXEnv);
        return partition;
    }
    /**
     * Combines multiple async TransactionEnvelopes into one, serially.
     */
    static async combineAllAsync(firstTX, ...txs) {
        let acc = await firstTX;
        for (const tx of txs) {
            acc = acc.combine(await tx);
        }
        return acc;
    }
    /**
     * Sends all of the envelopes.
     * @returns Pending transactions
     */
    static async sendAll(txs, opts) {
        const firstTX = txs[0];
        if (!firstTX) {
            return [];
        }
        const provider = firstTX.provider;
        return await provider.sendAll(txs.map((tx) => ({ tx: tx.build(), signers: tx.signers })), opts);
    }
    /**
     * Deduplicate ATA instructions inside the transaction envelope.
     */
    dedupeATAIXs() {
        if (this.instructions.length === 0) {
            return this;
        }
        const seenATAs = new Set();
        const instructions = this.instructions
            .map((ix) => {
            var _a;
            const programId = ix.programId;
            if (programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID)) {
                const ataKey = (_a = ix.keys[1]) === null || _a === void 0 ? void 0 : _a.pubkey.toString();
                if (!ataKey) {
                    throw new Error("ATA key does not exist on ATA instruction");
                }
                if (seenATAs.has(ataKey)) {
                    return null;
                }
                seenATAs.add(ataKey);
            }
            return ix;
        })
            .filter((ix) => !!ix);
        return new TransactionEnvelope(this.provider, instructions, this.signers);
    }
    /**
     * Split out ATA instructions to a separate transaction envelope.
     */
    splitATAIXs() {
        const ataIXs = new TransactionEnvelope(this.provider, [], this.signers);
        const newTx = new TransactionEnvelope(this.provider, [], this.signers);
        for (const ix of this.instructions) {
            if (ix.programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID)) {
                ataIXs.instructions.push(ix);
            }
            else {
                newTx.instructions.push(ix);
            }
        }
        return {
            ataIXs: ataIXs.dedupeATAIXs(),
            tx: newTx,
        };
    }
    /**
     * Get an instruction from the transaction envelope by index.
     */
    getInstruction(index) {
        const ix = this.instructions[index];
        if (!ix) {
            throw new Error(`No instruction found at index ${index}`);
        }
        return ix;
    }
    /**
     * Attach a memo instruction to this transaction.
     */
    addMemo(memo) {
        this.instructions.push((0, index_js_2.createMemoInstruction)(memo));
        return this;
    }
    /**
     * Request for additional compute units before processing this transaction.
     */
    addAdditionalComputeBudget(units, additionalFee) {
        this.instructions.unshift((0, index_js_1.requestComputeUnitsInstruction)(units, additionalFee));
        return this;
    }
    /**
     * Request a specific transaction-wide program heap region size in bytes.
     */
    addAdditionalHeapFrame(bytes) {
        this.instructions.unshift((0, index_js_1.requestHeapFrameInstruction)(bytes));
        return this;
    }
}
exports.TransactionEnvelope = TransactionEnvelope;
//# sourceMappingURL=TransactionEnvelope.js.map