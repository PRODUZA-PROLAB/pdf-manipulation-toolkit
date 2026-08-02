/**
 * Shared validation helpers used across the toolkit.
 *
 * @module utils
 */

/**
 * Assert that a value is a non-empty array.
 *
 * @param {unknown} value - The value to validate.
 * @param {string} [name="value"] - Label used in the error message.
 * @throws {TypeError} When `value` is not a non-empty array.
 */
export function isNonEmptyArray(value, name = 'value') {
  if (!Array.isArray(value) || value.length === 0) {
    throw new TypeError(`${name} must be a non-empty array.`);
  }
}

/**
 * Normalise an arbitrary degree value to the closest multiple of 90 in the
 * range `[0, 360)`. PDF rotation only supports 0, 90, 180 and 270 degrees.
 *
 * @param {number} degrees - The rotation in degrees.
 * @param {string} [name="degrees"] - Label used in the error message.
 * @returns {number} The normalised angle (0, 90, 180 or 270).
 * @throws {TypeError} When `degrees` is not a finite number.
 */
export function normalizeDegrees(degrees, name = 'degrees') {
  if (!Number.isFinite(degrees)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
  const mod = ((degrees % 360) + 360) % 360;
  return Math.round(mod / 90) * 90;
}

/**
 * Assert that a page index is a valid integer within `[0, pageCount)`.
 *
 * @param {number} pageIndex - The zero-based page index.
 * @param {number} pageCount - The total number of pages.
 * @param {string} [name="pageIndex"] - Label used in the error message.
 * @throws {RangeError} When the index is out of bounds.
 */
export function validatePageIndex(pageIndex, pageCount, name = 'pageIndex') {
  if (!Number.isInteger(pageIndex) || pageIndex < 0 || pageIndex >= pageCount) {
    throw new RangeError(`${name} must be an integer between 0 and ${pageCount - 1}.`);
  }
}
