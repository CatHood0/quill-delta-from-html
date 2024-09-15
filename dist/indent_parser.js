"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToIndent = parseToIndent;
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
function parseToIndent(value) {
    // Extract numeric part from the value and parse it to float
    let indentValue = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
    // Extract the unit part from the value
    const unit = value.replace(/[\d.]/g, '').trim();
    // Convert the value to an indentation level based on the unit
    switch (unit) {
        case 'px':
            indentValue /= 16; // Assume 16px = 1 indent level
            break;
        case 'pt':
            indentValue /= 12; // Assume 12pt = 1 indent level
            break;
        case 'pc':
            indentValue *= 1; // 1pc = 1 indent level
            break;
        case 'em':
        case 'rem':
            indentValue *= 1; // 1em or 1rem = 1 indent level
            break;
        case '%':
            indentValue /= 100; // Assume 100% = 1 indent level
            break;
        default:
            indentValue = 0; // If unit is not recognized, set indent level to 0
            break;
    }
    // Round to the nearest whole number for the indent level
    let indentLevel = Math.round(indentValue);
    return indentLevel < 1
        ? 0
        : indentLevel > 5
            ? 5
            : indentLevel;
}
