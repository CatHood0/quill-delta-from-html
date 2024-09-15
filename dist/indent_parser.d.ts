/**
 * Converts a CSS `padding-left` or `padding-right` value to a standardized indentation level.
 *
 * The method supports various units such as `px`, `pt`, `pc`, `em`, `rem`, and `%`.
 * The conversion is based on the following assumptions:
 * - `16px` equals 1 indentation level
 * - `12pt` equals 1 indentation level
 * - `1pc` equals 1 indentation level
 * - `1em` or `1rem` equals 1 indentation level
 * - `100%` equals 1 indentation level
 *
 * If the unit is not recognized, the indentation level defaults to 0.
 *
 * @param {string} value - The CSS `padding-left` or `padding-right` value as a string (e.g., "32px", "2em").
 * @returns {number} The corresponding indentation level as an integer.
 */
export declare function parseToIndent(value: string): number;
