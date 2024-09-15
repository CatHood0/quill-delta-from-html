import { HTMLElement } from 'node-html-parser';
import { Op } from 'quill-delta';
import { CustomHtmlPart } from './custom_html_part';
/** Operations for converting supported HTML elements to Delta operations.
 *
 * This abstract class defines methods for converting various HTML elements
 * into Delta operations, which are used for rich text editing.
 *
 **/
export declare abstract class HtmlOperations {
    protected customBlocks: CustomHtmlPart[];
    /** Resolves the current HTML element into Delta operations.
     *
     * Determines the type of HTML element and converts it into corresponding Delta operations.
     *
     * Parameters:
     * - [element]: The HTML element to convert into Delta operations.
     * - [indentLevel]: The current indentation (by now is just used by listToOp).
     *
     * Returns:
     * A list of Delta operations corresponding to the HTML element.
     *
     **/
    resolveCurrentElement(element: HTMLElement, indentLevel?: number): Op[];
    abstract paragraphToOp(element: HTMLElement): Op[];
    abstract spanToOp(element: HTMLElement): Op[];
    abstract headerToOp(element: HTMLElement): Op[];
    abstract listToOp(element: HTMLElement, indentLevel: number): Op[];
    abstract imgToOp(element: HTMLElement): Op[];
    abstract linkToOp(element: HTMLElement): Op[];
    abstract videoToOp(element: HTMLElement): Op[];
    abstract blockquoteToOp(element: HTMLElement): Op[];
    abstract codeblockToOp(element: HTMLElement): Op[];
    abstract divToOp(element: HTMLElement): Op[];
    abstract brToOp(element: HTMLElement): Op[];
    setCustomBlocks(customBlocks?: CustomHtmlPart[]): void;
}
