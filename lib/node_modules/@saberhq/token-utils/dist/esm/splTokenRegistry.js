/**
 * These types all come from the @solana/spl-token-registry package.
 *
 * We re-export them here so we do not have to have a hard dependency on
 * that package, which is massive.
 */
/**
 * Chain ID.
 */
export var ENV;
(function (ENV) {
    ENV[ENV["MainnetBeta"] = 101] = "MainnetBeta";
    ENV[ENV["Testnet"] = 102] = "Testnet";
    ENV[ENV["Devnet"] = 103] = "Devnet";
})(ENV || (ENV = {}));
//# sourceMappingURL=splTokenRegistry.js.map