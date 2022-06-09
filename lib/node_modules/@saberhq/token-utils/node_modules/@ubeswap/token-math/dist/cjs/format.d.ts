import { default as Big } from "big.js";
import { default as Decimal } from "decimal.js-light";
import { Rounding } from "./constants.js";
export declare const toSignificantRounding: {
    0: number;
    1: number;
    2: number;
};
/**
 * Default number format. (no grouping)
 */
export declare const DEFAULT_NUMBER_FORMAT: Required<NumberFormat>;
/**
 * Default number format display.
 */
export declare const DEFAULT_DISPLAY_NUMBER_FORMAT: Required<NumberFormat>;
/**
 * Formatting options for Decimal.js.
 */
export interface NumberFormat {
    decimalSeparator?: string;
    groupSeparator?: string;
    groupSize?: number;
    rounding?: Rounding;
}
export declare const formatDecimal: (dec: Decimal, decimalPlaces: number, fmt?: NumberFormat) => string;
export declare const formatBig: (big: Big, decimalPlaces: number, fmt?: NumberFormat) => string;
//# sourceMappingURL=format.d.ts.map