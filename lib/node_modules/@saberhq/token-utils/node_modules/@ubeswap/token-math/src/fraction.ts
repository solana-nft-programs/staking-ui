import { default as Big } from "big.js";
import { default as Decimal } from "decimal.js-light";
import { default as JSBI } from "jsbi";
import { default as invariant } from "tiny-invariant";

import { ONE, Rounding, ZERO } from "./constants.js";
import type { NumberFormat } from "./format.js";
import { formatBig, formatDecimal, toSignificantRounding } from "./format.js";
import type { BigintIsh } from "./utils.js";
import { parseBigintIsh } from "./utils.js";

/**
 * Attempts to parse a {@link Fraction}.
 * @param fractionish Fraction or BigintIsh.
 * @returns
 */
const tryParseFraction = (fractionish: BigintIsh | Fraction): Fraction => {
  if (Fraction.isFraction(fractionish)) {
    return fractionish;
  }

  try {
    return new Fraction(parseBigintIsh(fractionish));
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Could not parse fraction: ${e.message}`);
    }
    throw new Error(`Could not parse fraction`);
  }
};

/**
 * Interface representing a Fraction.
 */
export interface FractionObject {
  /**
   * This boolean checks to see if this is actually a {@link Fraction}.
   */
  readonly isFraction: true;

  /**
   * Fraction numerator.
   */
  readonly numeratorStr: string;

  /**
   * Fraction denominator.
   */
  readonly denominatorStr: string;
}

/**
 * Creates a {@link Fraction} from a {@link FractionObject}.
 * @param param0
 * @returns
 */
export const fractionFromObject = ({
  numeratorStr,
  denominatorStr,
}: FractionObject): Fraction => {
  return new Fraction(numeratorStr, denominatorStr);
};

/**
 * Number with an integer numerator and denominator.
 */
export class Fraction implements FractionObject {
  readonly isFraction: true = true;
  get numeratorStr(): string {
    return this.numerator.toString();
  }
  get denominatorStr(): string {
    return this.numerator.toString();
  }

  readonly numerator: JSBI;
  readonly denominator: JSBI;

  static readonly ZERO: Fraction = new Fraction(0);
  static readonly ONE: Fraction = new Fraction(1);

  constructor(numerator: BigintIsh, denominator: BigintIsh = ONE) {
    this.numerator = parseBigintIsh(numerator);
    this.denominator = parseBigintIsh(denominator);
  }

  /**
   * Ensures the other object is of this {@link Fraction} type.
   * @param other
   * @returns
   */
  static fromObject(other: FractionObject): Fraction {
    if (other instanceof Fraction) {
      return other;
    }
    return fractionFromObject(other);
  }

  /**
   * JSON representation of the {@link Fraction}.
   */
  toJSON(): FractionObject {
    return {
      isFraction: true,
      numeratorStr: this.numerator.toString(),
      denominatorStr: this.denominator.toString(),
    };
  }

  /**
   * Returns true if the other object is a {@link Fraction}.
   *
   * @param other
   * @returns
   */
  static isFraction(other: unknown): other is Fraction {
    return (
      typeof other === "object" &&
      other !== null &&
      "numerator" in other &&
      "denominator" in other
    );
  }

  /**
   * Compares this {@link Fraction} to the other {@link Fraction}.
   */
  compareTo(other: Fraction): -1 | 0 | 1 {
    if (this.equalTo(other)) {
      return 0;
    }
    return this.greaterThan(other) ? 1 : -1;
  }

  /**
   * Parses a {@link Fraction} from a float.
   * @param number Number to parse.
   * @param decimals Number of decimals of precision. (default 10)
   * @returns Fraction
   */
  static fromNumber(number: number, decimals = 10): Fraction {
    const multiplier = Math.pow(10, decimals);
    return new Fraction(Math.floor(number * multiplier), multiplier);
  }

  /**
   * Performs floor division.
   */
  get quotient(): JSBI {
    return JSBI.divide(this.numerator, this.denominator);
  }

  /**
   * Remainder after floor division.
   */
  get remainder(): Fraction {
    return new Fraction(
      JSBI.remainder(this.numerator, this.denominator),
      this.denominator
    );
  }

  /**
   * Swaps the numerator and denominator of the {@link Fraction}.
   * @returns
   */
  invert(): Fraction {
    return new Fraction(this.denominator, this.numerator);
  }

  add(other: Fraction | BigintIsh): Fraction {
    const otherParsed = tryParseFraction(other);
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(
        JSBI.add(this.numerator, otherParsed.numerator),
        this.denominator
      );
    }
    return new Fraction(
      JSBI.add(
        JSBI.multiply(this.numerator, otherParsed.denominator),
        JSBI.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    );
  }

  subtract(other: Fraction | BigintIsh): Fraction {
    const otherParsed = tryParseFraction(other);
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(
        JSBI.subtract(this.numerator, otherParsed.numerator),
        this.denominator
      );
    }
    return new Fraction(
      JSBI.subtract(
        JSBI.multiply(this.numerator, otherParsed.denominator),
        JSBI.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    );
  }

  lessThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = tryParseFraction(other);
    return JSBI.lessThan(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    );
  }

  equalTo(other: Fraction | BigintIsh): boolean {
    const otherParsed = tryParseFraction(other);
    return JSBI.equal(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    );
  }

  greaterThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = tryParseFraction(other);
    return JSBI.greaterThan(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    );
  }

  multiply(other: Fraction | BigintIsh): Fraction {
    const otherParsed = tryParseFraction(other);
    return new Fraction(
      JSBI.multiply(this.numerator, otherParsed.numerator),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    );
  }

  /**
   * Divides this {@link Fraction} by another {@link Fraction}.
   */
  divide(other: Fraction | BigintIsh): Fraction {
    const otherParsed = tryParseFraction(other);
    return new Fraction(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(this.denominator, otherParsed.numerator)
    );
  }

  /**
   * Converts this {@link Fraction} to a string with the specified significant digits.
   * @param significantDigits
   * @param format
   * @param rounding
   * @returns
   */
  toSignificant(
    significantDigits: number,
    format: NumberFormat = { groupSeparator: "" },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    invariant(
      Number.isInteger(significantDigits),
      `${significantDigits} is not an integer.`
    );
    invariant(significantDigits > 0, `${significantDigits} is not positive.`);

    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding],
    });
    const quotient = new Decimal(this.numerator.toString())
      .div(this.denominator.toString())
      .toSignificantDigits(significantDigits);
    return formatDecimal(quotient, quotient.decimalPlaces(), {
      ...format,
      rounding,
    });
  }

  toFixed(
    decimalPlaces: number,
    format: NumberFormat = { groupSeparator: "" },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    invariant(
      Number.isInteger(decimalPlaces),
      `${decimalPlaces} is not an integer.`
    );
    invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`);

    return formatBig(
      new Big(this.numerator.toString()).div(this.denominator.toString()),
      decimalPlaces,
      { ...format, rounding }
    );
  }

  /**
   * Helper method for converting any super class back to a fraction
   */
  get asFraction(): Fraction {
    return new Fraction(this.numerator, this.denominator);
  }

  /**
   * Gets the value of this {@link Fraction} as a number.
   */
  get asNumber(): number {
    if (JSBI.equal(this.denominator, ZERO)) {
      return JSBI.greaterThan(this.numerator, ZERO)
        ? Number.POSITIVE_INFINITY
        : JSBI.lessThan(this.numerator, ZERO)
        ? Number.NEGATIVE_INFINITY
        : Number.NaN;
    }
    const result =
      JSBI.toNumber(this.numerator) / JSBI.toNumber(this.denominator);
    if (!Number.isNaN(result)) {
      return result;
    }
    return parseFloat(this.toFixed(10));
  }

  /**
   * Returns true if this number (the numerator) is equal to zero and the denominator is non-zero.
   * @returns
   */
  isZero(): boolean {
    return JSBI.EQ(this.numerator, ZERO) && JSBI.NE(this.denominator, ZERO);
  }

  /**
   * Returns true if this number (the numerator) is not equal to zero.
   * @returns
   */
  isNonZero(): boolean {
    return !this.isZero();
  }
}
