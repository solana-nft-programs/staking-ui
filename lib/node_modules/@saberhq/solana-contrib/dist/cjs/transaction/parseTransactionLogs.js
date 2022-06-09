"use strict";
/**
 * Adapted from explorer.solana.com code written by @jstarry.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatInstructionLogs = exports.formatLogEntry = exports.parseTransactionLogs = void 0;
const tslib_1 = require("tslib");
const tiny_invariant_1 = tslib_1.__importDefault(require("tiny-invariant"));
const programErr_js_1 = require("./programErr.js");
/**
 * Stack-aware program log parser.
 * @param logs
 * @param error
 * @returns
 */
const parseTransactionLogs = (logs, error) => {
    let depth = 0;
    const prettyLogs = [];
    let prettyError;
    if (!logs) {
        if (error)
            throw new Error(JSON.stringify(error));
        throw new Error("No logs detected");
    }
    else if (error) {
        prettyError = (0, programErr_js_1.getTransactionInstructionError)(error);
    }
    logs.forEach((log) => {
        var _a, _b, _c, _d, _e;
        if (log.startsWith("Program log:")) {
            (_a = prettyLogs[prettyLogs.length - 1]) === null || _a === void 0 ? void 0 : _a.logs.push({
                type: "text",
                depth,
                text: log,
            });
        }
        else {
            const regex = /Program (\w*) invoke \[(\d)\]/g;
            const matches = [...log.matchAll(regex)];
            if (matches.length > 0) {
                const programAddress = (_b = matches[0]) === null || _b === void 0 ? void 0 : _b[1];
                (0, tiny_invariant_1.default)(programAddress, "program address");
                if (depth === 0) {
                    prettyLogs.push({
                        programAddress,
                        logs: [],
                        failed: false,
                    });
                }
                else {
                    (_c = prettyLogs[prettyLogs.length - 1]) === null || _c === void 0 ? void 0 : _c.logs.push({
                        type: "cpi",
                        depth,
                        programAddress: programAddress !== null && programAddress !== void 0 ? programAddress : null,
                    });
                }
                depth++;
            }
            else if (log.includes("success")) {
                (_d = prettyLogs[prettyLogs.length - 1]) === null || _d === void 0 ? void 0 : _d.logs.push({
                    type: "success",
                    depth,
                });
                depth--;
            }
            else if (log.includes("failed")) {
                const instructionLog = prettyLogs[prettyLogs.length - 1];
                if (instructionLog && !instructionLog.failed) {
                    instructionLog.failed = true;
                    instructionLog.logs.push({
                        type: "programError",
                        depth,
                        text: log.slice(log.indexOf(": ") + 2),
                    });
                }
                depth--;
            }
            else {
                if (depth === 0) {
                    prettyLogs.push({
                        logs: [],
                        failed: false,
                    });
                    depth++;
                }
                // system transactions don't start with "Program log:"
                (_e = prettyLogs[prettyLogs.length - 1]) === null || _e === void 0 ? void 0 : _e.logs.push({
                    type: "system",
                    depth,
                    text: log,
                });
            }
        }
    });
    // If the instruction's simulation returned an error without any logs then add an empty log entry for Runtime error
    // For example BpfUpgradableLoader fails without returning any logs for Upgrade instruction with buffer that doesn't exist
    if (prettyError && prettyLogs.length === 0) {
        prettyLogs.push({
            logs: [],
            failed: true,
        });
    }
    if (prettyError && prettyError.index === prettyLogs.length - 1) {
        const failedIx = prettyLogs[prettyError.index];
        if (failedIx) {
            failedIx.failed = true;
            failedIx.logs.push({
                type: "runtimeError",
                depth: 1,
                text: prettyError.message,
            });
        }
    }
    return prettyLogs;
};
exports.parseTransactionLogs = parseTransactionLogs;
const buildPrefix = (depth) => {
    const prefix = new Array(depth - 1).fill("\u00A0\u00A0").join("");
    return prefix + "> ";
};
const formatLogEntryString = (entry) => {
    switch (entry.type) {
        case "success":
            return `Program returned success`;
        case "programError":
            return `Program returned error: ${entry.text}`;
        case "runtimeError":
            return `Runtime error: ${entry.text}`;
        case "system":
            return entry.text;
        case "text":
            return entry.text;
        case "cpi":
            return `Invoking Unknown ${entry.programAddress ? `(${entry.programAddress}) ` : ""}Program`;
    }
};
/**
 * Formats a log entry to be printed out.
 * @param entry
 * @param prefix
 * @returns
 */
const formatLogEntry = (entry, prefix = false) => {
    const prefixString = prefix ? buildPrefix(entry.depth) : "";
    return `${prefixString}${formatLogEntryString(entry)}`;
};
exports.formatLogEntry = formatLogEntry;
/**
 * Formats instruction logs.
 * @param logs
 */
const formatInstructionLogs = (logs) => logs
    .map((log, i) => {
    return [
        `=> Instruction #${i}: ${log.programAddress ? `Program ${log.programAddress}` : "System"}`,
        ...log.logs.map((entry) => (0, exports.formatLogEntry)(entry, true)),
    ].join("\n");
})
    .join("\n");
exports.formatInstructionLogs = formatInstructionLogs;
//# sourceMappingURL=parseTransactionLogs.js.map