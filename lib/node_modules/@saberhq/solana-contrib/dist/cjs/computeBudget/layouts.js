"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHeapFrameLayout = exports.RequestUnitsLayout = void 0;
const tslib_1 = require("tslib");
const BufferLayout = tslib_1.__importStar(require("@solana/buffer-layout"));
exports.RequestUnitsLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.u32("units"),
    BufferLayout.u32("additionalFee"),
]);
exports.RequestHeapFrameLayout = BufferLayout.struct([BufferLayout.u8("instruction"), BufferLayout.u32("bytes")]);
//# sourceMappingURL=layouts.js.map