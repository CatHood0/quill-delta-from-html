import { HTMLElement } from 'node-html-parser';
import Delta, { Op } from 'quill-delta';
import { CustomHtmlPart } from './custom_html_part';
import {
  isBreakLine,
  isParagraph,
  isVideo,
  isImg,
  isSpan,
  isLink,
  isHeader,
  isDivBlock,
  isBlockquote,
  isList,
  isCodeBlock,
  isInline,
  getInlineAttributes,
} from './html_utils';
import { processNode } from './node_processor';
/** Operations for converting supported HTML elements to Delta operations.
 *
 * This abstract class defines methods for converting various HTML elements
 * into Delta operations, which are used for rich text editing.
 *
 **/
export abstract class HtmlOperations {
  protected customBlocks: CustomHtmlPart[] = [];
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
  resolveCurrentElement(
    element: HTMLElement,
    indentLevel: number = 0,
    nextIsBlock: Boolean = false,
  ): Op[] {
    let ops: Op[] = [];
    if (!element.tagName) {
      ops.push({ insert: element.text || '' });
      return ops;
    }
    // Inlines
    //
    // the current element could be into a <li> then it's node can be
    // a <strong> or a <em>, or even a <span> then we first need to verify
    // if a inline an store into it to parse the attributes as we need
    if (isInline(element.tagName)) {
      const delta = new Delta();
      const attributes = getInlineAttributes(element);
      for (let index = 0; index < element.childNodes.length; index++) {
        const node = element.childNodes.at(index);
        if (node instanceof HTMLElement) {
          processNode(node, attributes, delta, false, this.customBlocks);
        }
      }
      ops.push(...delta.ops);
    }

    if (isBreakLine(element)) {
      ops.push(...this.brToOp(element));
    }
    if (isParagraph(element)) {
      ops.push(...this.paragraphToOp(element));
    }
    if (isHeader(element)) {
      ops.push(...this.headerToOp(element));
    }
    if (isList(element)) {
      ops.push(...this.listToOp(element, indentLevel));
    }
    if (isSpan(element)) {
      ops.push(...this.spanToOp(element));
    }
    if (isLink(element)) {
      ops.push(...this.linkToOp(element));
    }
    if (isImg(element)) {
      ops.push(...this.imgToOp(element));
    }
    if (isVideo(element)) {
      ops.push(...this.videoToOp(element));
    }
    if (isBlockquote(element)) {
      ops.push(...this.blockquoteToOp(element));
    }
    if (isCodeBlock(element)) {
      ops.push(...this.codeblockToOp(element));
    }
    if (isDivBlock(element)) {
      ops.push(...this.divToOp(element));
    }

    if (nextIsBlock) ops.push({ insert: '\n' });
    return ops;
  }

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

  setCustomBlocks(customBlocks?: CustomHtmlPart[]): void {
    this.customBlocks = customBlocks || [];
  }
}
