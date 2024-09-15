export declare const cmSizeMultiplier: number;
export declare const mmSizeMultiplier: number;
export declare const inchSizeMultiplier: number;
export declare const pointSizeMultiplier: number;
export declare const picasSizeMultiplier: number;
/**
 * Converts various CSS units to pixels (px).
 *
 * This function supports the following units:
 * - `px` (pixels)
 * - `cm` (centimeters)
 * - `mm` (millimeters)
 * - `in` (inches)
 * - `pt` (points)
 * - `pc` (picas)
 * - `em` (relative to the font-size of the element)
 * - `rem` (relative to the font-size of the root element)
 *
 * For relative units (`em` and `rem`), you need to provide the font-size of the
 * relevant context. The default font-size is 16 pixels.
 *
 * Example usage:
 * ```javascript
 * console.log(convertToPx('2cm'));  // 75.5905511812
 * console.log(convertToPx('10mm')); // 37.7952755906
 * console.log(convertToPx('1in'));  // 96.0
 * console.log(convertToPx('12pt')); // 16.0
 * console.log(convertToPx('1pc'));  // 16.0
 * console.log(convertToPx('2em', 18.0));  // 36.0
 * console.log(convertToPx('2rem', 20.0));  // 40.0
 * ```
 *
 * @param {string} value - The CSS value to be converted, e.g., '2cm', '10mm', etc.
 * @param {number} [fontSizeEmMultiplier=16.0] - The font-size of the current element, used for `em` units.
 * @param {number} [rootFontSizeRemMultiplier=16.0] - The font-size of the root element, used for `rem` units.
 * @returns {number} The equivalent value in pixels.
 */
export declare function parseToPx(value: string, fontSizeEmMultiplier?: number, rootFontSizeRemMultiplier?: number): number | null;
