import BN from "bn.js";
/**
 * Converts a {@link Date} to a {@link BN} timestamp.
 * @param date
 * @returns
 */
export const dateToTs = (date) => new BN(Math.floor(date.getTime() / 1000));
/**
 * Converts a {@link BN} timestamp to a {@link Date}.
 * @param ts
 * @returns
 */
export const tsToDate = (ts) => new Date(ts.toNumber() * 1000);
//# sourceMappingURL=time.js.map