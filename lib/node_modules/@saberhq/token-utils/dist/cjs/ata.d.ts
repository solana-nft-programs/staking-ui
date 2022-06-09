import type { PublicKey } from "@saberhq/solana-contrib";
/**
 * Gets an associated token account address.
 *
 * @deprecated use {@link getATAAddressSync}
 */
export declare const getATAAddress: ({ mint, owner, }: {
    mint: PublicKey;
    owner: PublicKey;
}) => Promise<PublicKey>;
/**
 * Gets an associated token account address synchronously.
 */
export declare const getATAAddressSync: ({ mint, owner, }: {
    mint: PublicKey;
    owner: PublicKey;
}) => PublicKey;
export declare type ATAMap<K extends string> = {
    [mint in K]: {
        address: PublicKey;
        mint: PublicKey;
    };
};
/**
 * Gets multiple associated token account addresses.
 *
 * @deprecated use {@link getATAAddressesSync}
 */
export declare const getATAAddresses: <K extends string>({ mints, owner, }: {
    mints: { [mint in K]: PublicKey; };
    owner: PublicKey;
}) => Promise<{
    /**
     * All ATAs
     */
    accounts: ATAMap<K>;
}>;
/**
 * Gets multiple associated token account addresses.
 */
export declare const getATAAddressesSync: <K extends string>({ mints, owner, }: {
    mints: { [mint in K]: PublicKey; };
    owner: PublicKey;
}) => {
    /**
     * All ATAs
     */
    accounts: ATAMap<K>;
};
//# sourceMappingURL=ata.d.ts.map