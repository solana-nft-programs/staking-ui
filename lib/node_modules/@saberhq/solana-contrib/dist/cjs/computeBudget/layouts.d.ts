import * as BufferLayout from "@solana/buffer-layout";
export declare const RequestUnitsLayout: BufferLayout.Structure<{
    instruction: number;
    units: number;
    additionalFee: number;
}>;
export declare const RequestHeapFrameLayout: BufferLayout.Structure<{
    instruction: number;
    bytes: number;
}>;
//# sourceMappingURL=layouts.d.ts.map