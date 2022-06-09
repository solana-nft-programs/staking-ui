"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueAsPromise = exports.sleep = exports.suppressConsoleError = exports.suppressConsoleErrorAsync = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("@saberhq/option-utils"), exports);
const noop = () => {
    // noop
};
/**
 * Hide the console.error because @solana/web3.js often emits noisy errors as a
 * side effect.
 */
const suppressConsoleErrorAsync = async (fn) => {
    const oldConsoleError = console.error;
    console.error = noop;
    try {
        const result = await fn();
        console.error = oldConsoleError;
        return result;
    }
    catch (e) {
        console.error = oldConsoleError;
        throw e;
    }
};
exports.suppressConsoleErrorAsync = suppressConsoleErrorAsync;
/**
 * Hide the console.error because @solana/web3.js often emits noisy errors as a
 * side effect.
 */
const suppressConsoleError = (fn) => {
    const oldConsoleError = console.error;
    console.error = noop;
    try {
        const result = fn();
        console.error = oldConsoleError;
        return result;
    }
    catch (e) {
        console.error = oldConsoleError;
        throw e;
    }
};
exports.suppressConsoleError = suppressConsoleError;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
/**
 * Awaits for a promise or value.
 */
const valueAsPromise = async (awaitable) => {
    if ("then" in awaitable) {
        return await awaitable;
    }
    return awaitable;
};
exports.valueAsPromise = valueAsPromise;
//# sourceMappingURL=misc.js.map