import Delta, { AttributeMap, Op } from 'quill-delta';
import { parseStyleAttribute } from './html_utils';
import { HTMLElement, TextNode } from 'node-html-parser';
import { HtmlOperations } from './html_to_operation';
import { processNode } from './node_processor';

/// Default implementation of `HtmlOperations` for converting common HTML to Delta operations.
///
/// This class provides default implementations for converting common HTML elements
/// like paragraphs, headers, lists, links, images, videos, code blocks, and blockquotes
/// into Delta operations.
export class DefaultHtmlToOperations extends HtmlOperations {

  paragraphToOp(element: HTMLElement) {
    const delta = new Delta();
    let inlineAttributes: AttributeMap = {};
    let blockAttributes: AttributeMap = {};

    // Process the style attribute
    if (
      element.getAttribute('style') !== null ||
      element.getAttribute('align') !== null ||
      element.getAttribute('dir') !== null
    ) {
      const style: string = element.getAttribute('style') || '';
      const styles2: string = element.getAttribute('align') || '';
      const styles3: string = element.getAttribute('dir') || '';
      let styleAttributes = parseStyleAttribute(style);
      const alignAttribute = parseStyleAttribute(styles2);
      const dirAttribute = parseStyleAttribute(styles3);
      Object.assign(styleAttributes, alignAttribute, dirAttribute);
      if (
        styleAttributes.hasOwnProperty('align') ||
        styleAttributes.hasOwnProperty('direction') ||
        styleAttributes.hasOwnProperty('indent')
      ) {
        if (
          styleAttributes.align !== undefined &&
          styleAttributes.align !== null
        ) {
          blockAttributes.align = styleAttributes.align;
        }

        if (
          styleAttributes.direction !== undefined &&
          styleAttributes.direction !== null
        ) {
          blockAttributes.direction = styleAttributes.direction;
        }
        if (
          styleAttributes.indent !== undefined &&
          styleAttributes.indent !== null
        ) {
          blockAttributes.indent = styleAttributes.indent;
        }
        const validAttributes: AttributeMap = {};
        for (let attrs in styleAttributes) {
          const key: string = attrs;
          const value: any = styleAttributes[key];
          if (
            value &&
            key !== 'indent' &&
            key !== 'align' &&
            key !== 'direction'
          ) {
            validAttributes[key] = value;
          }
        }
        styleAttributes = validAttributes;
      }
      Object.assign(inlineAttributes, styleAttributes);
    }

    const nodes = element.childNodes;
    // This stores all nodes into a paragraph,
    // and ensures getting all attributes or tags into a paragraph
    nodes.forEach((node) => {
      processNode(node, inlineAttributes, delta, true, this.customBlocks);
    });

    if (Object.keys(blockAttributes).length > 0) {
      for (const key in blockAttributes) {
        if (blockAttributes[key] === null) {
          delete blockAttributes[key];
        }
      }
      delta.insert('\n', blockAttributes);
    }

    return delta.ops;
  }

  spanToOp(element: HTMLElement) {
    const delta = new Delta();
    let inlineAttributes = {};

    // Process the style attribute
    if (element.getAttribute('style') !== null) {
      const style = element.getAttribute('style') || '';
      let styleAttributes = parseStyleAttribute(style);
      if (styleAttributes.hasOwnProperty('align')) {
        const validAttributes: AttributeMap = {};
        for (let attrs in styleAttributes) {
          const key: string = attrs;
          const value: any = styleAttributes[key];
          if (value && key !== 'align') {
            validAttributes[key] = value;
          }
        }
        styleAttributes = validAttributes;
      }
      Object.assign(inlineAttributes, styleAttributes);
    }

    const nodes = element.childNodes;
    // This stores all nodes into a paragraph,
    // and ensures getting all attributes or tags into a paragraph
    nodes.forEach((node) => {
      processNode(node, inlineAttributes, delta, false, this.customBlocks);
    });

    return delta.ops;
  }

  linkToOp(element: HTMLElement) {
    const delta = new Delta();
    let attributes: AttributeMap = {};

    if (element.getAttribute('href') !== null) {
      attributes.link = element.getAttribute('href');
    }

    const nodes = element.childNodes;
    nodes.forEach((node) => {
      processNode(node, attributes, delta);
    });

    return delta.ops;
  }

  headerToOp(element: HTMLElement) {
    const delta = new Delta();
    let attributes: AttributeMap = {};
    let blockAttributes: AttributeMap = {};

    if (
      element.getAttribute('style') !== null ||
      element.getAttribute('align') !== null ||
      element.getAttribute('dir') !== null
    ) {
      const style = element.getAttribute('style') || '';
      const styles2 = element.getAttribute('align') || '';
      const styles3 = element.getAttribute('dir') || '';
      let styleAttributes = parseStyleAttribute(style);
      const alignAttribute = parseStyleAttribute(styles2);
      const dirAttribute = parseStyleAttribute(styles3);
      Object.assign(styleAttributes, alignAttribute, dirAttribute);
      if (
        styleAttributes.hasOwnProperty('align') ||
        styleAttributes.hasOwnProperty('direction') ||
        styleAttributes.hasOwnProperty('indent')
      ) {
        if (
          styleAttributes.align !== undefined &&
          styleAttributes.align !== null
        ) {
          blockAttributes.align = styleAttributes.align;
        }

        if (
          styleAttributes.direction !== undefined &&
          styleAttributes.direction !== null
        ) {
          blockAttributes.direction = styleAttributes.direction;
        }
        if (
          styleAttributes.indent !== undefined &&
          styleAttributes.indent !== null
        ) {
          blockAttributes.indent = styleAttributes.indent;
        }
        const validAttributes: AttributeMap = {};
        for (let attrs in styleAttributes) {
          const key: string = attrs;
          const value: any = styleAttributes[key];
          if (
            value &&
            key !== 'indent' &&
            key !== 'align' &&
            key !== 'direction'
          ) {
            validAttributes[key] = value;
          }
        }
        styleAttributes = validAttributes;
      }
      Object.assign(attributes, styleAttributes);
    }

    const headerLevel = element.localName || 'h1';
    blockAttributes.header = parseInt(headerLevel.substring(1), 10);

    const nodes = element.childNodes;
    nodes.forEach((node) => {
      processNode(node, attributes, delta, false, this.customBlocks);
    });

    // Ensure a newline is added at the end of the header with the correct attributes
    if (Object.keys(blockAttributes).length > 0) {
      for (const key in blockAttributes) {
        if (blockAttributes[key] === null) {
          delete blockAttributes[key];
        }
      }
      delta.insert('\n', blockAttributes);
    }

    return delta.ops;
  }

