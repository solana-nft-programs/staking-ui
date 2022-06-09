"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsToDate = exports.dateToTs = void 0;
const tslib_1 = require("tslib");
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
/**
 * Converts a {@link Date} to a {@link BN} timestamp.
 * @param date
 * @returns
 */
const dateToTs = (date) => new bn_js_1.default(Math.floor(date.getTime() / 1000));
exports.dateToTs = dateToTs;
/**
 * Converts a {@link BN} timestamp to a {@link Date}.
 * @param ts
 * @returns
 */
const tsToDate = (ts) => new Date(ts.toNumber() * 1000);
exports.tsToDate = tsToDate;
//# sourceMappingURL=time.js.map