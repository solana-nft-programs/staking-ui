export * from "@saberhq/option-utils";
/**
 * Hide the console.error because @solana/web3.js often emits noisy errors as a
 * side effect.
 */
export declare const suppressConsoleErrorAsync: <T>(fn: () => Promise<T>) => Promise<T>;
/**
 * Hide the console.error because @solana/web3.js often emits noisy errors as a
 * side effect.
 */
export declare const suppressConsoleError: <T>(fn: () => T) => T;
export declare function sleep(ms: number): Promise<void>;
/**
 * Promise or its inner value.
 */
export declare type PromiseOrValue<T> = Promise<T> | T;
/**
 * Awaits for a promise or value.
 */
export declare const valueAsPromise: <T>(awaitable: PromiseOrValue<T>) => Promise<T>;
//# sourceMappingURL=misc.d.ts.map