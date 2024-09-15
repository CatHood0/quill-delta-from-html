import Delta from 'quill-delta';
import { HtmlOperations } from './html_to_operation';
import { CustomHtmlPart } from './custom_html_part';
/**
 * Default converter for html to Delta
 **/
export declare class HtmlToDelta {
    /**
     * Converts HTML tags to Delta operations based on defined rules.
     **/
    private htmlToOp;
    /**
     * List of custom HTML parts to handle non-common HTML tags.
     *
     * These custom blocks define how to convert specific HTML tags into Delta operations.
     *
     * Example:
     * ```typescript
     * const converter = new HtmlToDelta([
     *     new MyCustomHtmlPart({
     *       matches: (element) => element.rawTagName === 'my-custom-tag',
     *       convert: (element) => {
     *         return [
     *           { insert: { "custom-tag": element.text } }
     *         ];
     *       }
     *     })
     *   ]);
     * ```
     */
    private customBlocks;
    constructor(customBlocks?: CustomHtmlPart[], htmlToOperation?: HtmlOperations);
    /**
     * Converts an HTML string into Delta operations.
     *
     * Converts the HTML string [htmlText] into Delta operations using QuillJS-compatible attributes.
     * Custom blocks can be applied based on registered [customBlocks].
     *
     * Parameters:
     * - [htmlText]: The HTML string to convert into Delta operations.
     *
     * Returns:
     * A Delta object representing the formatted content from HTML.
     *
     **/
    convert(htmlText: string): Delta;
}
