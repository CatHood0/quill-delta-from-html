import Delta, { Op } from 'quill-delta';
import { parse, HTMLElement, TextNode } from 'node-html-parser';
import { DefaultHtmlToOperations } from './default_html_to_operation';
import { HtmlOperations } from './html_to_operation';
import { CustomHtmlPart } from './custom_html_part';

/**
 * Default converter for html to Delta
 **/
export class HtmlToDelta {
  /**
   * Converts HTML tags to Delta operations based on defined rules.
   **/
  private htmlToOp: HtmlOperations;

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
  private customBlocks: CustomHtmlPart[];

  constructor(
    customBlocks?: CustomHtmlPart[],
    htmlToOperation?: HtmlOperations,
  ) {
    this.customBlocks = customBlocks || [];
    this.htmlToOp = htmlToOperation || new DefaultHtmlToOperations();
    //automatically set custom block
    this.htmlToOp.setCustomBlocks(this.customBlocks);
  }
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
  convert(htmlText: string): Delta {
    const delta = new Delta();
    const document = parse(htmlText);
    const nodesToProcess =
      document.querySelector('body')?.childNodes ||
      document.querySelector('html')?.childNodes ||
      document.childNodes;
    for (let index: number = 0; index < nodesToProcess.length; index++) {
      const node = nodesToProcess.at(index);

      if (node instanceof HTMLElement) {
        //first just verify if the customBlocks aren't empty and then store on them to
        //validate if one of them make match with the current Node
        if (this.customBlocks!.length > 0) {
          let continueLoop: Boolean = false;
          for (
            let index: number = 0;
            index < this.customBlocks.length;
            index++
          ) {
            const customPart = this.customBlocks.at(index) as CustomHtmlPart;

            if (customPart.matches(node)) {
              const ops = customPart.convert(node);
              for (let indexOp = 0; indexOp < ops.length; indexOp++) {
                const insertion = ops.at(indexOp)?.insert;
                if (insertion !== undefined) {
                  delta.insert(insertion, ops.at(indexOp)?.attributes);
                }
              }
              continueLoop = true;
              break;
            }
          }
          if (continueLoop) {
            continue;
          }
        }
        const operations: Op[] = this.htmlToOp.resolveCurrentElement(node, 0);
        operations.forEach((op) => {
          delta.insert(op.insert!, op.attributes);
        });
      }
      if (node instanceof TextNode) {
        delta.insert((node as TextNode).text);
      }
    }

    delta.insert('\n');

    return delta;
  }
}
