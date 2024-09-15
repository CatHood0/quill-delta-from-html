import Delta, { AttributeMap } from 'quill-delta';
import { Node, HTMLElement, TextNode } from 'node-html-parser';
import {
  isStrong,
  isItalic,
  isUnderline,
  isStrike,
  isSubscript,
  isSuperscript,
  isSpan,
  parseStyleAttribute,
  parseImageStyleAttribute,
  isImg,
  isVideo,
  isLink,
  isBreakLine,
} from './html_utils';
import { CustomHtmlPart } from './custom_html_part';

/**
 * Processes a DOM node, converting it into Quill Delta operations.
 *
 * Recursively processes the DOM nodes, converting text nodes, inline styles,
 * links, and custom HTML blocks into Quill Delta operations.
 *
 * @param {Node} node - The DOM node to process.
 * @param {Object} attributes - The current Delta attributes to apply.
 * @param {Delta} delta - The Delta object to push operations into.
 * @param {boolean} [addSpanAttrs=false] - Whether to add attributes from <span> tags.
 */
export function processNode(
  node: Node,
  attributes: AttributeMap,
  delta: Delta,
  addSpanAttrs: Boolean = false,
  customBlocks: CustomHtmlPart[] = [],
  removeTheseAttributesFromSpan: string[] = [],
): void {
  if (node instanceof TextNode) {
    const validAttributes: AttributeMap = {};
    for (let attrs in attributes) {
      const key: string = attrs;
      const value: any = attributes[key];
      if (value && key !== 'indent' && key !== 'align' && key !== 'direction') {
        validAttributes[key] = value;
      }
    }
    if (Object.keys(validAttributes).length > 0) {
      delta.insert(node.text || '', validAttributes);
    } else {
      delta.insert(node.text || '');
    }
  } else if (node instanceof HTMLElement) {
    let newAttributes: AttributeMap = { ...attributes };

    // Apply inline styles based on tag type
    if (isStrong(node)) newAttributes['bold'] = true;
    if (isItalic(node)) newAttributes['italic'] = true;
    if (isUnderline(node)) newAttributes['underline'] = true;
    if (isStrike(node)) newAttributes['strike'] = true;
    if (isSubscript(node)) newAttributes['script'] = 'sub';
    if (isSuperscript(node)) newAttributes['script'] = 'super';

    if (customBlocks!.length > 0) {
      let continueLoop: Boolean = false;
      for (let index: number = 0; index < customBlocks.length; index++) {
        const customPart = customBlocks.at(index) as CustomHtmlPart;
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
      if(continueLoop){
        return;
      }
    }

    // Use custom block definitions if provided
    // Handle <span> tags
    if (isSpan(node)) {
      let spanAttributes = parseStyleAttribute(
        node.getAttribute('style') || '',
      );
      if (addSpanAttrs) {
        let newCopyAttr: AttributeMap = {};
        for(const key in newAttributes){
          if(key === 'align' || key === 'direction' || key === 'indent'){
            continue;
          }
          if(newAttributes[key] !== null && newAttributes[key] !== undefined && removeTheseAttributesFromSpan.indexOf(key) <= -1){
            newCopyAttr[key] = newAttributes[key]; 
          }         
        }
        if(removeTheseAttributesFromSpan) {
          let copyAttributes: AttributeMap = {};
          for(const key in spanAttributes){
            if(spanAttributes[key] !== null && spanAttributes[key] !== undefined && removeTheseAttributesFromSpan.indexOf(key) <= -1){
              copyAttributes[key] = spanAttributes[key]; 
            } else if(key === 'align' || key === 'direction' || key === 'indent'){
              continue;
            }
          }
          spanAttributes = copyAttributes;
        }
        Object.assign(newAttributes, spanAttributes);
      }
    }

    // Handle <img> tags
    if (isImg(node)) {
      const src = node.getAttribute('src') || '';
      const styles = node.getAttribute('style') || '';
      const imgAttributes = parseImageStyleAttribute(styles);
      if (src) {
        delta.insert(
          { image: src },
          styles
            ? {
                style: Object.entries(imgAttributes)
                  .map((entry) => `${entry[0]}:${entry[1]}`)
                  .join(';'),
              }
            : null,
        );
      }
    }

    // Handle <video> tags
    if (isVideo(node)) {
      const src = node.getAttribute('src');
      const sourceSrc = Array.from(node.childNodes)
        .find((child) => child instanceof Element)
        ?.getAttribute('src');
      if ((src && src.length) || (sourceSrc && sourceSrc.length)) {
        delta.insert({ video: src || sourceSrc });
      }
    }

    // Handle <a> tags (links)
    if (isLink(node)) {
      const href = node.getAttribute('href');
      if (href) {
        delete newAttributes['indent'];
        newAttributes['link'] = href;
      }
    }

    // Handle <br> tags (line breaks)
    if (isBreakLine(node)) {
      delete newAttributes['align'];
      delete newAttributes['direction'];
      delete newAttributes['indent'];
      delta.insert('\n');
    }

    // Recursively process child nodes
    for (let child of node.childNodes) {
      processNode(child, newAttributes, delta, addSpanAttrs);
    }
  }
}
