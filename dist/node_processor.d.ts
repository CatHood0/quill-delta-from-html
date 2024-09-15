import Delta, { AttributeMap } from 'quill-delta';
import { Node } from 'node-html-parser';
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
export declare function processNode(node: Node, attributes: AttributeMap, delta: Delta, addSpanAttrs?: Boolean, customBlocks?: CustomHtmlPart[], removeTheseAttributesFromSpan?: string[]): void;
