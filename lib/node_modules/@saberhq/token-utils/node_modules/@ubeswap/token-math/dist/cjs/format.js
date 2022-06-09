"use strict";
/*
 *  toFormat v2.0.0
 *  Adds a toFormat instance method to big.js or decimal.js
 *  Copyright (c) 2017 Michael Mclaughlin
 *  MIT Licence
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBig = exports.formatDecimal = exports.DEFAULT_DISPLAY_NUMBER_FORMAT = exports.DEFAULT_NUMBER_FORMAT = exports.toSignificantRounding = void 0;
const tslib_1 = require("tslib");
const big_js_1 = tslib_1.__importDefault(require("big.js"));
const decimal_js_light_1 = tslib_1.__importDefault(require("decimal.js-light"));
const tiny_invariant_1 = tslib_1.__importDefault(require("tiny-invariant"));
const constants_js_1 = require("./constants.js");
exports.toSignificantRounding = {
    [constants_js_1.Rounding.ROUND_DOWN]: decimal_js_light_1.default.ROUND_DOWN,
    [constants_js_1.Rounding.ROUND_HALF_UP]: decimal_js_light_1.default.ROUND_HALF_UP,
    [constants_js_1.Rounding.ROUND_UP]: decimal_js_light_1.default.ROUND_UP,
};
const toFixedRounding = {
    [constants_js_1.Rounding.ROUND_DOWN]: big_js_1.default.roundDown,
    [constants_js_1.Rounding.ROUND_HALF_UP]: big_js_1.default.roundHalfUp,
    [constants_js_1.Rounding.ROUND_UP]: big_js_1.default.roundUp,
};
/**
 * Default number format. (no grouping)
 */
exports.DEFAULT_NUMBER_FORMAT = {
    decimalSeparator: ".",
    groupSeparator: "",
    groupSize: 3,
    rounding: constants_js_1.Rounding.ROUND_DOWN,
};
/**
 * Default number format display.
 */
exports.DEFAULT_DISPLAY_NUMBER_FORMAT = {
    ...exports.DEFAULT_NUMBER_FORMAT,
    groupSeparator: ",",
};
const formatNum = (num, isNegative, roundingMethod, decimalPlaces, { decimalSeparator = exports.DEFAULT_NUMBER_FORMAT.decimalSeparator, groupSeparator = exports.DEFAULT_NUMBER_FORMAT.groupSeparator, groupSize = exports.DEFAULT_NUMBER_FORMAT.groupSize, rounding = exports.DEFAULT_NUMBER_FORMAT.rounding, } = exports.DEFAULT_NUMBER_FORMAT) => {
    const decInternal = num;
    if (!decInternal.e && decInternal.e !== 0) {
        return num.toString(); // Infinity/NaN
    }
    const [integerPart, fractionPart] = num
        .toFixed(decimalPlaces, roundingMethod === "fixed"
        ? toFixedRounding[rounding]
        : exports.toSignificantRounding[rounding])
        .split(".");
    (0, tiny_invariant_1.default)(integerPart);
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
const formatDecimal = (dec, decimalPlaces, fmt = exports.DEFAULT_NUMBER_FORMAT) => {
    return formatNum(dec, dec.isNegative(), "significant", decimalPlaces, fmt);
};
exports.formatDecimal = formatDecimal;
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
const formatBig = (big, decimalPlaces, fmt = exports.DEFAULT_NUMBER_FORMAT) => {
    return formatNum(big, big.s === -1, "fixed", decimalPlaces, fmt);
};
exports.formatBig = formatBig;
//# sourceMappingURL=format.js.map