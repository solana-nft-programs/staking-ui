import * as BufferLayout from "@solana/buffer-layout";
export const RequestUnitsLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.u32("units"),
    BufferLayout.u32("additionalFee"),
]);
export const RequestHeapFrameLayout = BufferLayout.struct([BufferLayout.u8("instruction"), BufferLayout.u32("bytes")]);
//# sourceMappingURL=layouts.js.map