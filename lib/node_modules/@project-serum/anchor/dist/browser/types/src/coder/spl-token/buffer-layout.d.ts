/// <reference types="node" />
import BN from "bn.js";
import { Layout } from "buffer-layout";
import { PublicKey } from "@solana/web3.js";
export declare function uint64(property?: string): Layout<u64 | null>;
export declare function bool(property?: string): Layout<boolean>;
export declare function publicKey(property?: string): Layout<PublicKey>;
export declare function coption<T>(layout: Layout<T>, property?: string): Layout<T | null>;
export declare class COptionLayout<T> extends Layout<T | null> {
    layout: Layout<T>;
    discriminator: Layout<number>;
    constructor(layout: Layout<T>, property?: string);
    encode(src: T | null, b: Buffer, offset?: number): number;
    decode(b: Buffer, offset?: number): T | null;
    getSpan(b: Buffer, offset?: number): number;
}
export declare class u64 extends BN {
    /**
     * Convert to Buffer representation
     */
    toBuffer(): Buffer;
    /**
     * Construct a u64 from Buffer representation
     */
    static fromBuffer(buffer: Buffer): u64;
}
//# sourceMappingURL=buffer-layout.d.ts.map