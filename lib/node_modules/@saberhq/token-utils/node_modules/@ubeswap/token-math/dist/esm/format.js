/*
 *  toFormat v2.0.0
 *  Adds a toFormat instance method to big.js or decimal.js
 *  Copyright (c) 2017 Michael Mclaughlin
 *  MIT Licence
 */
import { default as Big } from "big.js";
import { default as Decimal } from "decimal.js-light";
import { default as invariant } from "tiny-invariant";
import { Rounding } from "./constants.js";
export const toSignificantRounding = {
    [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
    [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
    [Rounding.ROUND_UP]: Decimal.ROUND_UP,
};
const toFixedRounding = {
    [Rounding.ROUND_DOWN]: Big.roundDown,
    [Rounding.ROUND_HALF_UP]: Big.roundHalfUp,
    [Rounding.ROUND_UP]: Big.roundUp,
};
/**
 * Default number format. (no grouping)
 */
export const DEFAULT_NUMBER_FORMAT = {
    decimalSeparator: ".",
    groupSeparator: "",
    groupSize: 3,
    rounding: Rounding.ROUND_DOWN,
};
/**
 * Default number format display.
 */
export const DEFAULT_DISPLAY_NUMBER_FORMAT = {
    ...DEFAULT_NUMBER_FORMAT,
    groupSeparator: ",",
};
const formatNum = (num, isNegative, roundingMethod, decimalPlaces, { decimalSeparator = DEFAULT_NUMBER_FORMAT.decimalSeparator, groupSeparator = DEFAULT_NUMBER_FORMAT.groupSeparator, groupSize = DEFAULT_NUMBER_FORMAT.groupSize, rounding = DEFAULT_NUMBER_FORMAT.rounding, } = DEFAULT_NUMBER_FORMAT) => {
    const decInternal = num;
    if (!decInternal.e && decInternal.e !== 0) {
        return num.toString(); // Infinity/NaN
    }
    const [integerPart, fractionPart] = num
        .toFixed(decimalPlaces, roundingMethod === "fixed"
        ? toFixedRounding[rounding]
        : toSignificantRounding[rounding])
        .split(".");
    invariant(integerPart);
    let displayIntegerPart = integerPart;
    if (groupSeparator) {
        // integer digits
        const intd = isNegative ? integerPart.slice(1) : integerPart;
        // number of integer digits
        const nd = intd.length;
        if (groupSize > 0 && nd > 0) {
            let i = nd % groupSize || groupSize;
            displayIntegerPart = intd.slice(0, i);
            for (; i < nd; i += groupSize) {
                displayIntegerPart += groupSeparator + intd.slice(i, i + groupSize);
            }
            if (isNegative) {
                displayIntegerPart = "-" + displayIntegerPart;
            }
        }
    }
    if (fractionPart) {
        return displayIntegerPart + (decimalSeparator !== null && decimalSeparator !== void 0 ? decimalSeparator : "") + fractionPart;
    }
    else {
        return displayIntegerPart;
    }
};
/*
 *  Returns a string representing the value of this big number in fixed-point notation to `dp`
 *  decimal places using rounding mode `rm`, and formatted according to the properties of the
 * `fmt`, `this.format` and `this.constructor.format` objects, in that order of precedence.
 *
 *  Example:
 *
 *  x = new Decimal('123456789.987654321')
 *
 *  // Add a format object to the constructor...
 *  Decimal.format = {
 *    decimalSeparator: '.',
 *    groupSeparator: ',',
 *    groupSize: 3,
 *    secondaryGroupSize: 0,
 *    fractionGroupSeparator: '',     // '\xA0' non-breaking space
 *    fractionGroupSize : 0
 *  }
 *
 *  x.toFormat();                // 123,456,789.987654321
 *  x.toFormat(2, 1);            // 123,456,789.98
 *
 *  // And/or add a format object to the big number itself...
 *  x.format = {
 *    decimalSeparator: ',',
 *    groupSeparator: '',
 *  }
 *
 *  x.toFormat();                // 123456789,987654321
 *
 *  format = {
 *    decimalSeparator: '.',
 *    groupSeparator: ' ',
 *    groupSize: 3,
 *    fractionGroupSeparator: ' ',     // '\xA0' non-breaking space
 *    fractionGroupSize : 5
 *  }
 *  // And/or pass a format object to the method call.
 *  x.toFormat(format);          // 123 456 789.98765 4321
 *  x.toFormat(4, format);       // 123 456 789.9877
 *  x.toFormat(2, 1, format);    // 123 456 789.98
 *
 *  [dp] {number} Decimal places. Integer.
 *  [rm] {number} Rounding mode. Integer, 0 to 8. (Ignored if using big.js.)
 *  [fmt] {Object} A format object.
 *
 */
export const formatDecimal = (dec, decimalPlaces, fmt = DEFAULT_NUMBER_FORMAT) => {
    return formatNum(dec, dec.isNegative(), "significant", decimalPlaces, fmt);
};
/*
 *  Returns a string representing the value of this big number in fixed-point notation to `dp`
 *  decimal places using rounding mode `rm`, and formatted according to the properties of the
 * `fmt`, `this.format` and `this.constructor.format` objects, in that order of precedence.
 *
 *  Example:
 *
 *  x = new Decimal('123456789.987654321')
 *
 *  // Add a format object to the constructor...
 *  Decimal.format = {
 *    decimalSeparator: '.',
 *    groupSeparator: ',',
 *    groupSize: 3,
 *    secondaryGroupSize: 0,
 *    fractionGroupSeparator: '',     // '\xA0' non-breaking space
 *    fractionGroupSize : 0
 *  }
 *
 *  x.toFormat();                // 123,456,789.987654321
 *  x.toFormat(2, 1);            // 123,456,789.98
 *
 *  // And/or add a format object to the big number itself...
 *  x.format = {
 *    decimalSeparator: ',',
 *    groupSeparator: '',
 *  }
 *
 *  x.toFormat();                // 123456789,987654321
 *
 *  format = {
 *    decimalSeparator: '.',
 *    groupSeparator: ' ',
 *    groupSize: 3,
 *    fractionGroupSeparator: ' ',     // '\xA0' non-breaking space
 *    fractionGroupSize : 5
 *  }
 *  // And/or pass a format object to the method call.
 *  x.toFormat(format);          // 123 456 789.98765 4321
 *  x.toFormat(4, format);       // 123 456 789.9877
 *  x.toFormat(2, 1, format);    // 123 456 789.98
 *
 *  [dp] {number} Decimal places. Integer.
 *  [rm] {number} Rounding mode. Integer, 0 to 8. (Ignored if using big.js.)
 *  [fmt] {Object} A format object.
 *
 */
export const formatBig = (big, decimalPlaces, fmt = DEFAULT_NUMBER_FORMAT) => {
    return formatNum(big, big.s === -1, "fixed", decimalPlaces, fmt);
};
//# sourceMappingURL=format.js.map