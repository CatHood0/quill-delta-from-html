// constant centimeters multiplier
export const cmSizeMultiplier: number = 37.7952755906;
// constant millimeters multiplier
export const mmSizeMultiplier: number = 3.7795275591;
// constant inches multiplier
export const inchSizeMultiplier: number = 96;
// constant points multiplier
export const pointSizeMultiplier: number = 1.3333333333;
// constant picas multiplier
export const picasSizeMultiplier: number = 16;

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
export  function parseToPx(
  value: string,
  fontSizeEmMultiplier: number = 16.0,
  rootFontSizeRemMultiplier: number = 16.0,
): number {
  // Extract the unit froue string.
  const unit = value.replace(/[0-9.]/g, '');

  // Extract the numeric part of the value string.
  const number = parseFloat(value.replace(/[a-z%]/g, '')) || 0.0;

  // Convert the numeric value to pixels based on the unit.
  switch (unit) {
    case 'px':
      return number;
    case 'cm':
      return number * cmSizeMultiplier;
    case 'mm':
      return number * mmSizeMultiplier;
    case 'in':
      return number * inchSizeMultiplier;
    case 'pt':
      return number * pointSizeMultiplier;
    case 'pc':
      return number * picasSizeMultiplier;
    case 'em':
      return number * fontSizeEmMultiplier;
    case 'rem':
      return number * rootFontSizeRemMultiplier;
    default:
      throw new Error(`Unit not supported: ${unit}`);
  }
}
