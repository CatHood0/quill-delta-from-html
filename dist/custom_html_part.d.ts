import { AttributeMap, Op } from 'quill-delta';
import { HTMLElement } from 'node-html-parser';
export interface CustomHtmlPart {
    /**
     * Determines if this custom block handler matches the given HTML element.
     *
     * Implement this method to specify the conditions under which this handler
     * should be used to convert an HTML element to Delta operations.
     *
     * @param element - The HTML element to evaluate.
     * @returns `true` if this handler should be used for the given HTML element, `false` otherwise.
     *
     * Example:
     * ```typescript
     * class MyCustomBlock implements CustomHtmlPart {
     *   matches(element: DomElement): boolean {
     *     return element.tagName === 'div' && element.attribs.class === 'my-custom-class';
     *   }
     * }
     * ```
     */
    matches(element: HTMLElement): boolean;
    /**
     * Converts the HTML element into Delta operations.
     *
     * Implement this method to convert the matched HTML element into a list of Delta operations.
     *
     * @param element - The HTML element to convert.
     * @param currentAttributes - Optional. The current attributes to apply to the Delta operations.
     * @returns A list of Delta operations representing the converted content of the HTML element.
     */
    convert(element: HTMLElement, currentAttributes?: AttributeMap): Op[];
}