  divToOp(element: HTMLElement) {
    const delta = new Delta();
    let attributes: AttributeMap = {};

    if (element.getAttribute('style') !== null) {
      const style = element.getAttribute('style') || '';
      const styleAttributes = parseStyleAttribute(style);
      Object.assign(attributes, styleAttributes);
    }

    const nodes = element.childNodes;
    nodes.forEach((node) => {
      if (node instanceof TextNode) {
        delta.insert(node.text || '');
      } else if (node instanceof HTMLElement) {
        const ops: Op[] = this.resolveCurrentElement(node, 0);
        ops.forEach((op) => {
          delta.insert(op.insert!, op.attributes);
        });
        if (node.localName === 'p') {
          delta.insert('\n');
        }
      }
    });

    return delta.ops;
  }

  listToOp(element: HTMLElement, indentLevel = 0) {
    const delta = new Delta();
    const tagName = element.localName || 'ul';
    const attributes: AttributeMap = {};
    const items = Array.from(element.childNodes).filter(
      (child) => child.rawTagName === 'li',
    );

    if (tagName === 'ul') {
      attributes.list = 'bullet';
    } else if (tagName === 'ol') {
      attributes.list = 'ordered';
    }

    const checkbox = element.querySelector('input[type="checkbox"]');
    if (checkbox) {
      const isChecked = checkbox.hasAttribute('checked');
      attributes.list = isChecked ? 'checked' : 'unchecked';
    }

    let ignoreBlockAttributesInsertion = false;
    items.forEach((item) => {
      ignoreBlockAttributesInsertion = false;
      let indent = indentLevel;

      if (!checkbox && item instanceof HTMLElement) {
        const dataChecked = item.getAttribute('data-checked');
        const blockAttrs = parseStyleAttribute(dataChecked || '');
        const isCheckList =
          item.rawTagName === 'li' &&
          Object.keys(blockAttrs).length > 0 &&
          blockAttrs.hasOwnProperty('list');
        if (isCheckList) {
          attributes.list = blockAttrs.list;
        }
      }

      // Force always the max level indentation to be five
      if (indentLevel > 5) indentLevel = 5;
      if (indentLevel > 0) attributes.indent = indentLevel;
      const nodes = item.childNodes;
      nodes.forEach((node) => {
        if (node instanceof TextNode) {
          delta.insert(node.text || '');
        } else if (node instanceof HTMLElement) {
          const element = node;
          let ops: Op[] = [];

          // If found an element list within another list, then this is nested and must insert first the block attributes
          // to separate the current element from the nested list elements
          if (element.localName === 'ul' || element.localName === 'ol') {
            indent++;
            ignoreBlockAttributesInsertion = true;
            delta.insert('\n', attributes);
          }
          ops = this.resolveCurrentElement(element, indent);
          ops.forEach((op) => {
            delta.insert(op.insert!, op.attributes);
          });
        }
      });

      if (!ignoreBlockAttributesInsertion) {
        delta.insert('\n', attributes);
      }
    });

    return delta.ops;
  }

  imgToOp(element: HTMLElement): Op[] {
    const src = element.getAttribute('src') || '';
    if (src) {
      const delta: Delta = new Delta();
      delta.insert({ image: src });
      return delta.ops;
    }
    return [];
  }

  videoToOp(element: HTMLElement): Op[] {
    const src = element.getAttribute('src') || '';
    const sourceSrc = Array.from(element.childNodes)
      .filter((node) => node instanceof Element)
      .map((node) => node.getAttribute('src'))
      .find(Boolean);
    if (src || sourceSrc) {
      const delta: Delta = new Delta();
      delta.insert({ video: src || sourceSrc });
      return delta.ops;
    }
    return [];
  }

  blockquoteToOp(element: HTMLElement): Op[] {
    const delta = new Delta();
    const blockAttributes = { blockquote: true };

    const nodes = element.childNodes;
    nodes.forEach((node) => {
      processNode(node, {}, delta, false, this.customBlocks);
    });

    delta.insert('\n', blockAttributes);

    return delta.ops;
  }

  codeblockToOp(element: HTMLElement) {
    const delta = new Delta();
    const blockAttributes = { 'code-block': true };

    const nodes = element.childNodes;
    nodes.forEach((node) => {
      processNode(node, {}, delta, false, this.customBlocks);
    });

    delta.insert('\n', blockAttributes);

    return delta.ops;
  }

  brToOp(_element: HTMLElement): Op[] {
    return [{ insert: '\n' }];
  }
}
