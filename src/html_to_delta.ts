import Delta, { Op } from 'quill-delta';
import { parse, HTMLElement, TextNode } from 'node-html-parser';
import { DefaultHtmlToOperations } from './default_html_to_operation';
import { HtmlOperations } from './html_to_operation';
import { CustomHtmlPart } from './custom_html_part';
import { isBlock } from './html_utils';

/**
 * Default converter for html to Delta
 **/
export class HtmlToDelta {
  /**
   * Converts HTML tags to Delta operations based on defined rules.
   **/
  private htmlToOp: HtmlOperations;

  /** This is a list that must contains only the tag name
   * of the all HTML Nodes (something like: [`p`, `div`, `h1`]) that will be
   * inserted as plain text
   *
   * # Example
   * Assume that you want to ignore just HTML containers. Then just need
   * to do something like this:
   *
   * ```typescript
   * let containerBlackList: string[] = ['div', 'section', 'article'];
   *
   * let converter: HtmlToDelta = new HtmlToDelta(null, null, containerBlackList);
   * let delta = converter.convert(<your_html>);
   * ```
   **/
  private blackNodesList: string[];

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
   **/
  private customBlocks: CustomHtmlPart[];

  constructor(
    customBlocks?: CustomHtmlPart[] | null,
    htmlToOperation?: HtmlOperations | null,
    blackNodesList: string[] = [],
  ) {
    this.customBlocks = customBlocks || [];
    this.htmlToOp = htmlToOperation || new DefaultHtmlToOperations();
    //automatically set custom block
    this.htmlToOp.setCustomBlocks(this.customBlocks);
    this.blackNodesList = blackNodesList;
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
    const parsedHtmlText = htmlText.split('\n').map((e) => e.trimStart()).join('');
    const delta = new Delta();
    const document = parse(parsedHtmlText);
    const nodesToProcess =
      document.querySelector('body')?.childNodes ||
      document.querySelector('html')?.childNodes ||
      document.childNodes;
    for (let index = 0; index < nodesToProcess.length; index++) {
      const node = nodesToProcess.at(index);
      let nextNode = nodesToProcess.at(index + 1) ?? null;
      let nextIsBlock =
        nextNode === null || nextNode === undefined
          ? false
          : nextNode instanceof HTMLElement
          ? isBlock((nextNode as HTMLElement).localName)
          : false;
      if (node instanceof HTMLElement) {
        //first just verify if the customBlocks aren't empty and then store on them to
        //validate if one of them make match with the current Node
        if (this.customBlocks.length > 0) {
          let continueLoop: boolean = false;
          for (
            let index: number = 0;
            index < this.customBlocks.length;
            index++
          ) {
            const customPart = this.customBlocks[index];

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
        if (this.blackNodesList.indexOf(node.localName) >= 0) {
          delta.push({ insert: node.text });
          if (nextIsBlock) delta.insert('\n');
          continue;
        }
        const operations: Op[] = this.htmlToOp.resolveCurrentElement(
          node,
          0,
          nextIsBlock,
        );
        operations.forEach((op) => {
          delta.push(op);
        });
      }
      if (node instanceof TextNode) {
        delta.insert((node as TextNode).text);
        if (nextIsBlock) delta.push({insert: '\n'});
      }
    }

    const operation: Op = delta.ops[delta.ops.length - 1];
    const hasAttributes =
      operation.attributes !== null && operation.attributes !== undefined;
    const lastData = operation.insert;

    if (
      typeof lastData !== 'string' ||
      !lastData.endsWith('\n') ||
      hasAttributes
    ) {
      delta.insert('\n');
    }
    return delta;
  }
}
