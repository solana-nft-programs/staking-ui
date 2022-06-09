import type { Connection } from "@solana/web3.js";
/**
 * A useful tool for debugging account structs. It gives a quick glance at
 * addresses and owners. It also converts bignums into JS numbers.
 *
 * Types converted:
 * - **big numbers**: converted to native numbers
 * - **addresses**: format in base58, and prints the owner in parentheses if the account exists
 * - **plain objects**: recursively converts
 *
 * HINT: This function is mainly useful for the browser. If you are writing
 * Rust integration tests, use debugAccountOwners from chai-solana instead, so
 * that you don't have to pass in connection.
 *
 * Usage:
 * ```
 * await printAccountOwners(connection, depositAccounts);
 * // using void is recommend in dapps to avoid slowing down the user experience
 * void printAccountOwners(connection, depositAccounts);
 * ```
 *
 * Example output:
 * ```
 * tests/awesomeTest.spec.ts:583:29 {
 *   payer: 'CEGhKVeyXUrihUnNU9EchSuu6pMHEsB8MiKgvhJqYgd1 (11111111111111111111111111111111)',
 *   foo: '61tMNVhG66QZQ4UEAoHytqaUN4G1xpk1zsS5YU7Y2Qui (135QzSyjKTKaZ7ebhLpvNA2KUahEjykMjbqz3JV1V4k9)',
 *   bar: '9oPMxXVSm5msAecxi4zJpKDwbHS9c6Yos1ru739rVExc (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)',
 *   tokenProgram: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA (BPFLoader2111111111111111111111111111111111)'
 * }
 * ```
 *
 * WARNING: This may break silently if web3 changes its api. This is only
 * intended for debugging purposes only. But it should be safe to use in production.
 */
export declare function printAccountOwners(connection: Connection, plainObj: object): Promise<void>;
//# sourceMappingURL=printAccountOwners.d.ts.map