"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateTransactionSize = exports.EstimatedTXTooBigError = exports.TXSizeEstimationError = exports.printTXTable = void 0;
const web3_js_1 = require("@solana/web3.js");
const index_js_1 = require("../index.js");
/**
 * Takes in a simulation result of a transaction and prints it in a cool table.
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
 * Safe for browser usage. Can be conveniently run with txEnvelope.simulateTable()
 */
const printTXTable = (tx, transactionLogs, message) => {
    if (message && message !== "") {
        console.log((0, exports.estimateTransactionSize)(tx), message);
    }
    else {
        console.log("Transaction size:", (0, exports.estimateTransactionSize)(tx));
    }
    const computeUnitLogStack = [];
    const cpiLogStack = [];
    let currentIndex = -1;
    transactionLogs.forEach((line) => {
        if (line.includes(" invoke [1]")) {
            currentIndex++;
            cpiLogStack[currentIndex] = 0;
        }
        const cpiMatch = line.match(/ invoke \[(\d)\]/);
        if (cpiMatch && cpiMatch[1]) {
            const cur = cpiLogStack[currentIndex];
            cpiLogStack[currentIndex] =
                cur === undefined
                    ? Number(cpiMatch[1]) - 1
                    : Math.max(Number(cpiMatch[1]) - 1, cur);
        }
        const computeMatch = line.match(/consumed \d* of \d* compute units/);
        if (computeMatch && computeMatch[0]) {
            computeUnitLogStack[currentIndex] = computeMatch[0];
        }
    });
    const instructionTable = [];
    tx.instructions.forEach((instruction, i) => {
        const computeUnitLog = computeUnitLogStack[i];
        const computeUnitMatch = computeUnitLog === null || computeUnitLog === void 0 ? void 0 : computeUnitLog.match(/consumed (\d*) of (\d*)/);
        const [consumed, quota] = (computeUnitMatch === null || computeUnitMatch === void 0 ? void 0 : computeUnitMatch.slice(1, 3).map((num) => parseInt(num, 10))) || [undefined, undefined];
        instructionTable.push({
            iso: isolatedInstructionSize(tx.provider, instruction),
            mar: marginalInstructionSize(tx.provider, tx.instructions.slice(0, i), instruction),
            cum: instructionsSize(tx.provider, tx.instructions.slice(0, i + 1)),
            programId: instruction.programId.toBase58(),
            quota: quota ? quota : i === 0 ? 200000 : undefined,
            used: consumed,
            left: quota && consumed ? quota - consumed : undefined,
            CPI: cpiLogStack[i],
        });
    });
    console.table(instructionTable);
};
exports.printTXTable = printTXTable;
class TXSizeEstimationError extends Error {
    constructor(underlyingError) {
        super(`could not estimate transaction size`);
        this.underlyingError = underlyingError;
        this.name = "TXSizeEstimationError";
    }
}
exports.TXSizeEstimationError = TXSizeEstimationError;
class EstimatedTXTooBigError extends Error {
    constructor(tx, size) {
        super(`Transaction too large`);
        this.tx = tx;
        this.size = size;
        this.name = "EstimatedTXTooBigError";
    }
}
exports.EstimatedTXTooBigError = EstimatedTXTooBigError;
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
 *
 * Returns 8888 if the transaction was too big.
 * Returns 9999 if the transaction was unable to be built.
 */
const estimateTransactionSize = (txEnvelope) => {
    const result = txEnvelope.estimateSize();
    if ("size" in result) {
        return result.size;
    }
    if (result.error instanceof TXSizeEstimationError) {
        console.error("Unknown error estimating transaction size", result.error.underlyingError);
        return 9999;
    }
    return 8888;
};
exports.estimateTransactionSize = estimateTransactionSize;
/**
 * A dummy instruction that is probably tiny and has overlap with most instructions
 */
const simpleInstruction = () => {
    const fs = getFakeSigner();
    return web3_js_1.SystemProgram.transfer({
        fromPubkey: fs.publicKey,
        toPubkey: fs.publicKey,
        lamports: 1,
    });
};
const isolatedInstructionSize = (randomProvider, instruction) => {
    return marginalInstructionSize(randomProvider, [simpleInstruction()], instruction);
};
const marginalInstructionSize = (randomProvider, previousInstructions, instruction) => {
    const previousTxSize = instructionsSize(randomProvider, previousInstructions.length ? previousInstructions : [simpleInstruction()]);
    const biggerTxSize = instructionsSize(randomProvider, [
        ...previousInstructions,
        instruction,
    ]);
    return biggerTxSize - previousTxSize;
};
const instructionsSize = (randomProvider, instructions) => {
    const instructionedTx = new index_js_1.TransactionEnvelope(randomProvider, [
        ...instructions,
    ]);
    return (0, exports.estimateTransactionSize)(instructionedTx);
};
let fakeSigner = undefined;
const getFakeSigner = () => {
    if (!fakeSigner) {
        fakeSigner = web3_js_1.Keypair.generate();
    }
    return fakeSigner;
};
//# sourceMappingURL=printTXTable.js.map